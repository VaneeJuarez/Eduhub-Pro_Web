import { Modal, ModalTitle, Spinner } from "react-bootstrap"
import { useState } from "react"

const VoucherViewer = ({ show, onHide, voucher }) => {
    const [loading, setLoading] = useState(true)

    const extension = voucher.split(".").pop().toLowerCase()

    const renderContent = () => {
        if (extension === "pdf") {
            return (
                <iframe
                    src={voucher}
                    className="w-100"
                    style={{ height: "70vh" }}
                    onLoad={() => setLoading(false)}
                    title="Voucher"
                />
            )
        } else {
            return (
                <img
                    src={voucher}
                    alt="Voucher"
                    className="img-fluid"
                    onLoad={() => setLoading(false)}
                    style={{ maxHeight: "70vh", objectFit: "contain" }}
                />
            )
        }
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Voucher del Pago</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">

                {renderContent()}
            </Modal.Body>
        </Modal>
    )
}



export default VoucherViewer