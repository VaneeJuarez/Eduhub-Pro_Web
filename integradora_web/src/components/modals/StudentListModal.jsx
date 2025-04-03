"use client"

import { Modal, Button, Form, Row, Col, Card, InputGroup } from "react-bootstrap"
import { useState } from "react"
import { Search, PersonFill } from "react-bootstrap-icons"

function StudentListModal({ show, onHide, students, course }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar estudiantes según el término de búsqueda
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Estudiantes Inscritos - {course.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <Search />
          </InputGroup.Text>
          <Form.Control
            placeholder="Buscar estudiantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {filteredStudents.length > 0 ? (
          <Row xs={1} md={2} className="g-3">
            {filteredStudents.map((student) => (
              <Col key={student.id}>
                <Card>
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <PersonFill size={24} />
                      </div>
                      <div className="ml-2">
                        <Card.Title className="mb-1 fs-5">{student.name}</Card.Title>
                        <Card.Subtitle className="text-muted">{student.email}</Card.Subtitle>
                      </div>
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

export default StudentListModal

