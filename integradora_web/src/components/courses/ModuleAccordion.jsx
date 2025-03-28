"use client";

import { useState } from "react";
import { Accordion, Button, Modal } from "react-bootstrap";
import {
  Plus,
  FiletypePdf,
  Image,
  PlayBtn,
} from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

// Components
import LessonItem from "./LessonItem";
import LessonModal from "../modals/LessonModal";

// Styles
import styles from "../../styles/general.module.css"
// styles
import style from "../../styles/coursecard.module.css";

function ModuleAccordion({ modules, onEditModule, onDeleteModule, isPublished = false, onViewProgress, course, isAdmin = false }) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(null)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [moduleToDelete, setModuleToDelete] = useState(null)
  const [lessonToDelete, setLessonToDelete] = useState(null)
  const [showDeleteLessonDialog, setShowDeleteLessonDialog] = useState(false)

  const handleAddLesson = (moduleIndex, e) => {
    e.stopPropagation() // Evitar que el evento se propague al acordeón
    setCurrentModuleIndex(moduleIndex)
    setCurrentLessonIndex(null)
    setIsLessonModalOpen(true)
  }

  const handleEditLesson = (moduleIndex, lessonIndex) => {
    setCurrentModuleIndex(moduleIndex)
    setCurrentLessonIndex(lessonIndex)
    setIsLessonModalOpen(true)
  }

  const handleDeleteLesson = (moduleIndex, lessonIndex) => {
    setCurrentModuleIndex(moduleIndex)
    setLessonToDelete({ moduleIndex, lessonIndex })
    setShowDeleteLessonDialog(true)
  }

  const confirmDeleteLesson = () => {
    if (!lessonToDelete) return

    const { moduleIndex, lessonIndex } = lessonToDelete
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1)

    // Actualizar en localStorage
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const courseIndex = courses.findIndex(
      (c) => c.modules && c.modules.some((m) => m.title === modules[moduleIndex].title),
    )

    if (courseIndex !== -1) {
      const moduleIndexInCourse = courses[courseIndex].modules.findIndex((m) => m.title === modules[moduleIndex].title)

      if (moduleIndexInCourse !== -1) {
        courses[courseIndex].modules[moduleIndexInCourse] = updatedModules[moduleIndex]
        localStorage.setItem("courses", JSON.stringify(courses))
      }
    }

    // Cerrar el diálogo y resetear los estados
    setShowDeleteLessonDialog(false)
    setLessonToDelete(null)

    // Disparar evento para actualizar la lista en otras páginas
    window.dispatchEvent(new Event("storage"))
  }

  const handleSaveLesson = (lesson) => {
    if (currentModuleIndex === null) return

    const updatedModules = [...modules]

    if (currentLessonIndex !== null) {
      // Editar lección existente
      updatedModules[currentModuleIndex].lessons[currentLessonIndex] = lesson
    } else {
      // Agregar nueva lección
      if (!updatedModules[currentModuleIndex].lessons) {
        updatedModules[currentModuleIndex].lessons = []
      }
      updatedModules[currentModuleIndex].lessons.push(lesson)
    }

    // Actualizar en localStorage
    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const courseIndex = courses.findIndex(
      (c) => c.modules && c.modules.some((m) => m.title === modules[currentModuleIndex].title),
    )

    if (courseIndex !== -1) {
      const moduleIndexInCourse = courses[courseIndex].modules.findIndex(
        (m) => m.title === modules[currentModuleIndex].title,
      )

      if (moduleIndexInCourse !== -1) {
        courses[courseIndex].modules[moduleIndexInCourse] = updatedModules[currentModuleIndex]
        localStorage.setItem("courses", JSON.stringify(courses))
      }
    }

    // Cerrar el modal y resetear los estados
    setIsLessonModalOpen(false)
    setCurrentLessonIndex(null)
    setCurrentModuleIndex(null)

    // Disparar evento para actualizar la lista en otras páginas
    window.dispatchEvent(new Event("storage"))
  }

  const confirmDeleteModule = (moduleTitle) => {
    setModuleToDelete(moduleTitle)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteModuleConfirmed = () => {
    if (moduleToDelete) {
      onDeleteModule(moduleToDelete)
      setIsDeleteDialogOpen(false)
      setModuleToDelete(null)
    }
  }

  const getLessonIcon = (type) => {
    switch (type) {
      case "video":
        return <PlayBtn size={19} className="me-2 mr-2" />
      case "pdf":
        return <FiletypePdf size={20} className="me-2 mr-2" />
      case "image":
        return <Image size={19} className="me-2 mr-2" />
      default:
        return <FiletypePdf className="me-2 mr-2" />
    }
  }
  return (
    <>
    <Accordion defaultActiveKey="0" className={`ml-4 ${styles.Accordion}`}>
    {modules.map((module, moduleIndex) => (
          <Accordion.Item key={moduleIndex} eventKey={moduleIndex.toString()}>
            <Accordion.Header>
              <div className="d-flex justify-content-between align-items-center w-100 pe-4">
                <span>{module.title}</span>
                {!isPublished && (
                  <div className="d-flex" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="link"
                      size="sm"
                      className={`p-0 me-3 mr-3 ${style.Icons}`}
                      onClick={() => onEditModule(module)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className={`p-0 mr-3 ${style.Icons}`}
                      onClick={() => confirmDeleteModule(module.title)}
                    >
                      <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                    </Button>
                  </div>
                )}
                                {!isAdmin && !isPublished && course && course.status === "En Curso" && (
                  <div className="d-flex" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-primary"
                      onClick={() => onViewProgress(moduleIndex)}
                      title="Ver progreso de estudiantes"
                    >
                      <BarChartFill />
                    </Button>
                  </div>
                )}
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="module-content">
                {module.lessons && module.lessons.length > 0 ? (
                  <div className="mb-3">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <LessonItem
                        key={lessonIndex}
                        lesson={lesson}
                        icon={getLessonIcon(lesson.type)}
                        onEdit={() => handleEditLesson(moduleIndex, lessonIndex)}
                        onDelete={() => handleDeleteLesson(moduleIndex, lessonIndex)}
                        isPublished={isPublished}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted py-2">No hay lecciones disponibles.</p>
                )}

                {!isPublished && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => handleAddLesson(moduleIndex, e)}
                  >
                    <Plus className="me-2" /> Agregar Lección
                  </Button>
                )}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Modal para agregar/editar lecciones */}
      {currentModuleIndex !== null && (
        <LessonModal
          show={isLessonModalOpen}
          onHide={() => {
            setIsLessonModalOpen(false)
            setCurrentLessonIndex(null)
            setCurrentModuleIndex(null)
          }}
          onSave={handleSaveLesson}
          initialData={
            currentLessonIndex !== null && modules[currentModuleIndex].lessons
              ? modules[currentModuleIndex].lessons[currentLessonIndex]
              : undefined
          }
        />
      )}

      {/* Modal de confirmación para eliminar módulo */}
      <Modal show={isDeleteDialogOpen} onHide={() => setIsDeleteDialogOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Esta acción no se puede deshacer. Se eliminará permanentemente el módulo y todas sus lecciones.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteModuleConfirmed}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

            {/* Modal de confirmación para eliminar lección */}
            <Modal show={showDeleteLessonDialog} onHide={() => setShowDeleteLessonDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¿Estás seguro?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Esta acción no se puede deshacer. Se eliminará permanentemente la lección.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteLessonDialog(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDeleteLesson}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ModuleAccordion;
