import { Link } from "react-router-dom"

//Styles
import styles from '../styles/coursecard.module.css'

// Components
import { EditDeleteButtons } from "./card/ActionButtons"

const CourseCard = ({ course, showActions = false }) => {
  return (
    <div className={`card h-100 shadow-sm d-flex flex-column ${styles.cardCourse}`} style={{zIndex: "90"}}>
      <img src={course.bannerPath} className="card-img-top" alt={course.title}
      style={{height: "250px", objectFit: "cover"}}
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className={`card-title ${styles.cardTitle}`}>{course.title}</h5>
         {/*  <div className={`d-flex align-items-center ${styles.cardRating}`}>
            <i className="bi bi-star-fill text-warning me-1"></i>
            {course.rating}
          </div> */}
        </div>
        <p className={`card-text text-muted mb-2 ${styles.cardText}`}>{course.description}</p>
        <div className="mb-2">
          {course.categories.map((tag, i) => (
            <span key={i} className={`badge text-light me-1 ${styles.cardTag}`}>
              {tag.name}
            </span>
          ))}
        </div>
        <div className={`text-muted mb-3 ${styles.cardInfo}`}>
          <div className="mb-1">
            <i className={`bi bi-person me-1 ${styles.cardIcons}`}></i>
            Instructor: <strong>{course.instructor.name}</strong>
          </div>
          <div className="mb-0">
            <i className={`bi bi-calendar me-1 ${styles.cardIcons}`}></i>
            {course.startDate} - {course.endDate}
          </div>
          
        </div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
            <div className={`fw-bold ${styles.cardPrice}`}>${course.price.toFixed(2)} mx</div>
            <div className="d-flex mt-2">
              {/* 🔹 Mostrar los botones solo si `showActions` es true */}
            {showActions && (
              <EditDeleteButtons
                onDelete={() => console.log("Eliminar curso con ID:", course.courseId)}
                onEdit={() => console.log("Editar curso:", course)}
                modalId={`editCourseModal-${course.courseId}`}
              />
            )}
            </div>
            <Link to={`/course/${course.courseId}`} className={`btn btn-primary ${styles.cardButton} `}>Ver Curso</Link>

        </div>
      </div>
      
    </div>
  )
}

export default CourseCard

