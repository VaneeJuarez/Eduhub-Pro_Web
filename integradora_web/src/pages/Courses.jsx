import React, { useState, useEffect } from "react";
import { Container, Card, Badge, Button, Table, Row, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { Star, ClockFill, CheckCircleFill, XCircleFill, EyeFill } from "react-bootstrap-icons"


// Components
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

// Styles
import styles from "../styles/general.module.css";
import style from "../styles/coursecard.module.css";

function Courses() {
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

    // Filtrar cursos pendientes de aprobación con fecha vencida
    const filteredCourses = courses.filter((course) => {
      if (course.status === "Pendiente de aprobar") {
        // Convertir fecha de inicio a formato de fecha
        const startDate = parseDisplayDate(course.startDate)
        // Verificar si la fecha ya pasó
        return new Date() <= new Date(startDate)
      }
      return true
    })

    // Si se eliminaron cursos, actualizar localStorage
    if (filteredCourses.length < courses.length) {
      localStorage.setItem("courses", JSON.stringify(filteredCourses))
    }

    setCourses(filteredCourses)
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
      <Header userName={"Vanessa Juárez"} />
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
            {filteredCourses.map((course) => (
              <Col key={course.id} md={6} lg={3} className="mt-4">
                <Card className={`h-100 shadow-sm d-flex flex-column ${style.cardCourse}`}>
                  <Card.Img
                    variant="top"
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="card-img-top"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start">
                      <Card.Title className={`mb-2 ${style.cardTitle}`}>
                        {course.title}
                      </Card.Title>
                      <div className="d-flex align-items-center text-muted">
                        <Star className="me-2 text-warning" size={14} />
                        <small>{course.rating}</small>
                      </div>
                    </div>
                    <Card.Text className={`text-muted mb-2 ${style.cardText}`}>
                      {course.description}
                    </Card.Text>
                    <div className="mb-2">
                      {course.tags?.map((tag, index) => (
                        <Badge key={index} text="light" className={style.cardTag}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className={`text-muted mb-2 ${style.cardInfo}`}>
                      <div className="mb-0">
                        <i className={`bi bi-person me-2 ${style.cardIcons}`}></i>
                        {course.instructor}
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
                      onClick={(e) => handleViewCourse(course.id, e)}
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
