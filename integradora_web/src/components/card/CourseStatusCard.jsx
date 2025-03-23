"use client";

import { useState } from "react";
import { Card, Button, Badge, Alert } from "react-bootstrap";
import { PeopleFill, Calendar, CheckCircleFill, XCircleFill, ClockFill } from "react-bootstrap-icons"
import { parseDisplayDate, normalizeDate, isTomorrow } from "../../utils/dateUtils";

// Components
import StudentListModal from "../modals/StudentListModal";

// Styles
import styles from "../../styles/coursecard.module.css";

function CourseStatusCard({ course, onPublishCourse }) {
  const [showStudentList, setShowStudentList] = useState(false);
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  // Determinar si el curso tiene lecciones en todos sus módulos
  const hasLessonsInAllModules = () => {
    if (!course.modules || course.modules.length === 0) return false

    // Verificar que todos los módulos tengan al menos una lección
    return course.modules.every((module) => module.lessons && module.lessons.length > 0)
  }

  // Verificar si el curso está en espera de aprobación
  const isPendingApproval = course.status === "Pendiente de aprobar";

  // Verificar si el curso está aprobado
  const isApproved = course.status === "Aprobado"

  // Verificar si el curso está en curso
  const isInProgress = course.status === "En Curso"

  // Verificar si el curso ha finalizado
  const isFinished = course.status === "Finalizado"

  // Verificar si el curso comienza mañana
  const startsTomorrow = () => {
    if (!course) return false

    return isTomorrow(parseDisplayDate(course.startDate));
  }

  // Verificar si el curso ya finalizó
  const hasEnded = () => {
    if (!course) return false

    const today = normalizeDate(new Date())
    const endDate = normalizeDate(parseDisplayDate(course.endDate))

    return today > endDate
  }

  // Verificar si el curso está actualmente en curso
  const isCurrentlyInProgress = () => {
    if (!course) return false

    const today = normalizeDate(new Date())
    const startDate = normalizeDate(parseDisplayDate(course.startDate))
    const endDate = normalizeDate(parseDisplayDate(course.endDate))

    return today >= startDate && today <= endDate
  }

  // Determinar el estado actual del curso basado en las fechas
  const determineCurrentStatus = () => {
    if (hasEnded()) {
      return "Finalizado"
    } else if (isCurrentlyInProgress()) {
      return "En Curso"
    } else if (startsTomorrow()) {
      return "Inicia Mañana"
    } else {
      return "Iniciará Pronto"
    }
  }

  // Actualizar el estado del curso si es necesario
  const updateCourseStatus = () => {
    if (course.status === "Aprobado" || course.status === "En Curso") {
      const currentStatus = determineCurrentStatus()

      // Si el estado actual no coincide con el estado almacenado, actualizarlo
      if (
        (currentStatus === "Finalizado" && course.status !== "Finalizado") ||
        (currentStatus === "En Curso" && course.status !== "En Curso")
      ) {
        const courses = JSON.parse(localStorage.getItem("courses") || "[]")
        const courseIndex = courses.findIndex((c) => c.id === course.id)

        if (courseIndex !== -1) {
          courses[courseIndex].status = currentStatus
          localStorage.setItem("courses", JSON.stringify(courses))

          // Disparar evento para actualizar la lista en otras páginas
          window.dispatchEvent(new Event("storage"))
        }
      }
    }
  }

  // Ejecutar la actualización del estado
  updateCourseStatus()

  // Generar estudiantes de ejemplo para la demostración
  const generateMockStudents = () => {
    const mockStudents = [];
    const numStudents = Math.floor(Math.random() * course.studentLimit) + 1;

    for (let i = 1; i <= numStudents; i++) {
      mockStudents.push({
        id: i,
        name: `Estudiante ${i}`,
        email: `estudiante${i}@ejemplo.com`,
        enrollmentDate: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      });
    }

    return mockStudents;
  };

  const mockStudents = generateMockStudents();

  const handlePublishCourse = () => {
    // Verificar que todos los módulos tengan lecciones
    if (!hasLessonsInAllModules()) {
      setAlertMessage(
        "No puedes enviar el curso porque hay módulos sin lecciones. Agrega al menos una lección a cada módulo.",
      )
      setShowAlert(true)
      return
    }

    onPublishCourse()
  }

  return (
    <>
      <Card className={styles.cardFrame}>
        <Card.Body>

          {showAlert && (
            <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible className="mb-3">
              {alertMessage}
            </Alert>
          )}

          {/* Curso pendiente (no enviado) */}
          {course.status === "Pendiente" && (
            <div className="text-center py-3">
              <p className="mb-3">¿Deseas enviar tu curso?</p>
              <Button
                onClick={handlePublishCourse}
                className="w-100"
                disabled={!course.modules || course.modules.length === 0}
              >
                Enviar Curso
              </Button>
              {(!course.modules || course.modules.length === 0) && (
                <small className="text-muted d-block mt-2">Agrega módulos para habilitar esta opción</small>
              )}
              <small className="text-danger d-block mt-2">
                <strong>Nota:</strong> Una vez enviado, no podrás editar ni
                eliminar el curso.
              </small>
            </div>
          )}
          {/* Curso en espera de aprobación */}
          {isPendingApproval && (
            <div className="text-center py-3">
              <Badge bg="warning" className="mb-3 py-2 px-3">
                <ClockFill className="me-2" /> Pendiente
              </Badge>
              <p className="mb-0">En espera de aprobación</p>
              <small className="text-muted d-block mt-2">Tu curso está siendo revisado por nuestro equipo</small>
            </div>
          )}

          {/* Curso aprobado que inicia mañana */}
          {isApproved && startsTomorrow() && (
            <div className="text-center py-3">
              <Badge bg="info" className="mb-3 py-2 px-3">
                <CheckCircleFill className="me-2" /> Aprobado
              </Badge>
              <p className="mb-0 fw-bold">El curso inicia mañana</p>
              <small className="text-muted d-block mt-2">Prepárate para comenzar</small>
            </div>
          )}

          {/* Curso aprobado que iniciará pronto (pero no mañana) */}
          {isApproved && !startsTomorrow() && !isCurrentlyInProgress() && !hasEnded() && (
            <div className="text-center py-3">
              <Badge bg="info" className="mb-3 py-2 px-3">
                <CheckCircleFill className="me-2" /> Aprobado
              </Badge>
              <p className="mb-0">El curso iniciará pronto</p>
              <small className="text-muted d-block mt-2">El curso comenzará el {course.startDate}</small>
            </div>
          )}

          {/* Curso en curso */}
          {(isInProgress || (isApproved && isCurrentlyInProgress())) && (
            <div className="text-center py-3">
              <Badge bg="success" className="mb-3 py-2 px-3">
                <CheckCircleFill className="me-2" /> En Curso
              </Badge>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <PeopleFill className="me-2" />
                <span>{mockStudents.length} estudiantes inscritos</span>
              </div>
              <Button variant="outline-primary" onClick={() => setShowStudentList(true)} className="w-100">
                Ver Estudiantes
              </Button>
            </div>
          )}

          {/* Curso finalizado */}
          {(isFinished || (isApproved && hasEnded())) && (
            <div className="text-center py-3">
              <Badge bg="secondary" className="mb-3 py-2 px-3">
                <Calendar className="me-2" /> Finalizado
              </Badge>
              <p className="mb-0">El curso finalizó</p>
              <small className="text-muted d-block mt-2">Finalizó el {course.endDate}</small>
            </div>
          )}

          {/* Modal para ver la lista de estudiantes */}
          <StudentListModal
            show={showStudentList}
            onHide={() => setShowStudentList(false)}
            students={mockStudents}
            course={course}
          />
        </Card.Body>
      </Card>
    </>
  );
}

export default CourseStatusCard;
