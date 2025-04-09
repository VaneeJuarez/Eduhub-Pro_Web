import { useState } from "react"
import { Modal } from "react-bootstrap"

const VoucherViewer = ({ show, onHide, voucher }) => {
    const [loading, setLoading] = useState(true)

    const extension = voucher.split(".").pop().toLowerCase()

    console.log(voucher);
    
    const renderContent = () => {
        if (extension === "pdf") {
            return (
                <iframe
                src={`https://docs.google.com/gview?url=${voucher}&embedded=true`}
                    className="w-100"
                    style={{ height: "80vh" }}
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
                    style={{ maxHeight: "80vh", objectFit: "contain" }}
                />
            )
        }
    }

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="xl" 
            centered
            dialogClassName="voucher-modal"
            style={{ zIndex: 2000 }} // Mayor z-index que el modal principal
            backdropClassName="voucher-modal-backdrop"
        >
            <Modal.Header closeButton>
                <Modal.Title>Voucher del Pago</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center p-0">
                {renderContent()}
            </Modal.Body>
            <style jsx>{`
                :global(.voucher-modal) {
                    max-width: 90%;
                    width: 90%;
                }
                :global(.voucher-modal .modal-content) {
                    height: 90vh;
                }
                :global(.voucher-modal-backdrop) {
                    background-color: rgba(0, 0, 0, 0.8);
                    z-index: 1999;
                }
            `}</style>
        </Modal>
    )
}



export default VoucherViewer