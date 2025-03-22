"use client"

import { useState } from "react"
import { Container, Button, Toast } from "react-bootstrap"
import CourseList from "../../components/CourseList"
import AddCourseModal from "../../components/modals/AddCourseModal"

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", body: "" })

  const handleSaveCourse = (course) => {
    // En una aplicación real, aquí guardaríamos el curso en la base de datos
    // y obtendríamos un ID real
    const newCourseId = Date.now().toString()

    // Simulamos guardar el curso en localStorage para mantener los datos
    const existingCourses = JSON.parse(localStorage.getItem("courses") || "[]")
    const newCourse = {
      ...course,
      id: newCourseId,
      instructor: "Usuario Actual", // En una app real, esto vendría de la sesión
      rating: 0, // Inicialmente sin calificación
      status: "Pendiente", // Estado inicial
    }

    localStorage.setItem("courses", JSON.stringify([...existingCourses, newCourse]))

    // Cerramos el modal
    setIsModalOpen(false)

    // Mostrar notificación
    setToastMessage({
      title: "Curso creado",
      body: "El curso ha sido creado exitosamente",
    })
    setShowToast(true)

    // Forzar actualización
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Gestión de Cursos</h1>
        <Button onClick={() => setIsModalOpen(true)}>
        Agregar Curso
        </Button>
      </div>

      <CourseList />

      <AddCourseModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onSave={handleSaveCourse} />

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{ position: "fixed", top: 20, right: 20 }}
      >
        <Toast.Header>
          <strong className="me-auto">{toastMessage.title}</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage.body}</Toast.Body>
      </Toast>
    </Container>
  )
}

export default HomePage

