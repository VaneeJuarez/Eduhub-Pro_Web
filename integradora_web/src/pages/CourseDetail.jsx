import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge, Toast, Modal } from "react-bootstrap"
import { ArrowLeft, Calendar, People, Star, CheckCircleFill, XCircleFill, PeopleFill, ClockFill } from "react-bootstrap-icons"

// Components
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StudentListModal from "../components/modals/StudentListModal"
import LessonViewer from "../components/courses/LessonViewer";
import ModuleAccordion from "../components/courses/ModuleAccordion";

// Styles
import styles from "../styles/general.module.css";
import style from "../styles/coursecard.module.css";;

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showStudentList, setShowStudentList] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showLessonViewer, setShowLessonViewer] = useState(false)

  useEffect(() => {
    // Cargar el curso desde localStorage
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const foundCourse = courses.find((c) => c.id === id)

    if (foundCourse) {
      // Verificar si el curso está pendiente de aprobación y ya pasó su fecha de inicio
      if (foundCourse.status === "Pendiente de aprobar" &&
        new Date() > new Date(parseDisplayDate(foundCourse.startDate))) {
        // Eliminar el curso
        const updatedCourses = courses.filter((c) => c.id !== id)
        localStorage.setItem("courses", JSON.stringify(updatedCourses))

        // Mostrar notificación y redirigir
        showToastMessage("Curso eliminado", "El curso ha sido eliminado porque pasó su fecha de inicio sin ser aprobado", "danger")
        setTimeout(() => navigate("/admin"), 3000)
        return
      }

      setCourse(foundCourse)
    }

    setIsLoading(false)

    // Suscribirse a cambios en localStorage
    const handleStorageChange = () => {
      const updatedCourses = JSON.parse(localStorage.getItem("courses") || "[]")
      const updatedCourse = updatedCourses.find((c) => c.id === id)
      if (updatedCourse) {
        setCourse(updatedCourse)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [id, navigate])

  const handleApproveCourse = () => {
    if (!course) return

    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const courseIndex = courses.findIndex((c) => c.id === course.id)

    if (courseIndex === -1) return

    // Actualizar el estado del curso a "Aprobado"
    const updatedCourse = { ...course, status: "Aprobado" }
    courses[courseIndex] = updatedCourse

    localStorage.setItem("courses", JSON.stringify(courses))
    setCourse(updatedCourse)

    // Mostrar notificación
    showToastMessage("Curso aprobado", "El curso ha sido aprobado exitosamente")

    // Disparar evento para actualizar la lista en otras páginas
    window.dispatchEvent(new Event("storage"))
  }

  const handleRejectCourse = () => {
    if (!course) return

    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const updatedCourses = courses.filter((c) => c.id !== course.id)

    localStorage.setItem("courses", JSON.stringify(updatedCourses))

    // Cerrar modal y mostrar notificación
    setShowRejectModal(false)
    showToastMessage("Curso rechazado", "El curso ha sido rechazado y eliminado", "danger")

    // Disparar evento para actualizar la lista en otras páginas
    window.dispatchEvent(new Event("storage"))

    // Redirigir al panel de administración
    navigate("/admin")
  }

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
    if (!course) return []

    const mockStudents = []
    const numStudents = Math.floor(Math.random() * course.studentLimit) + 1

    for (let i = 1; i <= numStudents; i++) {
      mockStudents.push({
        id: i,
        name: `Estudiante ${i}`,
        email: `estudiante${i}@ejemplo.com`,
        enrollmentDate: new Date(
          Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
        ).toLocaleDateString(),
      })
    }

    return mockStudents
  }

  const mockStudents = generateMockStudents()

  const handleViewModuleProgress = (moduleIndex) => {
    if (!course || !course.modules || !course.modules[moduleIndex]) return

    setSelectedModule({
      title: course.modules[moduleIndex].title,
      progress: generateModuleProgress(moduleIndex),
    })

    setShowModuleProgress(true)
  }
  if (isLoading) {
    return (
      <Container className="py-4">
        <div className="text-center">Cargando...</div>
      </Container>
    )
  }

  if (!course) {
    return (
      <Container className="py-4">
        <p>Curso no encontrado</p>
        <Button variant="outline-primary" onClick={() => navigate("/admin")} className="mt-3">
          <ArrowLeft className="me-2" /> Volver
        </Button>
      </Container>
    )
  }

  // Verificar si el curso está pendiente de aprobación
  const isPendingApproval = course.status === "Pendiente de aprobar"

  // Verificar si el curso está aprobado pero aún no ha iniciado
  const isApprovedNotStarted = course.status === "Aprobado" && new Date() < new Date(parseDisplayDate(course.startDate))

  // Verificar si el curso comienza mañana
  const startsTomorrow = () => {
    if (!course || course.status !== "Aprobado") return false

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startDate = new Date(parseDisplayDate(course.startDate))

    return startDate.getDate() === tomorrow.getDate() &&
      startDate.getMonth() === tomorrow.getMonth() &&
      startDate.getFullYear() === tomorrow.getFullYear()
  }

  // Verificar si el curso está en curso
  const isInProgress = course.status === "En Curso"

  return (
    <>
      <Sidebar />
      <Header userName="Vanessa Juárez" />
      <section className={styles.content} style={{ backgroundColor: "gray" }}>
        <Row className="row g-3 mb-4 mt-4 m-4">
          <Col lg={9}>
            <Card className={`mb-4 ${style.cardDetail}`}>
              <Card.Body>
                <Row>
                  <div className="col-md-4 d-flex align-items-stretch">
                    {course.image && (
                      <img
                        src={course.image || "/palceholder.svg"}
                        alt={course.title}
                        className="img-fluid rounded mb-3 mb-md-0 w-100"
                        style={{ objectFit: "cover", maxHeight: "280px" }}
                      />
                    )}
                  </div>
                  <div className="col-md-8">
                    <h3 className="mb-2">{course.title}</h3>
                    <p className={`text-muted mb-2 ${style.cardInfo}`}>{course.description}</p>
                    <div className="mb-3">
                      {course.tags?.map((tag, index) => (
                        <Badge
                          key={index}
                          text="light"
                          className={`py-1 px-2 ${style.cardTag}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mb-2">
                      <i
                        className={`bi bi-calendar me-2 ${style.cardIcons}`}
                      ></i>
                      {course.startDate} - {course.endDate}
                    </div>
                    <div className="mb-2">
                      <i className={`bi bi-person me-2 ${style.cardIcons}`}></i>
                      Creado por: {course.instructor}
                    </div>
                    <div className="mb-2">
                      <i className={`bi bi-people me-2 ${style.cardIcons}`}></i>
                      Límite de estudiantes: {course.studentLimit}
                    </div>
                    <div className="h5 mt-3">${course.price.toFixed(2)} mx</div>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Card de acciones del administrador */}
          <div className="col-lg-3">
            <Card className={style.cardFrame}>
              <Card.Body>
                {isPendingApproval && (
                  <div className="text-center py-3">
                    <Button
                      variant="success"
                      onClick={handleApproveCourse}
                      className="mb-2 w-100"
                    >
                       Aprobar Curso
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setShowRejectModal(true)}
                      className="w-100"
                    >
                      Rechazar Curso
                    </Button>
                  </div>
                )}

                {isApprovedNotStarted && (
                  <div className="text-center py-3">
                    <Badge bg="info" className="mb-3 py-2 px-3">
                      Aprobado
                    </Badge>
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <ClockFill className="me-2 text-info" />
                      <span>{startsTomorrow() ? "El curso empieza mañana" : "Iniciará pronto"}</span>
                    </div>
                    <p className="mb-0 text-muted">
                      {!startsTomorrow() && `El curso comenzará el ${course.startDate}`}
                    </p>
                  </div>
                )}

                {isInProgress && (
                  <div className="text-center py-2">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <PeopleFill className="me-2" />
                      <span>{mockStudents.length} estudiantes inscritos</span>
                    </div>
                    <Button variant="primary" onClick={() => setShowStudentList(true)} className="w-100">
                      Ver Estudiantes
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </Row>
        {/* Contenido del curso */}
        <div className="col-md-9 d-flex justify-content-between align-items-center mb-4">
          <h5 className={`mb-3 g-3 ${style.contentCourse}`}>
            Contenido del curso
          </h5>
        </div>
        <Col lg={9}>
          {course.modules && course.modules.length > 0 ? (
            <ModuleAccordion
              modules={course.modules}
              isPublished={true}
              isAdmin={true}
              onViewProgress={handleViewModuleProgress}
            />
          ) : (
            <p className="text-muted text-center py-4">No hay módulos disponibles.</p>
          )}
        </Col>
        {/* Modal para rechazar curso */}
        <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Rechazar Curso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Estás seguro de que deseas rechazar este curso? Esta acción eliminará el curso permanentemente.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleRejectCourse}>
              Rechazar y Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para ver la lista de estudiantes */}
        {isInProgress && (
          <StudentListModal
            show={showStudentList}
            onHide={() => setShowStudentList(false)}
            students={mockStudents}
            course={course}
          />
        )}

        {/* Modal para ver el contenido de la lección */}
        {selectedLesson && (
          <Modal show={showLessonViewer} onHide={() => setShowLessonViewer(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>{selectedLesson.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <LessonViewer lesson={selectedLesson} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowLessonViewer(false)}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </section>
      <Footer />
    </>
  );
};

export default CourseDetail;
