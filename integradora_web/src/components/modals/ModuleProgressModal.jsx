"use client"

import { Modal, Button, Form, Row, Col, Card, Badge, ButtonGroup } from "react-bootstrap"
import { useState } from "react"
import { CheckCircleFill, XCircleFill, PersonFill } from "react-bootstrap-icons"

function ModuleProgressModal({ show, onHide, module }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // 'all', 'completed', 'pending'

  if (!module) return null

  // Filtrar estudiantes según el término de búsqueda y el filtro seleccionado
  const filteredStudents = module.progress.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "completed") return matchesSearch && student.completed
    if (filter === "pending") return matchesSearch && !student.completed

    return matchesSearch
  })

  // Calcular estadísticas
  const completedCount = module.progress.filter((student) => student.completed).length
  const completionRate = Math.round((completedCount / module.progress.length) * 100)

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Progreso del Módulo: {module.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 p-3 bg-light rounded">
          <div className="d-flex justify-content-between mb-2">
            <div>
              <strong>Total de estudiantes:</strong> {module.progress.length}
            </div>
            <div>
              <strong>Completado por:</strong> {completedCount} estudiantes ({completionRate}%)
            </div>
          </div>
          <div className="progress">
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${completionRate}%` }}
              aria-valuenow={completionRate}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {completionRate}%
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Control
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="me-2"
            style={{ maxWidth: "300px" }}
          />

          <ButtonGroup>
            <Button variant={filter === "all" ? "primary" : "outline-primary"} onClick={() => setFilter("all")}>
              Todos
            </Button>
            <Button
              variant={filter === "completed" ? "success" : "outline-success"}
              onClick={() => setFilter("completed")}
            >
              Completados
            </Button>
            <Button variant={filter === "pending" ? "warning" : "outline-warning"} onClick={() => setFilter("pending")}>
              Pendientes
            </Button>
          </ButtonGroup>
        </div>

        {filteredStudents.length > 0 ? (
          <Row xs={1} md={2} className="g-3">
            {filteredStudents.map((student) => (
              <Col key={student.id}>
                <Card className={student.completed ? "border-success" : "border-warning"}>
                  <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                      <div className="bg-light rounded-circle p-2 me-2">
                        <PersonFill size={24} />
                      </div>
                      <div>
                        <Card.Title className="mb-0 fs-5">{student.name}</Card.Title>
                        <Card.Subtitle className="text-muted">{student.email}</Card.Subtitle>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg={student.completed ? "success" : "warning"} className="py-2 px-3">
                        {student.completed ? (
                          <>
                            <CheckCircleFill className="me-1" /> Completado
                          </>
                        ) : (
                          <>
                            <XCircleFill className="me-1" /> Pendiente
                          </>
                        )}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center py-3">No se encontraron estudiantes con ese criterio de búsqueda.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModuleProgressModal

