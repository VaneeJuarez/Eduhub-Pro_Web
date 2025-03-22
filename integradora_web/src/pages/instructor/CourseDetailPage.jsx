import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courses } from "../../data/courses";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Card,
  Modal,
} from "react-bootstrap";
import {
  ArrowLeft,
  Calendar,
  People,
  Star,
  Trash,
  Plus,
} from "react-bootstrap-icons";

// Components
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import VideoPlayer from "../../components/courses/VideoPlayer";
import PDFViewer from "../../components/courses/PDFViewer";
import ModuleAccordion from "../../components/courses/ModuleAccordion";
import ModuleModal from "../../components/modals/ModuleModal";

// Styles
import styles from "../../styles/general.module.css";
import style from "../../styles/coursecard.module.css";
import * as bootstrap from "bootstrap";

function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    // Cargar el curso desde localStorage
    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const foundCourse = courses.find((c) => c.id === id);

    if (foundCourse) {
      setCourse(foundCourse);
      setIsPublished(foundCourse.status === "Publicado");
    }

    setIsLoading(false);

    // Suscribirse a cambios en localStorage
    const handleStorageChange = () => {
      const updatedCourses = JSON.parse(
        localStorage.getItem("courses") || "[]"
      );
      const updatedCourse = updatedCourses.find((c) => c.id === id);
      if (updatedCourse) {
        setCourse(updatedCourse);
        setIsPublished(updatedCourse.status === "Publicado");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [id]);

  const handlePublishCourse = () => {
    if (!course) return;

    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const courseIndex = courses.findIndex((c) => c.id === course.id);

    if (courseIndex === -1) return;

    // Actualizar el estado del curso a "Publicado"
    const updatedCourse = { ...course, status: "Publicado" };
    courses[courseIndex] = updatedCourse;

    localStorage.setItem("courses", JSON.stringify(courses));
    setCourse(updatedCourse);
    setIsPublished(true);

    // Disparar evento para actualizar la lista de otras páginas
    window.dispatch(new Event("storage"));
  };

  const handleDeleteCourse = () => {
    if (!course) return;

    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const updatedCourses = courses.filter((c) => c.id != course.id);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));

    window.dispatchEvent(new Event("storage"));

    navigate("/");
  };

  const handleSaveModule = (module) => {
    if (!course) return;

    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const courseIndex = courses.findIndex((c) => c.id === course.id);

    if (courseIndex === -1) return;

    // Si estamos editando un módulo existente
    if (currentModule) {
      const moduleIndex =
        course.modules?.findIndex((m) => m.title === currentModule.title) ?? -1

      if (moduleIndex !== -1) {
        const updatedModules = [...(course.modules || [])];
        updatedModules[moduleIndex] = module

        const updatedCourse = { ...course, modules: updatedModules };
        courses[courseIndex] = updatedCourse
        setCourse(updatedCourse)

      }
    } else {
      // Si estamos agregando un nuevo módulo
      const updatedModules = [...(course.modules || []), module];
      const updatedCourse = { ...course, modules: updatedModules };
      courses[courseIndex] = updatedCourse;
      setCourse(updatedCourse);
    }

    localStorage.setItem("courses", JSON.stringify(courses));
    setIsModuleModalOpen(false);
    setCurrentModule(null);

    // Disparar evento para actualizar la lista en otras páginas
    window.dispatchEvent(new Event("storage"));
  };

  const handleEditModule = (module) => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = (moduleTitle) => {
    if (!course) return;

    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const courseIndex = courses.findIndex((c) => c.id === course.id);

    if (courseIndex === -1) return;

    const updatedModules =
      course.modules?.filter((m) => m.title !== moduleTitle) || [];
    const updatedCourse = { ...course, modules: updatedModules };
    courses[courseIndex] = updatedCourse;

    localStorage.setItem("courses", JSON.stringify(courses));
    setCourse(updatedCourse);

    // Disparar evento para actualizar la lista en otras páginas
    window.dispatchEvent(new Event("storage"));
  };

  if (isLoading) {
    return (
      <Container className="py-4">
        <div className="text-center">Cargando...</div>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-4">
        <p>Curso no encontrado</p>
        <Button
          variant="outline-primary"
          onClick={() => navigate("/")}
          className="mt-3"
        >
          <ArrowLeft className="me-2" /> Volver
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Sidebar />
      <Header userName="Vanessa Juárez" />
      <section className={styles.content} style={{ backgroundColor: "gray" }}>
        {/* <Button variant="outline-primary" onClick={() => navigate("/inst/courses")} className={`m-5 ${style.btnBack}`}>
          <ArrowLeft className="me-2" /> Volver
        </Button> */}
        <Row className="row g-3 mb-4 mt-4 m-4">
          <Col lg={9}>
            <Card className={`mb-4 ${style.cardDetail}`}>
              <Card.Body>
                <Row >
                  <div className="col-md-4 d-flex align-items-stretch">
                    {course.image && (
                      <img
                        src={course.image || "/palceholder.svg"}
                        alt={course.title}
                        className="img-fluid rounded mb-3 mb-md-0 w-100"
                        style={{ objectFit: "cover", maxHeight: "285px" }}
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
          <div className="col-lg-3">
            <Card className={style.cardFrame}>
              <Card.Body>
                <h5
                  className={`card-title text-center ml-0 mb-3 ${style.cardTitle}`}
                >
                  ¿Deseas enviar el curso?
                </h5>
                {!isPublished &&
                  course.modules &&
                  course.modules.length > 0 && (
                    <>
                      <Button
                        onClick={handlePublishCourse}
                        className={`w-100 mb-2 ${style.primaryBtn}`}
                      >
                        Enviar Curso
                      </Button>
                    </>
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
          {!isPublished && (
            <Button
              className={`mr-2 ${style.btnAdd}`}
              onClick={() => {
                setCurrentModule(null);
                setIsModuleModalOpen(true);
              }}
            >
              <Plus className={"me-2"} /> Agregar Módulo
            </Button>
          )}
        </div>
        <Col lg={9}>
        {course.modules && course.modules.length > 0 ? (
            <ModuleAccordion
              modules={course.modules}
              onEditModule={handleEditModule}
              onDeleteModule={handleDeleteModule}
              isPublished={isPublished}
            />
          ) : (
            <p className="text-muted text-center py-4">
              No hay módulos disponibles. ¡Agrega uno nuevo!
            </p>
          )}
        </Col>
              {/* Modal para agregar/editar módulos */}
      <ModuleModal
        show={isModuleModalOpen}
        onHide={() => {
          setIsModuleModalOpen(false)
          setCurrentModule(null)
        }}
        onSave={handleSaveModule}
        initialData={currentModule}
      />

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
          <Button variant="danger" onClick={handleDeleteCourse}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      
      </section>
      <Footer />
    </>
  );
}

export default CourseDetailPage;
