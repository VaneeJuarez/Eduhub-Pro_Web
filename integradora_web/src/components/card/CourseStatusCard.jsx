"use client";

import { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { PeopleFill } from "react-bootstrap-icons";

// Components
import StudentListModal from "../modals/StudentListModal";

// Styles
import styles from "../../styles/coursecard.module.css";

function CourseStatusCard({ course, onPublishCourse }) {
  const [showStudentList, setShowStudentList] = useState(false);

  // Determinar si el curso tiene lecciones
  const hasLessons = course.modules && course.modules.some((module) => module.lessons && module.lessons.length > 0)

  // Verificar si el curso está en espera de aprobación
  const isPendingApproval = course.status === "Pendiente de aprobar";

  // Verificar si el curso está aprobado pero aún no ha iniciado
  const isApprovedNotStarted = course.status === "Aprobado" && new Date() < new Date(parseDisplayDate(course.startDate))

  // Verificar si el curso está en curso
  const isInProgress = course.status === "En Curso";

  // Verificar si el curso ha finalizado
  const isFinished =
    course.status === "Finalizado" ||
    (course.status === "En Curso" && new Date() > new Date(parseDisplayDate(course.endDate)))

  // Función para convertir de "Mar 20" a fecha ISO
  function parseDisplayDate(displayDate) {
    if (!displayDate) return ""
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const [month, day] = displayDate.split(" ")
    const monthIndex = months.indexOf(month)
    if (monthIndex === -1) return ""

    const currentYear = new Date().getFullYear()
    return `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(Number.parseInt(day)).padStart(2, "0")}`
  }

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

  return (
    <>
      <Card className={styles.cardFrame}>
        <Card.Body>
          {/* Curso pendiente (no enviado) */}
          {course.status === "Pendiente" && (
            <div className="text-center py-3">
              <p className="mb-3">¿Deseas enviar tu curso?</p>
              <Button
                onClick={onPublishCourse}
                className="w-100"
                disabled={!hasLessons}
              >
                Enviar Curso
              </Button>
              {!hasLessons && (
                <small className="text-muted d-block mt-2">
                  Agrega lecciones para habilitar esta opción
                </small>
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
                Pendiente
              </Badge>
              <p className="mb-0">En espera de aprobación</p>
              <small className="text-muted d-block mt-2">
                Tu curso está siendo revisado por nuestro equipo
              </small>
            </div>
          )}

          {/* Curso aprobado pero no iniciado */}
          {isApprovedNotStarted && (
            <div className="text-center py-3">
              <Badge bg="info" className="mb-3 py-2 px-3">
                Aprobado
              </Badge>
              <p className="mb-0">En espera de inicialización</p>
              <small className="text-muted d-block mt-2">
                El curso comenzará el {course.startDate}
              </small>
            </div>
          )}

          {/* Curso en curso */}
          {isInProgress && (
            <div className="text-center py-3">
              <Badge bg="success" className="mb-3 py-2 px-3">
                En Curso
              </Badge>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <PeopleFill className="me-2" />
                <span>{mockStudents.length} estudiantes inscritos</span>
              </div>
              <Button
                variant="outline-primary"
                onClick={() => setShowStudentList(true)}
                className="w-100"
              >
                Ver Estudiantes
              </Button>
            </div>
          )}

          {/* Curso finalizado */}
          {isFinished && (
            <div className="text-center py-3">
              <Badge bg="secondary" className="mb-3 py-2 px-3">
                Finalizado
              </Badge>
              <p className="mb-0">Este curso finalizó</p>
              <small className="text-muted d-block mt-2">
                Finalizó el {course.endDate}
              </small>
            </div>
          )}
          {/* Curso rechazado */}
          {course.status === "Rechazado" && (
            <div className="text-center py-3">
              <Badge bg="danger" className="mb-3 py-2 px-3">
                Rechazado
              </Badge>
              <p className="mb-0">Tu curso ha sido rechazado</p>
              <small className="text-muted d-block mt-2">Contacta con el administrador para más información</small>
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
