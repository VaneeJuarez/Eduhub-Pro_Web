"use client"

import { useState } from "react"
import { Button, FormText, Badge } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

// styles
import styles from "../../styles/coursecard.module.css";

// Components
import LessonViewer from "./LessonViewer"

function LessonItem({ lesson, icon, onEdit, onDelete, isPublished = false }) {
    const [showViewer, setShowViewer] = useState(false)

    // Función para formatear la duración
  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return ""
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  
    return (
      <>
        <div className="lesson-item d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1 cursor-pointer" onClick={() => setShowViewer(true)}>
            <div className="d-flex align-items-center">
              {icon}
              <span className="fw-medium">{lesson.title}</span>
              {lesson.duration !== undefined && (
              <span className="ms-2 ml-2 badge bg-light text-dark">{formatDuration(lesson.duration)}</span>
            )}
            </div>
            {lesson.description && <p className="text-muted small mt-1 ms-4 mb-0">{lesson.description}</p>}
          </div>
          <div className="d-flex">
            <Button variant="link" className={`p-0 me-2 mr-3 ${styles.Icons}`} onClick={() => setShowViewer(true)}>
            <i className="fa-regular fa-eye"></i>
            </Button>
            {!isPublished && (
              <>
                <Button variant="link" className={`p-0 me-2 mr-3 ${styles.Icons}`} onClick={onEdit}>
                <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
                </Button>
                <Button variant="link" className={`p-0 mr-3 ${styles.Icons}`} onClick={onDelete}>
                <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                </Button>
              </>
            )}
          </div>
        </div>
  
        {/* Modal para visualizar el contenido */}
        <LessonViewer show={showViewer} onHide={() => setShowViewer(false)} lesson={lesson} />
      </>
    )
  }
  
  export default LessonItem