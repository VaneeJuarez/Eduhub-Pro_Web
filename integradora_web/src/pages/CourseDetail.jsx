import { useState } from "react";
import { useParams } from "react-router-dom";
import { courses } from "../data/courses";

// Components
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import VideoPlayer from "../components/courses/VideoPlayer";
import PDFViewer from "../components/courses/PDFViewer";

// Styles
import styles from "../styles/general.module.css";
import style from "../styles/coursecard.module.css";
import * as bootstrap from "bootstrap";

const CourseDetail = () => {
  const { id } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeTab, setActiveTab] = useState("content");

  const course = courses.find((c) => c.id == Number(id));

  if (!course) {
    return (
      <div className="text-center py-5">
        <h2 className="mb-4">Curso no encontrado</h2>
      </div>
    );
  }

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    const modal = new bootstrap.Modal(document.getElementById("lessonModal"));
    modal.show();
  };

  return (
    <>
      <Sidebar />
      <Header userName="Vanessa Juárez" />
      <section className={styles.content} style={{ backgroundColor: "gray" }}>
        <div>
          <div className="row mb-4 g-3 mt-4 m-4">
            <div className="col-lg-9">
              <div className={`card mb-4 ${style.cardDetail}`}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 d-flex align-items-stretch">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="img-fluid rounded mb-3 mb-md-0 w-100 h-100"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-8">
                      <h1 className="h3 mb-2">{course.title}</h1>
                      <p className="text-muted mb-2">{course.description}</p>
                      <div className="mb-3">
                        {course.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`badge text-light me-1 ${style.cardTag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mb-1">
                        <i
                          className={`bi bi-calendar me-2 ${style.cardIcons}`}
                        ></i>
                        {course.startDate} - {course.endDate}
                      </div>
                      <div className="mb-1">
                        <i
                          className={`bi bi-person me-2 ${style.cardIcons}`}
                        ></i>
                        Creado por: {course.instructor}
                      </div>
                      <div className="mb-1">
                        <i
                          className={`bi bi-people me-2 ${style.cardIcons}`}
                        ></i>
                        Límite de estudiantes: {course.studentLimit}
                      </div>
                      <div className="h4 mt-2">
                        ${course.price.toFixed(2)} mx
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className={`card ${style.cardFrame}`}>
                <div className="card-body">
                  <h5
                    className={`card-title text-center ml-0 mb-3 ${style.cardTitle}`}
                  >
                    ¿Apruebas este curso?
                  </h5>
                  <button
                    className={`btn btn-primary w-100 mb-2 ${style.primaryBtn}`}
                  >
                    Aprobar curso
                  </button>
                  <button className={`btn btn-light w-100 ${style.cancelBtn}`}>
                    Rechazar curso
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h5 className={`ml-5 mb-3 g-3 ${style.contentCourse}`}>
            Contenido del curso
          </h5>
          <div className={`tab-content ml-5 mr-5 ${style.tabContent}`}>
            <div
              className={`tab-pane fade ${
                activeTab === "content" ? "show active" : ""
              }`}
            >
              <div className={`card ${style.tabContent}`}>
                <div className={`card-body ${style.cardBody}`}>
                  <div className="accordion" id="moduleAccordion">
                    {course.modules.map((module, index) => (
                      <div className="accordion-item" key={index}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button collapsed ${style.accordionBtn}`}
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#module-${index}`}
                          >
                            {module.title}
                          </button>
                        </h2>
                        <div
                          id={`module-${index}`}
                          className="accordion-collapse collapse"
                          data-bs-parent="#moduleAccordion"
                        >
                          <div className="accordion-body">
                            <div className="list-group">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <button
                                  key={lessonIndex}
                                  className="list-group-item list-group-item-action d-flex align-items-center"
                                  onClick={() => handleLessonClick(lesson)}
                                >
                                  <i
                                    className={`bi ${
                                      lesson.type === "video"
                                        ? "bi-camera-video"
                                        : "bi-file-text"
                                    } me-2 ${style.cardIcons}`}
                                  ></i>
                                  <span>{lesson.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Modal para lecciones */}
          <div className="modal fade" id="lessonModal" tabIndex={-1}>
            <div className="modal-dialog modal-xl">
              <div className={`modal-content ${style.modalContent}`}>
                <div className="modal-header">
                  <h5 className={`modal-title ${style.modalTitle}`}>{selectedLesson?.title}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedLesson?.type === "video" ? (
                    <VideoPlayer src={selectedLesson.content} />
                  ) : (
                    <PDFViewer src={selectedLesson?.content || ""} />
                  )}
                  <p className="text-muted mt-3">
                    {selectedLesson?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CourseDetail;
