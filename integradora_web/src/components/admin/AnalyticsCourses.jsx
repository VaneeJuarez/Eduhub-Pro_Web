import React, { useState } from "react";
import { Container, Row, Col, Card, Badge, Tabs, Tab, Table, Image } from "react-bootstrap"
import { Link } from "react-router-dom"

// Styles
import styles from "../../styles/menu.module.css";
import style from '../../styles/coursecard.module.css'

const AnalyticsCourses = () => {
    const [courses, setCourses] = useState([
        {
            id: 1,
            title: "JavaScript Fundamentals",
            description: "Curso de JavaScript muy pro",
            "categories": [
                { "name": "Programación" },
                { "name": "Tecnología" }
            ],
            instructor: { "name": "María González" },
            startDate: "Mar 20",
            endDate: "Abr 05",
            price: 109.50,
            rating: 4.9,
            bannerPath: "/placeholder.svg",
        },
        {
            id: 2,
            title: "React for Beginners",
            description: "Curso de React muy pro",
            "categories": [
                { "name": "Programación" },
                { "name": "Tecnología" }
            ],
            instructor: { "name": "María González" },
            startDate: "Mar 20",
            endDate: "Abr 05",
            price: 109.50,
            rating: 4.8,
            bannerPath: "/placeholder.svg",
        },
        {
            id: 3,
            title: "Advanced CSS Techniques",
            description: "Curso de JavaScript muy pro",
            "categories": [
                { "name": "Programación" },
                { "name": "Tecnología" }
            ],
            instructor: { "name": "María González" },
            startDate: "Mar 20",
            endDate: "Abr 05",
            price: 109.50,
            rating: 4.7,
            bannerPath: "/placeholder.svg",
        },
    ])

    // Función para renderizar las cards
    const CourseCard = ({ course }) => (
        <Card className={`h-100 shadow-sm d-flex flex-column ${style.cardCourse}`}>
            <Image
                src={course.bannerPath || "/placeholder.svg"} className="card-img-top" alt={course.title}
                style={{ height: "250px", objectFit: "cover" }}
            />
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                    <h5 className={`card-title ${style.cardTitle}`}>{course.title}</h5>
                    <div className={`d-flex align-items-center ${style.cardRating}`}>
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {course.rating}
                    </div>
                </div>
                <p className={`card-text text-muted mb-2 ${style.cardText}`}>{course.description}</p>
                <div className="mb-2">
                    {course.categories.map((tag, i) => (
                        <span key={i} className={`badge text-light me-1 ${style.cardTag}`}>
                            {tag.name}
                        </span>
                    ))}
                </div>
                <div className={`text-muted mb-3 ${style.cardInfo}`}>
                    <div className="mb-1">
                        <i className={`bi bi-person me-1 mr-1 ${styles.cardIcons}`}></i>
                        Instructor: <strong>{course.instructor.name}</strong>
                    </div>
                    <div className="mb-0">
                        <i className={`bi bi-calendar me-1 mr-1 ${styles.cardIcons}`}></i>
                        {course.startDate} - {course.endDate}
                    </div>
                </div>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div className={`fw-bold ${style.cardPrice}`}>${course.price.toFixed(2)} mx</div>
                    <Link to={`/course/${course.courseId}`} className={`btn btn-primary ${style.cardButton} `}>Ver Curso</Link>
                    
                </div>
            </Card.Body>
        </Card>
    )

    return (
        <section className={`${styles.miniCourses}`} id="courses">
            <div className={`${styles.miniContentCourse}`}>
                <Container>
                    <Row>
                        <Col lg={6} className="offset-lg-3">
                            <div className={`${styles.infoCourses}`}>
                                <h1>Administración de Cursos</h1>
                            </div>
                        </Col>
                    </Row>
                    <Row className="mb-4 g-4 justify-content-between">
                        <Col md={5}>
                            <h4 className={`fs-4 fw-semibold mb-3 ${styles.Subtitle}`}>Mejor Calificado</h4>
                            <CourseCard course={courses[0]} />
                        </Col>
                        
                        <Col md={5}>
                            <h4 className={`fs-4 fw-semibold mb-3 ${styles.Subtitle}`}>Peor Calificado</h4>
                            <CourseCard course={courses[2]} />
                        </Col>
                    </Row>
                </Container>
            </div>

        </section>
    )
}

export default AnalyticsCourses