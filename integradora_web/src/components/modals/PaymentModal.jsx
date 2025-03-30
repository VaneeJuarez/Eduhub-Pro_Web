// components/modals/PaymentModal.jsx

import { Modal, Button, Row, Col, Toast, ToastContainer } from "react-bootstrap"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperclip } from "@fortawesome/free-solid-svg-icons"
import VoucherViewer from "../admin/VoucherViewer"

const PaymentModal = ({ show, onHide, payment }) => {
  const [showVoucher, setShowVoucher] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)

  const handleApprove = () => {
    updateStatus("Pagado", "El pago ha sido aprobado correctamente")
  }

  const handleReject = () => {
    updateStatus("Rechazado", "El pago ha sido rechazado.")
  }

  const updateStatus = (newStatus) => {
    const payments = JSON.parse(localStorage.getItem("payments") || "[]")
    const updatedPayments = payments.map((p) =>
      p.id === payment.id ? { ...p, status: newStatus } : p
    )
    localStorage.setItem("payments", JSON.stringify(updatedPayments))
    window.dispatchEvent(new Event("storage"))

    setToastMessage(message)
    setShowToast(true)
    onHide()
  }

  return (
    <>
      <Modal show={show} onHide={onHide} size="medium" centered>
        <Modal.Header closeButton>
          <Modal.Title>Información del Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <strong>Estudiante:</strong>
              <p>{payment.studentName}</p>
              <strong>Correo:</strong>
              <p>{payment.email}</p>
              <strong>Curso:</strong>
              <p>{payment.courseName}</p>
              <strong>Instructor:</strong>
              <p>{payment.instructor}</p>
            </Col>
            <Col md={6}>
              <strong>Fecha de inicio:</strong>
              <p>{payment.startDate}</p>
              <strong>Fecha de fin:</strong>
              <p>{payment.endDate}</p>
              <strong>Costo:</strong>
              <p>${payment.cost.toFixed(2)} MXM</p>
              <Button variant="outline-primary" onClick={() => setShowVoucher(true)}>
                <FontAwesomeIcon icon={faPaperclip}></FontAwesomeIcon> Ver Voucher
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">

          {payment.status === "Pagado" && (
            <div>
              <Button variant="success" className="me-2 mr-2" onClick={handleApprove}>
                Aprobar
              </Button>
              <Button variant="danger" onClick={handleReject}>
                Rechazar
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>
      {showVoucher && (
        <VoucherViewer
          show={showVoucher}
          onHide={() => setShowVoucher(false)}
          voucher={payment.voucher}
        />
      )}

      {/* Toast de confirmación */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg="success"
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  )
}

export default PaymentModal
