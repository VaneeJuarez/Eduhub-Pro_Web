"use client"

import { Modal, Button, Form, Row, Col, Card, InputGroup, Spinner } from "react-bootstrap"
import { useState } from "react"
import { Search, PersonFill } from "react-bootstrap-icons"

function StudentListModal({ show, onHide, students = [], course, isLoading = false }) {
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
              <Col key={student.userId}>
                <Card className="mb-2">
                  <Card.Body>
                    <div className="d-flex align-items-center">
                      {student.profilePhotoPath ? (
                        <img
                          src={student.profilePhotoPath}
                          alt={student.name}
                          className="rounded-circle me-3"
                          style={{ width: "40px", height: "40px", objectFit: "cover" }}
                        />
                      ) : (
                        <div className="bg-light rounded-circle p-2 me-3">
                          <PersonFill size={28} />
                        </div>
                      )}
                      <div className="ml-2">
                        <Card.Title className="mb-1 fs-5 mb-2" style={{fontSize: "18px"}} >{student.name}</Card.Title>
                        <Card.Subtitle className="text-muted">{student.email}</Card.Subtitle>
                        {/* <small className="text-muted d-block mt-1">Registro: {new Date(student.registerDate).toLocaleDateString()}</small> */}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {/* Espacio vacío para centrar si hay número impar */}
            {filteredStudents.length % 2 !== 0 && (
              <Col className="d-none d-md-block" />
            )}
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
