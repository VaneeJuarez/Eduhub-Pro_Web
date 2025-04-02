"use client"

import { useEffect, useState } from "react"
import { Modal, Button, Form, Spinner } from "react-bootstrap"

// Styles
import styles from "../../styles/modal.module.css"
import { uploadFile } from "../../api/global/global"

function LessonModal({ show, onHide, onSave, initialData = {} }) {
  const [formData, setFormData] = useState({
    sectionId: initialData?.sectionId || "",
    title: initialData?.title || "",
    type: initialData?.type || "video",
    content: initialData?.url || "",
    description: initialData?.description || "",
  })

  const [isUploading, setIsUploading] = useState(false);
  const [contentFile, setContentFile] = useState(null)
  const [contentPreview, setContentPreview] = useState(initialData?.content || "")

  useEffect(() => {
    if (show) {
      setFormData({
        sectionId: initialData?.sectionId || "",
        title: initialData?.title || "",
        type: initialData?.type || "video",
        content: initialData?.url || "",
        description: initialData?.description || "",
      });
      setContentPreview(initialData?.url || "");
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (e) => {
    // Resetear el archivo y la vista previa cuando cambia el tipo
    setContentFile(null)
    setContentPreview("")
    setFormData((prev) => ({
      ...prev,
      type: e.target.value,
      content: "",
    }))
  }

  const handleContentFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const result = await uploadFile(file);

    if (!result.success) {
      setIsUploading(false);
      return;
    }

    const contentUrl = result.data;
    setContentFile(file);
    setContentPreview(contentUrl);
    setFormData((prev) => ({ ...prev, content: contentUrl }));

    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      content: contentPreview, // Usar la URL del contenido
    })
  }

  // Determinar el tipo de archivo aceptado según el tipo de lección
  const getAcceptedFileTypes = () => {
    switch (formData.type) {
      case "video":
        return "video/*"
      case "pdf":
        return "application/pdf"
      case "image":
        return "image/*"
      default:
        return ""
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className={styles.ModalTitle}>{initialData?.title ? "Editar Lección" : "Agregar Nueva Lección"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} className={styles.Form}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Título de la Lección</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Contenido</Form.Label>
            <Form.Select name="type" value={formData.type} onChange={handleTypeChange} className={styles.Select}>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
              <option value="image">Imagen</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Archivo de Contenido</Form.Label>
            <Form.Control
              type="file"
              accept={getAcceptedFileTypes()}
              onChange={handleContentFileChange}
              required={!initialData?.url}
            />

            {contentPreview && formData.type === "image" && (

              <div className="mt-2">
                <img
                  src={contentPreview || "/placeholder.svg"}
                  alt="Vista previa"
                  style={{ maxHeight: "150px", maxWidth: "100%" }}
                  className="border rounded"
                />
              </div>
            )}
            {contentPreview && formData.type === "video" && (
              <div className="mt-2">
                <video
                  src={contentPreview}
                  controls
                  style={{ maxHeight: "150px", maxWidth: "100%" }}
                  className="border rounded"
                />
              </div>
            )}
            {contentPreview && formData.type === "pdf" && (
              <div className="mt-2">
                <p className="text-success">PDF cargado correctamente</p>
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isUploading || !formData.content}>
            {isUploading ? (
              <>
                Subiendo
                <Spinner animation="border" size="sm" className="me-2" />
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default LessonModal

