// components/modals/PaymentModal.jsx

import { Modal, Button, Row, Col, Toast, ToastContainer, Spinner } from "react-bootstrap"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperclip } from "@fortawesome/free-solid-svg-icons"
import VoucherViewer from "../admin/VoucherViewer"
import { changePaymentStatus } from "../../api/admin/payment"

const PaymentModal = ({ show, onHide, payment }) => {
  const [showVoucher, setShowVoucher] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [toastVariant, setToastVariant] = useState("success")
  const [isLoading, setIsLoading] = useState(false)

  // Extract payment information
  const studentName = payment?.registration?.student?.name || "No disponible";
  const studentEmail = payment?.registration?.student?.email || "No disponible";
  const courseName = payment?.registration?.course?.title || "No disponible";
  const instructorName = payment?.registration?.course?.instructor?.name || "No disponible";
  const startDate = payment?.registration?.course?.startDate || "No disponible";
  const endDate = payment?.registration?.course?.endDate || "No disponible";
  const price = payment?.registration?.course?.price || 0;
  const status = payment?.status || "PENDING_PAYMENT";
  const paymentUrl = payment?.paymentUrl || "";
  const paymentId = payment?.paymentId || "";

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      const result = await changePaymentStatus(paymentId, "FINISHED")
      if (result.success) {
        setToastVariant("success")
        setToastMessage("El pago ha sido aprobado correctamente")
        setShowToast(true)
        setTimeout(() => {
          onHide()
          // Trigger a refresh of the payment list
          window.dispatchEvent(new Event("payment_updated"))
        }, 1500)
      } else {
        setToastVariant("danger")
        setToastMessage(result.error || "Error al aprobar el pago")
        setShowToast(true)
      }
    } catch (error) {
      setToastVariant("danger")
      setToastMessage("Error al aprobar el pago")
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      const result = await changePaymentStatus(paymentId, "FAILED")
      if (result.success) {
        setToastVariant("success")
        setToastMessage("El pago ha sido rechazado correctamente")
        setShowToast(true)
        setTimeout(() => {
          onHide()
          // Trigger a refresh of the payment list
          window.dispatchEvent(new Event("payment_updated"))
        }, 1500)
      } else {
        setToastVariant("danger")
        setToastMessage(result.error || "Error al rechazar el pago")
        setShowToast(true)
      }
    } catch (error) {
      setToastVariant("danger")
      setToastMessage("Error al rechazar el pago")
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to format status for display
  const formatStatus = (status) => {
    switch(status) {
      case "PENDING_PAYMENT": return "Pendiente";
      case "FINISHED": return "Aprobado";
      case "FAILED": return "Rechazado";
      default: return status;
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Información del Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <strong>Estudiante:</strong>
              <p>{studentName}</p>
              <strong>Correo:</strong>
              <p>{studentEmail}</p>
              <strong>Curso:</strong>
              <p>{courseName}</p>
              <strong>Instructor:</strong>
              <p>{instructorName}</p>
            </Col>
            <Col md={6}>
              <strong>Fecha de inicio:</strong>
              <p>{startDate}</p>
              <strong>Fecha de fin:</strong>
              <p>{endDate}</p>
              <strong>Costo:</strong>
              <p>${price.toFixed(2)} MXM</p>
              <strong>Estado:</strong>
              <p>{formatStatus(status)}</p>
              {paymentUrl && status !== "FINISHED" ? (
                <div className="mt-3">
                  <Button variant="outline-primary" onClick={() => setShowVoucher(true)}>
                    <FontAwesomeIcon icon={faPaperclip}></FontAwesomeIcon> Ver Voucher
                  </Button>
                </div>
              ) : (
                <div className="mt-3">
                  <p className="text-muted"><i>No hay comprobante disponible</i></p>
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          {status === "PENDING_PAYMENT" && (
            <div>
              <Button 
                variant="success" 
                className="me-2 mr-2" 
                onClick={handleApprove}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" animation="border" /> : "Aprobar"}
              </Button>
              <Button 
                variant="danger" 
                onClick={handleReject}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="sm" animation="border" /> : "Rechazar"}
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>
      {showVoucher && paymentUrl && (
        <VoucherViewer
          show={showVoucher}
          onHide={() => setShowVoucher(false)}
          voucher={paymentUrl}
        />
      )}

      {/* Toast de confirmación */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg={toastVariant}
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
