"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Badge, Button, Toast, Modal } from "react-bootstrap";
import { Star } from "react-bootstrap-icons";

// styles
import styles from "../styles/coursecard.module.css";

// modals
import CourseModal from "./modals/CourseModal";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    body: "",
    variant: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar cursos desde localStorage
    const storedCourses = JSON.parse(localStorage.getItem("courses") || "[]");
    setCourses(storedCourses);

    // Suscribirse a cambios en localStorage
    const handleStorageChange = () => {
      const updatedCourses = JSON.parse(
        localStorage.getItem("courses") || "[]"
      );
      setCourses(updatedCourses);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const showToastMessage = (title, body, variant = "success") => {
    setToastMessage({ title, body, variant });
    setShowToast(true);
  };

  const handleViewCourse = (courseId, e) => {
    e.stopPropagation();
    navigate(`/inst/courses/${courseId}`);
  };

  // Verificar si el curso es editable 
  const isCourseEditable = (course) => {
    return course.status === "Pendiente"
  }

  const handleEditCourse = (course, e) => {
    e.stopPropagation();

    // No permitir editar cursos que no están en estado "Pendiente"
    if (!isCourseEditable(course)) {
      return
    }

    setCourseToEdit(course);
    setIsEditModalOpen(true);
  };

  const handleDeleteCourse = (courseId, e) => {
    e.stopPropagation();

    // No permitir eliminar cursos que no están en estado "Pendiente"
    const courseToDelete = courses.find((course) => course.id === courseId);
    if (courseToDelete && !isCourseEditable(courseToDelete)) {
      return;
    }

    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      const updatedCourses = courses.filter((course) => course.id !== courseToDelete)
      localStorage.setItem("courses", JSON.stringify(updatedCourses))
      setCourses(updatedCourses)
      setIsDeleteDialogOpen(false)
      setCourseToDelete(null)

      showToastMessage("Curso eliminado", "El curso ha sido eliminado exitosamente", "danger")

      // Disparar evento para actualizar la lista en otras páginas
      window.dispatchEvent(new Event("storage"))
    }
  }

  const handleSaveEditedCourse = (updatedCourse) => {
    const updatedCourses = courses.map((course) =>
      course.id === updatedCourse.id
        ? { ...updatedCourse, id: course.id }
        : course
    );

    localStorage.setItem("courses", JSON.stringify(updatedCourses));
    setCourses(updatedCourses);
    setIsEditModalOpen(false);
    setCourseToEdit(null);

    showToastMessage(
      "Curso actualizado",
      "El curso ha sido actualizado exitosamente"
    );

    // Disparar evento para actualizar la lista en otras páginas
    window.dispatchEvent(new Event("storage"));
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">
          No hay cursos disponibles. ¡Agrega uno nuevo!
        </p>
      </div>
    );
  }

  return (
    <>
      <Row className="g-4 m-4">
        {courses.map((course) => (
          <Col key={course.id} md={6} lg={3} className="mt-4">
            <Card
              className={`h-100 shadow-sm d-flex flex-column ${styles.cardCourse}`}
            >
              <Card.Img
                variant="top"
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <Card.Title className={`mb-2 ${styles.cardTitle}`}>
                    {course.title}
                  </Card.Title>
                  <div className="d-flex align-items-center text-muted">
                    <Star className="me-2 text-warning" size={14} />
                    <small>{course.rating}</small>
                  </div>
                </div>
                <Card.Text className={`text-muted mb-2 ${styles.cardText}`}>
                  {course.description}
                </Card.Text>
                <div className="mb-2">
                  {course.tags?.map((tag, index) => (
                    <Badge key={index} text="light" className={styles.cardTag}>
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className={`text-muted mb-2 ${styles.cardInfo}`}>
                  <div className="mb-0">
                    <i className={`bi bi-person me-2 ${styles.cardIcons}`}></i>
                    {course.instructor}
                  </div>
                </div>
                <div className="mb-0">
                  <i className={`bi bi-calendar me-2 ${styles.cardIcons}`}></i>
                  {course.startDate} - {course.endDate}
                </div>
              </Card.Body>
              <Card.Footer className="bg-white">
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className={`fw-bold ${styles.cardPrice}`}>
                    ${course.price.toFixed(2)} mx
                  </span>
                  <div className="d-flex mt-2">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className={`mr-2 ${styles.Icons}`}
                      onClick={(e) => handleDeleteCourse(course.id, e)}
                      disabled={!isCourseEditable(course)}
                      style={!isCourseEditable(course) ? { opacity: 0.5, cursor: "not-allowed", color: "gray" } : {}}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className={`me-1 mr-2 ${styles.Icons}`}
                      onClick={(e) => handleEditCourse(course, e)}
                      disabled={!isCourseEditable(course)}
                      style={!isCourseEditable(course) ? { opacity: 0.5, cursor: "not-allowed", color: "gray" } : {}}

                    >
                      <i className="fas fa-edit"></i>
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      className={`flex-grow-1 me-2 ${styles.cardButton}`}
                      onClick={(e) => handleViewCourse(course.id, e)}
                    >
                      Ver Curso
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal de confirmación para eliminar curso */}
      <Modal
        show={isDeleteDialogOpen}
        onHide={() => setIsDeleteDialogOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Esta acción no se puede deshacer. Se eliminará permanentemente el
          curso y todos sus módulos y lecciones.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteCourse}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar curso */}
      {courseToEdit && (
        <CourseModal
          show={isEditModalOpen}
          onHide={() => {
            setIsEditModalOpen(false);
            setCourseToEdit(null);
          }}
          onSave={handleSaveEditedCourse}
          initialData={courseToEdit}
        />
      )}

      {/* Toast para notificaciones */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        bg={toastMessage.variant}
        text={toastMessage.variant === "danger" ? "white" : undefined}
        style={{ position: "fixed", top: 20, right: 20 }}
      >
        <Toast.Header>
          <strong className="me-auto">{toastMessage.title}</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage.body}</Toast.Body>
      </Toast>
    </>
  );
}

export default CourseList;
