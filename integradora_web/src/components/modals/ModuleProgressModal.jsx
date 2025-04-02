"use client"

import { Modal, Button, Form, Row, Col, Card, Badge, ButtonGroup, ProgressBar } from "react-bootstrap"
import { useState } from "react"
import { CheckCircleFill, XCircleFill, PersonFill, Search } from "react-bootstrap-icons"

function ModuleProgressModal({ show, onHide, module, course }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("Completado") // 'Completado', 'Pendiente'

  if (!module || !course) return null

  // Filtrar estudiantes según el término de búsqueda y el filtro seleccionado
  const filteredStudents = module.progress
    ? module.progress.filter((student) => {
        const matchesSearch =
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())

        if (filter === "Completado") return matchesSearch && student.completed
        if (filter === "Pendiente") return matchesSearch && !student.completed
        return matchesSearch
      })
    : []

  // Calcular estadísticas
  const completedCount = module.progress ? module.progress.filter((student) => student.completed).length : 0
  const totalStudents = module.progress ? module.progress.length : 0
  const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0
  const averageProgress =
    totalStudents > 0
      ? Math.round(module.progress.reduce((sum, student) => sum + student.progress, 0) / totalStudents)
      : 0

  return (
    <Modal show={show} onHide={onHide} size="lg" dialogClassName="modal-90w">
      <Modal.Header closeButton>
        <Modal.Title>Progreso del Módulo: {module.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <Form.Control
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
              style={{ width: "300px" }}
              aria-label="Buscar estudiantes"
            />
            <Search className="text-muted position-relative" style={{ right: "30px" }} />
          </div>

          <ButtonGroup>
            <Button
              variant={filter === "Completado" ? "success" : "outline-success"}
              onClick={() => setFilter("Completado")}
            >
              Completados
            </Button>
            <Button
              variant={filter === "Pendiente" ? "warning" : "outline-warning"}
              onClick={() => setFilter("Pendiente")}
            >
              Pendientes
            </Button>
          </ButtonGroup>
        </div>

        {filteredStudents.length > 0 ? (
          <div className="student-list">
            {filteredStudents.map((student) => (
              <Card key={student.id} className={`mb-3 ${student.completed ? "border-success" : "border-warning"}`}>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded-circle p-2 me-3">
                          <PersonFill size={24} />
                        </div>
                        <div>
                          <h5 className="mb-0">{student.name}</h5>
                          <p className="text-muted mb-0">{student.email}</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="d-flex flex-column align-items-end h-100">
                        <Badge bg={student.completed ? "success" : "warning"} className="mb-2 py-2 px-3">
                          {student.completed ? (
                            <>
                              <CheckCircleFill className="me-1" /> Completado
                            </>
                          ) : (
                            <>
                              <XCircleFill className="me-1" /> En progreso
                            </>
                          )}
                        </Badge>

                        
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="mb-0">No se encontraron estudiantes con ese criterio de búsqueda.</p>
          </div>
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

