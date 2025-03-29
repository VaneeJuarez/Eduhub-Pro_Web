import { useEffect, useState } from "react";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import defaultProfile from "../../assets/img/unknow.jpeg";

// Styles
import styles from "../../styles/card.module.css";

// Components
import PaymentModal from "../modals/PaymentModal";

function PaymentList({ selectedFilter }) {
  const [payments, setPayments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  

  useEffect(() => {
    const storedPayments = JSON.parse(localStorage.getItem("payments") || "[]")
    setPayments(storedPayments)

    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("payments") || "[]")
      setPayments(updated)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  

  // Si no estás aplicando filtros, comenta o elimina esta parte:
  const filteredPayments = payments.filter((p) =>
    selectedFilter ? p.status === selectedFilter : true
  )

  if (filteredPayments.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">
          No hay pagos registrados
          </p>
        </div>
    ) 
  }

  return (
    <>
      <Row className="mt-4 m-5">
        {filteredPayments.map((payment) => (
          <Col md={3} key={payment.id} className="mb-3">
            <Card className={styles.Card}>
              <Card.Body className="p-1">
                <Row className="align-items-center mb-0">
                  <Col xs="auto">
                    <div>
                      <img 
                      src={payment.profileUser || defaultProfile}
                      alt="User"
                      className={styles.Img}
                      />
                    </div>
                  </Col>
                  <Col style={{minWidth: 0}}>
                    <OverlayTrigger placement="top"
                    overlay={<Tooltip id={`tooltip.studentName-${payment.studentName}`}>{payment.studentName}</Tooltip>}>
                      <h6 className={styles.cardTitle}>{payment.studentName}</h6>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top"
                    overlay={<Tooltip id={`tooltip.courseName-${payment.courseName}`}>{payment.courseName}</Tooltip>}>
                     <p className={`text-muted mb-0 ${styles.Description}`}>{payment.courseName}</p>
                  </OverlayTrigger>
                  <p className={`fw-bold ${styles.Price}`}>${payment.cost.toFixed(2)} MXM</p>
                  </Col>
                </Row>
                <Row className="mt-0">
                  <Col xs={12} className="d-flex justify-content-end gap-3 mt-2">
                  <Button
                  size="sm" 
                  className={styles.PayButton}
                  onClick={() => {
                    setSelectedPayment(payment)
                    setShowModal(true)
                  }}
                >
                  Ver detalles
                </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedPayment && (
        <PaymentModal
          show={showModal}
          onHide={() => {
            setSelectedPayment(null)
            setShowModal(false)
          }}
          payment={selectedPayment}
        />
      )}
    </>
  )
}

export default PaymentList
