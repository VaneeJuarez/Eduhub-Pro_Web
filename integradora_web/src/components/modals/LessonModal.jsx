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
    content: initialData?.content || "",
    description: initialData?.description || "",
    duration: initialData?.duration || 0, // Duración en minutos
    pdfPages: initialData?.pdfPages || 1, // Número de páginas para PDFs
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
        content: initialData?.content || "",
        description: initialData?.description || "",
        duration: initialData?.duration || 0,
        pdfPages: initialData?.pdfPages || 1,
      });
      setContentPreview(initialData?.content || "");
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Función para calcular la duración del video
  const handleVideoLoad = (e) => {
    if (formData.type === "video") {
      const videoDuration = Math.ceil(e.target.duration / 60) // Convertir a minutos redondeando
      setFormData((prev) => ({ ...prev, duration: videoDuration }))
    }
  }

  const handleTypeChange = (e) => {
    // Resetear el archivo y la vista previa cuando cambia el tipo
    setContentFile(null)
    setContentPreview("")

    const newType = e.target.value
    let defaultDuration = 0

    // Establecer duraciones predeterminadas según el tipo
    if (newType === "image") {
      defaultDuration = 5 // 5 minutos para imágenes
    } else if (newType === "pdf") {
      // Para PDFs, la duración se calculará basada en el número de páginas
      defaultDuration = formData.pdfPages * 5 // 5 minutos por página
    }

    setFormData((prev) => ({
      ...prev,
      type: newType,
      content: "",
      duration: defaultDuration,
    }))
  }

  // Manejador para cambios en el número de páginas del PDF
  const handlePdfPagesChange = (e) => {
    const pages = Number.parseInt(e.target.value) || 1
    const duration = pages * 5 // 5 minutos por página
    setFormData((prev) => ({ ...prev, pdfPages: pages, duration: duration }))
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

    // Establecer duración predeterminada
    if (formData.type === "image") {
      setFormData((prev) => ({ ...prev, content: contentUrl, duration: 5 }))
    } else if (formData.type === "pdf") {
      setFormData((prev) => ({ ...prev, content: contentUrl }))
    } else {
      // Para videos, la duración se calculará cuando se cargue el video
      setFormData((prev) => ({ ...prev, content: contentUrl }))
    }

    // setFormData((prev) => ({ ...prev, content: contentUrl }));

    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      content: contentPreview, // Usar la URL del contenido
    })
  }

  // Agregar el campo de duración manual para permitir ajustes 
  const handleDurationChange = (e) => {
    const duration = Number.parseInt(e.target.value) || 0
    setFormData((prev) => ({ ...prev, duration }))
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
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required maxLength={40} />
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
              required={!initialData?.content}
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
                  onLoadedMetadata={handleVideoLoad}
                />
              </div>
            )}
            {contentPreview && formData.type === "pdf" && (
              <div className="mt-2">
                <p className="text-success">PDF cargado correctamente</p>
              </div>
            )}
          </Form.Group>

          {formData.type === "pdf" && (
            <Form.Group className="mb-3">
              <Form.Label>Número de páginas del PDF</Form.Label>
              <Form.Control type="number" min="1" value={formData.pdfPages} onChange={handlePdfPagesChange} required />
              <Form.Text className="text-muted">
                La duración se calculará automáticamente (5 minutos por página).
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control type="number" min="1" value={formData.duration} onChange={handleDurationChange} required />
            <Form.Text className="text-muted">
              {formData.type === "video"
                ? "La duración se calcula automáticamente al cargar el video, pero puede ajustarla."
                : formData.type === "pdf"
                  ? "Calculada en base al número de páginas, pero puede ajustarla."
                  : "Duración predeterminada para imágenes: 5 minutos, pero puede ajustarla."}
            </Form.Text>
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
              maxLength={120}
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



