import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Row, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { Star } from "react-bootstrap-icons"
import { parseDisplayDate, normalizeDate } from "../utils/dateUtils"

// Components
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Styles
import styles from "../styles/general.module.css";
import style from "../styles/coursecard.module.css";
import { useUserContext } from "../contexts/UserProvider";

function Courses() {

  const { user } = useUserContext();

  const [courses, setCourses] = useState([])
  const [filter, setFilter] = useState("all")
  const navigate = useNavigate()

  useEffect(() => {
    // Cargar cursos desde localStorage
    loadCourses()

    // Suscribirse a cambios en localStorage
    window.addEventListener("storage", loadCourses)
    return () => window.removeEventListener("storage", loadCourses)
  }, [])

  const loadCourses = () => {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")

    // Filtrar cursos: excluir los que están en estado "Pendiente" y los pendientes de aprobación con fecha vencida
    const filteredCourses = courses.filter((course) => {
      // Excluir cursos en estado "Pendiente" (que el docente no ha enviado aún)
      if (course.status === "Pendiente") {
        return false
      }

      // Verificar si es un curso pendiente de aprobación con fecha vencida
      if (course.status === "Pendiente de aprobar") {
        // Convertir fecha de inicio a formato de fecha
        const courseStartDate = normalizeDate(parseDisplayDate(course.startDate));
        const today = normalizeDate(new Date());

        return today < courseStartDate;

      }

      // Actualizar el estado del curso basado en las fechas actuales
      updateCourseStatus(course)

      return true
    })

    // Si se eliminaron cursos, actualizar localStorage
    if (filteredCourses.length < courses.length) {
      localStorage.setItem(
        "courses",
        JSON.stringify(
          courses.filter(
            (course) =>
              course.status !== "Pendiente" &&
              !(
                course.status === "Pendiente de aprobar" &&
                new Date().setHours(0, 0, 0, 0) >= new Date(parseDisplayDate(course.startDate)).setHours(0, 0, 0, 0)
              ),
          ),
        ),
      )
    }

    setCourses(filteredCourses)
  }

  // Función para actualizar el estado del curso basado en las fechas
  const updateCourseStatus = (course) => {
    if (course.status === "Aprobado" || course.status === "En Curso") {
      const currentStatus = determineCurrentStatus(course)

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
        }
      }
    }
  }

  // Determinar el estado actual del curso basado en las fechas
  const determineCurrentStatus = (course) => {
    if (hasEnded(course)) {
      return "Finalizado"
    } else if (isCurrentlyInProgress(course)) {
      return "En Curso"
    } else {
      return course.status
    }
  }

  // Verificar si el curso ya finalizó
  const hasEnded = (course) => {
    if (!course) return false

    const today = normalizeDate(new Date());
    const endDate = normalizeDate(parseDisplayDate(course.endDate));

    return today > endDate
  }

  // Verificar si el curso está actualmente en curso
  const isCurrentlyInProgress = (course) => {
    if (!course) return false

    const today = normalizeDate(new Date());
    const startDate = normalizeDate(parseDisplayDate(course.startDate));
    const endDate = normalizeDate(parseDisplayDate(course.endDate));

    return today >= startDate && today <= endDate
  }

  const handleViewCourse = (courseId) => {
    navigate(`/admin/courses/${courseId}`)
  }

  // Filtrar cursos según el filtro seleccionado
  const filteredCourses = courses.filter((course) => {
    if (filter === "all") return true
    if (filter === "pending") return course.status === "Pendiente de aprobar"
    if (filter === "approved") return ["Aprobado", "En Curso", "Finalizado"].includes(course.status)
    return true
  })

  return (
    <>
      <Sidebar />
      <Header userName={user?.name} />
      <section className={styles.content}>
        <ControlPanel
          showSearch={true}
          showToggle={true}
          // searchTerm={searchTerm}
          // setSearchTerm={setSearchTerm}
          // selectedFilter={selectedFilter}
          // setSelectedFilter={setSelectedFilter}
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
                    style={{ height: "250px", objectFit: "cover" }}
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
                      {course.categories?.map((tag, index) => (
                        <Badge key={index} text="light" className={style.cardTag}>
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
                      {course.startDate} - {course.endDate}
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
