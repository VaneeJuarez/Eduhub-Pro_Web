import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Tabs, Tab, Table, Image } from "react-bootstrap"
import { Link } from "react-router-dom"

// Styles
import styles from "../../styles/menu.module.css";
import style from '../../styles/coursecard.module.css'

// Config
import { base_api_url, admin_path, review_management, all } from "../../utils/config/paths";
import { headers } from "../../utils/config/config";

const AnalyticsCourses = () => {
    const [reviews, setReviews] = useState([]);
    const [bestCourse, setBestCourse] = useState(null);
    const [worstCourse, setWorstCourse] = useState(null);

    // Cargar todas las reseñas
    useEffect(() => {
    
        fetch(`${base_api_url}${admin_path}${review_management}${all}`, {
            method: "GET",
            headers: headers,
        })
        .then((res) => {
            if (!res.ok) {
                // Manejar error HTTP
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            if (data.type === "SUCCESS") {
                setReviews(data.result);
            }
        })
    }, []);

    // Calcular promedios y determinar mejor / peor
    useEffect(() => {
        if (reviews.length > 0) {
            // Mapeo para agrupar reseñas por ID de curso
            const courseMap = {};

            // Recorremos cada review
            reviews.forEach((review) => {
                const courseObj = review.course; 
                if (!courseObj) return; 

                const cId = courseObj.courseId; 
                if (!courseMap[cId]) {
                    courseMap[cId] = {
                        course: courseObj, // Guardamos info del curso
                        sum: 0, // Suma de scores
                        count: 0 // Número de reseñas
                    };
                }
                courseMap[cId].sum += review.score;
                courseMap[cId].count += 1;
            });

            // Convertir a array para poder calcular y buscar máximos y mínimos
            let courseRatings = Object.values(courseMap).map((item) => {
                const avg = item.count > 0 ? item.sum / item.count : 0;
                return {
                    ...item.course, 
                    averageScore: avg
                };
            });

            if (courseRatings.length === 0) {
                setBestCourse(null);
                setWorstCourse(null);
                return;
            }

            // Ordenar desc por promedio
            courseRatings.sort((a, b) => b.averageScore - a.averageScore);

            const best = courseRatings[0];
            const worst = courseRatings[courseRatings.length - 1];

            setBestCourse(best);
            setWorstCourse(worst);
        }
    }, [reviews]);

    // Función para renderizar las cards
    const CourseCard = ({ course }) => (
        <Card className={`h-90 shadow-sm d-flex flex-column ${style.cardCourse}`}>
            <Image
                src={course.bannerPath || "/placeholder.svg"} className="card-img-top" alt={course.title}
                style={{ height: "250px", objectFit: "cover" }}
            />
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                    <h5 className={`card-title ${style.cardTitle}`}>{course.title}</h5>
                    <div className={`d-flex align-items-center ${style.cardRating}`}>
                        <i className="bi bi-star-fill text-warning me-1"></i>
                        {course.averageScore?.toFixed(1) ?? "0.0"}
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
                    {/* <Link to={`/admin/courses/${course.courseId}`} className={`btn btn-primary ${style.cardButton} `}>Ver Curso</Link>
                     */}
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
                            {bestCourse ? (
                                <CourseCard course={bestCourse} />
                                ): ( 
                                    <p>No hay datos</p>
                                )}
                        </Col>
                        
                        <Col md={5}>
                            <h4 className={`fs-4 fw-semibold mb-3 ${styles.Subtitle}`}>Peor Calificado</h4>
                            {worstCourse ? (
                                <CourseCard course={worstCourse} />
                                ) : (
                                    <p>No hay datos</p>
                                )}
                        </Col>
                    </Row>
                </Container>
            </div>

        </section>
    )
}

export default AnalyticsCourses