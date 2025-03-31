import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Modal, Row, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatCourseDate, normalizeDate, parseDisplayDate } from "../../utils/dateUtils";

// styles
import styles from "../../styles/coursecard.module.css";

// modals
import CourseModal from "../modals/CourseModal";

import defaultCourse from "../../assets/svg/signup.svg";
import { base_api_url, change_status, course_management, instructor_path, update } from "../../utils/config/paths";
import { headers, sweetAlert } from "../../utils/config/config";

function CourseList({ courses, setCourses, refreshCourses }) {

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", body: "", variant: "success" })
  const navigate = useNavigate();

  useEffect(() => {

    refreshCourses();

    // Filtrar cursos pendientes de aprobación con fecha vencida
    const filteredCourses = courses.filter((course) => {
      if (course.courseStatus === "TO_APPROVE") {
        const courseStartDate = normalizeDate(parseDisplayDate(course.startDate));
        const today = normalizeDate(new Date());
        return today <= courseStartDate;
      }
      return true;
    });

    // Si se eliminaron cursos, actualizar localStorage
    if (filteredCourses.length < courses.length) {
      showToastMessage(
        "Cursos actualizados",
        "Se han eliminado cursos pendientes de aprobación con fecha de inicio vencida",
        "warning",
      )
    }

    setCourses(filteredCourses);
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
    return course.courseStatus === "IN_EDITION"
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
    const courseToDelete = courses.find((course) => course.courseId === courseId);
    if (courseToDelete && !isCourseEditable(courseToDelete)) {
      return;
    }

    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (courseToDelete) {
      await changeStatusCourse(courseToDelete);

      const updatedCourses = courses.filter((course) => course.courseId !== courseToDelete);
      setCourses(updatedCourses);
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);

      showToastMessage("Curso eliminado", "El curso ha sido eliminado exitosamente", "danger");
    }
  };

  const handleSaveEditedCourse = (updatedCourse) => {
    const updatedCourses = courses.map((course) =>
      course.courseId === updatedCourse.courseId ? { ...updatedCourse, courseId: course.courseId } : course,
    )
    editCourse(updatedCourse);

    setCourses(updatedCourses);
    setIsEditModalOpen(false);
    setCourseToEdit(null);

    showToastMessage("Curso actualizado", "El curso ha sido actualizado exitosamente")
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

  const editCourse = async (course) => {
    await fetch(`${base_api_url}${instructor_path}${course_management}${update}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        courseId: course.courseId,
        title: course.title,
        description: course.description,
        bannerPath: course.bannerPath,
        startDate: course.startDateISO,
        endDate: course.endDateISO,
        price: course.price,
        size: course.size,
        categoriesId: course.tags
      }),
    }).then(response => response.json())
      .then((result) => {
        if (result.type !== 'SUCCESS') {
          if (typeof result === 'object' && !result.text) {
            const errorMessages = Object.values(result).join("\n");
            sweetAlert('error', 'Error', errorMessages, '');
          } else if (result.text) {
            sweetAlert('error', 'Error', result.text, '');
          }
          return;
        }

        refreshCourses();
        setIsEditModalOpen(false);

      }).catch((error) => {
        console.log(error);
        sweetAlert('error', "Error", "No pudimos editar el curso. Inténtalo nuevamente.", "", null);
      });
  }

  const changeStatusCourse = (courseId) => {
    return fetch(`${base_api_url}${instructor_path}${course_management}${change_status}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        courseId: courseId,
        courseStatus: "INACTIVE"
      })
    }).then((response) => response.json())
      .then((response) => {
        refreshCourses();
      })
      .catch((error) => {
        console.log(error);
        sweetAlert('error', 'Error', 'No se pudo eliminar el curso.', '', null);
      });
  };

  return (
    <>
      <Row className="g-4 m-4">
        {courses.map((course, id) => (
          <Col key={id} md={6} lg={3} className="mt-4">
            <Card
              className={`h-100 shadow-sm d-flex flex-column ${styles.cardCourse}`}
            >
              <Card.Img
                variant="top"
                src={course.bannerPath || defaultCourse}
                alt={course.title}
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <Card.Title className={`mb-2 ${styles.cardTitle}`}>
                    {course.title}
                  </Card.Title>
                  {/*      <div className="d-flex align-items-center text-muted">
                    <Star className="me-2 text-warning" size={14} />
                    <small>{course.rating}</small>
                  </div> */}
                </div>
                <Card.Text className={`text-muted mb-2 ${styles.cardText}`}>
                  {course.description}
                </Card.Text>
                <div className="mb-2">
                  {course.categories?.map((category, index) => (
                    <Badge key={index} text="light" className={styles.cardTag}>
                      {category?.name}
                    </Badge>
                  ))}
                </div>
                <div className={`text-muted mb-2 ${styles.cardInfo}`}>
                  <div className="mb-0">
                    <i className={`bi bi-person me-2 ${styles.cardIcons}`}></i>
                    {course.instructor.name}
                  </div>
                </div>
                <div className="mb-0">
                  <i className={`bi bi-calendar me-2 ${styles.cardIcons}`}></i>
                  {formatCourseDate(course.startDate)} - {formatCourseDate(course.endDate)}
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
                      onClick={(e) => handleDeleteCourse(course.courseId, e)}
                      disabled={!isCourseEditable(course)}
                      style={!isCourseEditable(course) ? { opacity: 0.5, cursor: "not-allowed", color: "gray" } : {}}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className={`me-1 mr-2 ${styles.Icons}`}
                      onClick={(e) => handleEditCourse(course, e)}
                      disabled={!isCourseEditable(course)}
                      style={!isCourseEditable(course) ? { opacity: 0.5, cursor: "not-allowed", color: "gray" } : {}}

                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      className={`flex-grow-1 me-2 ${styles.cardButton}`}
                      onClick={(e) => handleViewCourse(course.courseId, e)}
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
      <Modal show={isDeleteDialogOpen} onHide={() => setIsDeleteDialogOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Esta acción no se puede deshacer. Se eliminará permanentemente el curso y todos sus módulos y lecciones.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
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
