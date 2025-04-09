import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { formatCourseDate, normalizeDate, parseDisplayDate } from "../../utils/dateUtils";
import { fetchAllCourses } from "../../api/admin/admin";

// Components
import Sidebar from "../../components/admin/Sidebar";
import ControlPanel from "../../components/ControlPanel";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

// Styles
import { useUserContext } from "../../contexts/UserProvider";
import style from "../../styles/coursecard.module.css";
import styles from "../../styles/general.module.css";
import { sweetAlert } from "../../utils/config/config";

function Courses() {

  const { user } = useUserContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([])
  const [filter, setFilter] = useState("Aprobados")
  const navigate = useNavigate()

  const handleViewCourse = (courseId) => {
    navigate(`/admin/courses/detail/${courseId}`)
  }

  // Función para obtener el color y texto del badge según el estado del curso
  const getStatusBadge = (status) => {
    switch (status) {
      case "TO_APPROVE":
        return { bg: "warning", text: "Pendiente de aprobación" };
      case "NOT_APPROVED":
        return { bg: "danger", text: "Rechazado" };
      case "PUBLISHED":
        return { bg: "success", text: "Publicado" };
      case "IN_PROGRESS":
        return { bg: "primary", text: "En progreso" };
      case "FINALIZED":
        return { bg: "secondary", text: "Finalizado" };
      case "IN_EDITION":
        return { bg: "info", text: "En edición" };
      case "INACTIVE":
        return { bg: "dark", text: "Inactivo" };
      default:
        return { bg: "light", text: "Desconocido" };
    }
  };

  useEffect(() => {
    fetchAllCourses().then(({ success, data, error }) => {
      if (!success) {
        sweetAlertF("error", "Error", error, "", null);
        return;
      }

      const mappedCourses = data.map((course) => ({
        courseId: course.courseId,
        title: course.title,
        description: course.description,
        banner_path: course.bannerPath,
        startDate: course.startDate,
        endDate: course.endDate,
        price: course.price,
        size: course.size,
        status: course.courseStatus, // enum original
        categories: course.categories.map((c) => c.name),
        instructor: { name: course.instructor?.name || "" },
        modules: course.modules.map((m) => ({
          moduleId: m.moduleId,
          name: m.name,
          date: m.date,
          status: m.status,
          lessons: m.sections.map((s) => ({
            sectionId: s.sectionId,
            title: s.name,
            description: s.description,
            content: s.contentUrl,
            type: s.contentType,
            status: s.status,
          })),
        })),
      }));

      setCourses(mappedCourses);
    });
  }, []);

  // Filtrar cursos según el filtro seleccionado
  const filteredCourses = courses
    // 1️⃣  Oculta cursos que no debe ver el admin
    .filter((c) => !["IN_EDITION", "INACTIVE"].includes(c.status))
    // 2️⃣  Búsqueda por texto
    .filter((course) => {
      const matchSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchFilter =
        filter === "all" ||
        (filter === "Pendientes" && course.status === "TO_APPROVE") ||
        (filter === "Aprobados" &&
          ["PUBLISHED", "IN_PROGRESS", "FINALIZED"].includes(course.status));

      return matchSearch && matchFilter;
    });

  return (
    <>
      <Sidebar />
      <Header userName={user?.name} />
      <section className={styles.content}>
        <ControlPanel
          showSearch={true}
          showToggle={true}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={filter}
          setSelectedFilter={setFilter}
          toggleOptions={[
            "Aprobados",
            "Pendientes"
          ]}
        />

        {filteredCourses.length > 0 ? (
          <Row className="g-4 m-4">
            {filteredCourses.map((course, id) => (
              <Col key={id} md={6} lg={3} className="mt-4">
                <Card className={`h-100 shadow-sm d-flex flex-column ${style.cardCourse}`}>
                  <Card.Img
                    variant="top"
                    src={course.banner_path || "/placeholder.svg"}
                    alt={course.title}
                    className="card-img-top"
                    style={{ height: "250px", objectFit: "contain" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start">
                      <Card.Title className={`mb-2 ${style.cardTitle}`}>
                        {course.title}
                      </Card.Title>
                      {/*  <div className="d-flex align-items-center text-muted">
                        <Star className="me-2 text-warning" size={14} />
                        <small>{course.rating}</small>
                      </div> */}
                    </div>
                    <Card.Text className={`text-muted mb-2 ${style.cardText}`}>
                      {course.description}
                    </Card.Text>
                    <div className="mb-2">
                      {/* Badge de estado del curso */}
                      {course.status && (
                        <Badge 
                          bg={getStatusBadge(course.status).bg} 
                          className="ml-1 mr-1 me-2 mb-2"
                          text="white"
                        >
                          {getStatusBadge(course.status).text}
                        </Badge>
                      )}
                      {/* Badges de categorías */}
                      {course.categories?.map((tag, index) => (
                        <Badge key={index} text="light" className={`${style.cardTag} me-1 mb-1`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className={`text-muted mb-2 ${style.cardInfo}`}>
                      <div className="mb-0">
                        <i className={`bi bi-person me-2 ${style.cardIcons}`}></i>
                        {course.instructor.name}
                      </div>
                    </div>
                    <div className="mb-0">
                      <i className={`bi bi-calendar me-2 ${style.cardIcons}`}></i>
                      {formatCourseDate(course.startDate)} - {formatCourseDate(course.endDate)}
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className={`fw-bold ${style.cardPrice}`}>
                        ${course.price.toFixed(2)} mx
                      </span>
                      <div className="d-flex mt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className={`flex-grow-1 me-2 ${style.cardButton}`}
                          onClick={(e) => handleViewCourse(course.courseId, e)}
                        >Ver Curso</Button>
                      </div>
                    </div>
                  </Card.Footer>
                </Card>
              </Col>

            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            {filter === "all" ? (
              <p className="text-muted">
                No hay cursos disponibles en el sistema.
              </p>
            ) : filter === "pending" ? (
              <p className="text-muted">No hay cursos pendientes de aprobación.</p>
            ) : (
              <p className="mb-0">No hay cursos aprobados.</p>
            )}
          </div>
        )}

      </section>
      <Footer />
    </>
  );
};

export default Courses
