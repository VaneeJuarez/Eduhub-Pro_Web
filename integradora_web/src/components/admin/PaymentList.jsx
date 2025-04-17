import { useEffect, useState } from "react";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import defaultProfile from "../../assets/img/unknow.jpeg";

// Styles
import styles from "../../styles/card.module.css";

// Components
import PaymentModal from "../modals/PaymentModal";

// API
import { fetchPendingPayments, fetchFinishedPayments } from "../../api/admin/payment";

function PaymentList({ selectedFilter, searchTerm }) {
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const loadPayments = async () => {
    try {
      let response;
      
      // Cargar los pagos según el filtro seleccionado
      if (selectedFilter === "FINISHED") {
        response = await fetchFinishedPayments();
      } else if (selectedFilter === "PENDING_PAYMENT") {
        response = await fetchPendingPayments();
      } else {
        // Si no hay filtro específico, cargar todos los pagos
        const pendingResponse = await fetchPendingPayments();
        const finishedResponse = await fetchFinishedPayments();
        
        if (pendingResponse.success && finishedResponse.success) {
          // Combinar los resultados
          const combinedData = [
            ...(pendingResponse.data || []),
            ...(finishedResponse.data || [])
          ];
          
          setPayments(combinedData);
          return;
        } else {
          return;
        }
      }
      
      // Procesar la respuesta para el caso de un solo tipo de pagos
      if (response && response.success) {
        setPayments(response.data || []);
      } else {
      }
    } catch (err) {
    }
  };

  useEffect(() => {
    loadPayments();
  }, [selectedFilter]);

  // Escuchar eventos de actualización de pagos
  useEffect(() => {
    const handlePaymentUpdate = () => {
      loadPayments();
    };

    window.addEventListener("payment_updated", handlePaymentUpdate);
    return () => window.removeEventListener("payment_updated", handlePaymentUpdate);
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const student = payment.registration?.student?.name?.toLowerCase() || "";
    const course = payment.registration?.course?.title?.toLowerCase() || "";
    return (
      student.includes(searchTerm.toLowerCase()) ||
      course.includes(searchTerm.toLowerCase())
    );
  });

  // console.log("Current payments:", payments);
  // console.log("Selected filter:", selectedFilter);

  if (!filteredPayments || filteredPayments.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">
          No hay pagos {selectedFilter === "PENDING_PAYMENT" ? "pendientes" : 
                       selectedFilter === "FINISHED" ? "por aprobar" : 
                       "pendientes"}
        </p>
      </div>
    );
  }

  return (
    <>
      <Row className="mt-4 m-5">
        {payments.map((payment) => {
          // Extraer información del estudiante y curso
          const studentName = payment.registration?.student?.name || "Estudiante";
          const courseName = payment.registration?.course?.title || "Curso";
          const coursePrice = payment.registration?.course?.price || 0;
          const profilePhoto = payment.registration?.student?.profilePhotoPath || defaultProfile;
          
          return (
            <Col md={3} key={payment.paymentId} className="mb-3">
              <Card className={styles.Card}>
                <Card.Body className="p-1">
                  <Row className="align-items-center mb-0">
                    <Col xs="auto">
                      <div>
                        <img 
                        src={profilePhoto}
                        alt="User"
                        className={styles.Img}
                        />
                      </div>
                    </Col>
                    <Col style={{minWidth: 0}}>
                      <OverlayTrigger placement="top"
                      overlay={<Tooltip id={`tooltip.studentName-${studentName}`}>
                        {studentName}
                      </Tooltip>}>
                        <h6 className={styles.cardTitle}>{studentName}</h6>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top"
                      overlay={<Tooltip id={`tooltip.courseName-${courseName}`}>
                        {courseName}
                      </Tooltip>}>
                       <p className={`text-muted mb-0 ${styles.Description}`}>{courseName}</p>
                    </OverlayTrigger>
                    <p className={`fw-bold ${styles.Price}`}>${coursePrice.toFixed(2)} MXM</p>
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
          );
        })}
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
