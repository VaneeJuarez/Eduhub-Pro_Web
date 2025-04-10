import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { ArrowLeft, Calendar, CheckCircleFill, PeopleFill } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import { formatCourseDate, isTomorrow, normalizeDate, parseDisplayDate } from "../../utils/dateUtils";

// Components
import Sidebar from "../../components/admin/Sidebar";
import LessonViewer from "../../components/courses/LessonViewer";
import ModuleAccordion from "../../components/courses/ModuleAccordion";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import StudentListModal from "../../components/modals/StudentListModal";

// Styles
import style from "../../styles/coursecard.module.css";
import styles from "../../styles/general.module.css";
import { useUserContext } from "../../contexts/UserProvider";
import { sweetAlert } from "../../utils/config/config";
import { changeStatusCourses, fetchCourseById, fetchRegisteredStudents } from "../../api/admin/admin";

function CourseDetail() {
  const { id } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showStudentList, setShowStudentList] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showLessonViewer, setShowLessonViewer] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", body: "", variant: "success" })
  const [registeredStudents, setRegisteredStudents] = useState({ total: 0, students: [] })
  const [loadingStudents, setLoadingStudents] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { success, data, error } = await fetchCourseById(id);

      console.log(data.courseDetails);

      if (!success) {
        navigate("/admin/courses");
        return;
      }

      setCourse(mapCourse(data.courseDetails));
      setIsLoading(false);

      // Cargar estudiantes registrados si el curso está en progreso o publicado
      if (data.courseDetails.courseStatus === "IN_PROGRESS" || data.courseDetails.courseStatus === "PUBLISHED") {
        loadRegisteredStudents(data.courseDetails.courseId);
      }
    };
    load();
  }, [id, navigate]);

  // Efecto para actualizar la lista de estudiantes en tiempo real
  useEffect(() => {
    if (!course || course.status !== "IN_PROGRESS") return;

    // Actualizar cada 5 segundos
    const interval = setInterval(() => {
      loadRegisteredStudents(course.id);
    }, 5000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [course]);

  // Función para cargar estudiantes registrados
  const loadRegisteredStudents = async (courseId) => {
    setLoadingStudents(true);

    const { success, data, error } = await fetchRegisteredStudents(courseId);

    if (success) {
      setRegisteredStudents(data);
    } else {
      // Si hay error, simplemente inicializar con valores vacíos sin mostrar error
      setRegisteredStudents({ total: 0, students: [] });
      console.log("No hay estudiantes registrados o hubo un error:", error);
    }

    setLoadingStudents(false);
  };

  // Cargar estudiantes registrados cuando se abre el modal
  const handleOpenStudentList = async () => {
    if (!course) return;

    setShowStudentList(true);

    // Solo cargar si aún no se han cargado o si la lista está vacía
    if (registeredStudents.total === 0 && registeredStudents.students.length === 0) {
      loadRegisteredStudents(course.id);
    }
  };

  // Verificar si el curso comienza mañana
  const startsTomorrow = (course) => {
    if (!course) return false
    return isTomorrow(parseDisplayDate(course.startDate))
  }

  // Verificar si el curso ya finalizó
  const hasEnded = (course) => {
    if (!course) return false

    const today = normalizeDate(new Date());
    const endDate = normalizeDate(parseDisplayDate(course.endDate));
    return today > endDate;
  }

  // Verificar si el curso está actualmente en curso
  const isCurrentlyInProgress = (course) => {
    if (!course) return false

    const today = normalizeDate(new Date());
    const startDate = normalizeDate(parseDisplayDate(course.startDate));
    const endDate = normalizeDate(parseDisplayDate(course.endDate));

    return today >= startDate && today <= endDate
  }

  const handleViewModuleProgress = (moduleIndex) => {
    if (!course || !course.modules || !course.modules[moduleIndex]) return

    setSelectedModule({
      title: course.modules[moduleIndex].title,
      progress: generateModuleProgress(moduleIndex),
    })

    setShowModuleProgress(true)
  }

  const mapCourse = (c) => ({
    id: c.courseId,
    title: c.title,
    description: c.description,
    image: c.bannerPath,
    startDate: c.startDate,
    endDate: c.endDate,
    price: c.price,
    size: c.size,
    status: c.courseStatus, // enum real
    modules: c.modules.map((m) => ({
      moduleId: m.moduleId,
      title: m.name,
      order: m.date,
      status: m.status,
      lessons: m.sections.map((s) => ({
        sectionId: s.sectionId,
        title: s.name,
        description: s.description,
        content: s.contentUrl,
        type: s.contentType,
      })),
    })),
    tags: c.categories,
    instructor: c.instructor.name,
  });

  /* ────────────────────────────────  Actions  ──────────────────────────────── */
  const handleApprove = async () => {
    try {
      // Show loading alert
      sweetAlert('info', 'Procesando', 'Aprobando curso...', '', null);

      const body = { courseId: course.id, courseStatus: "PUBLISHED" };
      console.log('Enviando solicitud para aprobar curso:', body);

      const { success, error } = await changeStatusCourses(body);

      if (!success) {
        console.error('Error al aprobar curso:', error);
        return sweetAlert('error', 'Error', `No se pudo aprobar el curso: ${error}`, '', null);
      }

      console.log('Curso aprobado exitosamente');
      sweetAlert('success', 'Curso aprobado', 'El curso ha sido aprobado exitosamente', '', null);

      // Actualizar el estado del curso en la interfaz
      setCourse((prev) => ({ ...prev, status: "PUBLISHED" }));
    } catch (err) {
      console.error('Error inesperado:', err);
      sweetAlert('error', 'Error inesperado', 'Ocurrió un error al procesar la solicitud', '', null);
    }
  };

  const handleReject = async () => {
    try {
      // Show loading alert
      sweetAlert('info', 'Procesando', 'Rechazando curso...', '', null);

      const body = { courseId: course.id, courseStatus: "NOT_APPROVED" };
      console.log('Enviando solicitud para rechazar curso:', body);

      const { success, error } = await changeStatusCourses(body);

      if (!success) {
        console.error('Error al rechazar curso:', error);
        return sweetAlert('error', 'Error', `No se pudo rechazar el curso: ${error}`, '', null);
      }

      console.log('Curso rechazado exitosamente');
      sweetAlert('success', 'Curso rechazado', 'El curso ha sido rechazado exitosamente', '', null);

      // Cerrar el modal y redirigir
      setShowRejectModal(false);
      setTimeout(() => {
        navigate('/admin/courses');
      }, 1500);
    } catch (err) {
      console.error('Error inesperado:', err);
      sweetAlert('error', 'Error inesperado', 'Ocurrió un error al procesar la solicitud', '', null);
    }
  };

  /* ────────────────────────────────  Render guards  ────────────────────────── */
  if (isLoading) return <Container className="py-4 text-center">Cargando…</Container>;
  if (!course) return <Container className="py-4 text-center">Curso no encontrado</Container>;

  /* ────────────────────────────────  UI flags  ─────────────────────────────── */
  const isApproved = course.status === "PUBLISHED";
  const isInProgress = course.status === "IN_PROGRESS";
  const isFinished = course.status === "FINALIZED";
  const isPendingApproval = course.status === "TO_APPROVE"

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
        <Button variant="outline-primary" onClick={() => navigate("/admin/courses")} className="mt-3">
          <ArrowLeft className="me-2" /> Volver
        </Button>
      </Container>
    )
  }

  return (
    <>
      <Sidebar />
      <Header userName={user?.name} />
      <section className={styles.content} style={{ backgroundColor: "gray" }}>
        <Button variant="outline-primary" onClick={() => navigate("/admin/courses")} className={`ml-5 ${style.btnBack}`}>
          <ArrowLeft className="me-2" /> Volver
        </Button>
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
                        style={{ objectFit: "contain", maxHeight: "280px" }}
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
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="mb-2">
                      <i
                        className={`bi bi-calendar me-2 ${style.cardIcons}`}
                      ></i>
                      {formatCourseDate(course.startDate)} - {formatCourseDate(course.endDate)}
                    </div>
                    <div className="mb-2">
                      <i className={`bi bi-person me-2 ${style.cardIcons}`}></i>
                      Creado por: {course.instructor}
                    </div>
                    <div className="mb-2">
                      <i className={`bi bi-people me-2 ${style.cardIcons}`}></i>
                      Límite de estudiantes: {course.size}
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
                      onClick={handleApprove}
                      className="mb-2 w-100"
                      style={{ backgroundColor: "#AA39AD" }}
                    >
                      Aprobar Curso
                    </Button>
                    <Button
                      style={{ backgroundColor: "#C7C7C7" }}
                      onClick={() => setShowRejectModal(true)}
                      className="w-100"
                    >
                      Rechazar Curso
                    </Button>
                  </div>
                )}

                {/* Curso aprobado que inicia mañana */}
                {isApproved && startsTomorrow(course) && (
                  <div className="text-center py-3">
                    <Badge bg="info" className="mb-3 py-2 px-3">
                      <CheckCircleFill className="me-2" /> Aprobado
                    </Badge>
                    <p className="mb-0 fw-bold">El curso inicia mañana</p>
                    <hr></hr>
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <PeopleFill className="me-2 mr-2" />
                      <span>{registeredStudents.total || 0} estudiantes inscritos</span>
                    </div>
                    <Button style={{ backgroundColor: "#AA39AD" }} onClick={handleOpenStudentList} className="w-100">
                      Ver Estudiantes
                    </Button>
                  </div>
                )}

                {/* Curso aprobado que iniciará pronto (pero no mañana) */}
                {isApproved && !startsTomorrow(course) && !isCurrentlyInProgress(course) && !hasEnded(course) && (
                  <div className="text-center py-3">
                    <Badge bg="info" className="mb-3 py-2 px-3">
                      <CheckCircleFill className="me-2" /> Aprobado
                    </Badge>
                    <p className="mb-0">El curso iniciará pronto</p>
                    <hr></hr>
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <PeopleFill className="me-2 mr-2" />
                      <span>{registeredStudents.total || 0} estudiantes inscritos</span>
                    </div>
                    <Button style={{ backgroundColor: "#AA39AD" }} onClick={handleOpenStudentList} className="w-100">
                      Ver Estudiantes
                    </Button>
                  </div>
                )}

                {/* Curso en curso */}
                {isInProgress && (
                  <div className="text-center py-3">
                    <Badge bg="primary" className="mb-3 py-2 px-3">
                      <CheckCircleFill className="me-2" /> En Curso
                    </Badge>
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      <PeopleFill className="me-2" />
                      <span>{registeredStudents.total || 0} estudiantes inscritos</span>
                    </div>
                    <Button style={{ backgroundColor: "#AA39AD" }} onClick={handleOpenStudentList} className="w-100">
                      Ver Estudiantes
                    </Button>
                  </div>
                )}

                {/* Curso finalizado */}
                {isFinished && (
                  <div className="text-center py-3">
                    <Badge bg="secondary" className="mb-3 py-2 px-3">
                      <Calendar className="me-2" /> Finalizado
                    </Badge>
                    <p className="mb-0">El curso finalizó</p>
                    <small className="text-muted d-block mt-2">Finalizó el {course.endDate}</small>
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
            <Button variant="danger" onClick={handleReject}>
              Rechazar y Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para ver la lista de estudiantes */}
        {(isInProgress || isApproved) && (
          <StudentListModal
            show={showStudentList}
            onHide={() => setShowStudentList(false)}
            students={registeredStudents.students || []}
            course={course}
            isLoading={loadingStudents}
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
