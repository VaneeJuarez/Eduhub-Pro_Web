"use client"

import { useState } from "react"
import { Button } from "react-bootstrap"

// styles
import styles from "../../styles/coursecard.module.css";

// Components
import LessonViewer from "./LessonViewer"

function LessonItem({ lesson, icon, onEdit, onDelete, isPublished = false }) {
    const [showViewer, setShowViewer] = useState(false)
  
    return (
      <>
        <div className="lesson-item d-flex justify-content-between align-items-start mb-2">
          <div className="flex-grow-1 cursor-pointer" onClick={() => setShowViewer(true)}>
            <div className="d-flex align-items-center">
              {icon}
              <span className="fw-medium">{lesson.title}</span>
            </div>
            {lesson.description && <p className="text-muted small mt-1 ms-4 mb-0">{lesson.description}</p>}
          </div>
          <div className="d-flex">
            <Button variant="link" className={`p-0 me-2 mr-3 ${styles.Icons}`} onClick={() => setShowViewer(true)}>
            <i class="fa-regular fa-eye"></i>
            </Button>
            {!isPublished && (
              <>
                <Button variant="link" className={`p-0 me-2 mr-3 ${styles.Icons}`} onClick={onEdit}>
                <i className="fas fa-edit"></i>
                </Button>
                <Button variant="link" className={`p-0 mr-3 ${styles.Icons}`} onClick={onDelete}>
                <i className="fas fa-trash-alt"></i>
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