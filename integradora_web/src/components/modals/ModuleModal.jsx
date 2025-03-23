"use client"

import { useState, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"

// Styles
import styles from "../../styles/modal.module.css"

function ModuleModal({ show, onHide, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    lessons: initialData?.lessons || [],
  })

   // Resetear el formulario cuando se abre el modal para un nuevo módulo
   useEffect(() => {
    if (show && !initialData) {
      setFormData({
        title: "",
        lessons: [],
      })
    } else if (show && initialData) {
      setFormData({
        title: initialData.title || "",
        lessons: initialData.lessons || [],
      })
    }
  }, [show, initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Si estamos editando un módulo existente, preservar las lecciones
    if (initialData) {
      onSave({
        ...formData,
        title: formData.title,
        lessons: initialData.lessons || [],
      })
    } else {
      onSave({
        ...formData,
        title: formData.title,
        lessons: [],
      })
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className={styles.ModalTitle}>{initialData ? "Editar Módulo" : "Agregar Nuevo Módulo"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit} className={styles.Form}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Título del Módulo</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ModuleModal

