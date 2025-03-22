"use client"

import { useState } from "react"
import { Modal, Button, Spinner } from "react-bootstrap"

function LessonViewer({ show, onHide, lesson }) {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const renderContent = () => {
    switch (lesson.type) {
      case "video":
        return (
          <div className="position-relative w-100">
            {isLoading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Cargando video...</span>
                </Spinner>
              </div>
            )}
            <video
              src={lesson.content}
              controls
              className="w-100"
              style={{ maxHeight: "70vh" }}
              onLoadedData={handleLoad}
            />
          </div>
        )
      case "pdf":
        return (
          <div className="position-relative w-100" style={{ height: "70vh" }}>
            {isLoading && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Cargando PDF...</span>
                </Spinner>
              </div>
            )}
            <iframe src={lesson.content} className="w-100 h-100 border-0" onLoad={handleLoad} title={lesson.title} />
          </div>
        )
      case "image":
        return (
          <div className="position-relative w-100">
            {isLoading && (
              <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: "300px" }}>
                <Spinner animation="border" role="status">
                </Spinner>
                
                <span className="visually-hidden">Cargando imagen...</span>
              </div>
            )}
            <img
              src={lesson.content || "/placeholder.svg"}
              alt={lesson.title}
              className="img-fluid mx-auto d-block"
              style={{ maxHeight: "70vh" }}
              onLoad={handleLoad}
            />
          </div>
        )
      default:
        return <p>Tipo de contenido no soportado</p>
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{lesson.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {lesson.description && <p className="text-muted mb-3">{lesson.description}</p>}
        {renderContent()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LessonViewer

