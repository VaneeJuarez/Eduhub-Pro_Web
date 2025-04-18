import { useEffect, useState } from "react"
import { Modal } from "react-bootstrap"

const VoucherViewer = ({ show, onHide, voucher }) => {
    const [loading, setLoading] = useState(true)

    console.log('[VoucherViewer] voucher:', voucher)
    const extension = new URL(voucher).pathname.split(".").pop().toLowerCase();

    // const extension = voucher.split(".").pop().toLowerCase()
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
                    style={{
                        maxHeight: "80vh", objectFit: "contain"
                    }}
                />
            )
        }
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
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
            <style>
                {`
          .custom-dialog {
            max-width: 90% !important;
            width: 90% !important;
          }

          .custom-dialog .modal-content {
            height: 90vh;
          }

          .custom-backdrop {
            background-color: rgba(0, 0, 0, 0.8) !important;
            z-index: 1999 !important;
          }
        `}
            </style>
        </Modal>
    )
}



export default VoucherViewer