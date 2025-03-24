import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"

// Styles
import styles from '../../styles/modal.module.css'

const bankOptions = [
    { name: "BBVA", logo: "/assets/logos/bbva.png" },
    { name: "Santander", logo: "/assets/logos/santander.png" },
    { name: "Banorte", logo: "/assets/logos/banorte.png" },
    { name: "HSBC", logo: "/assets/logos/hsbc.png" },
  ];  

const BankAccountModal = ({ show, onHide, onSave, initialData = {} }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        number: initialData.number || "",
        key: initialData.key || ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const newAccount = {
            ...initialData,
            ...formData,
            status: initialData.status || "Activo",
            logo: initialData.logo
        }

        onSave(newAccount);
    };

    return (
        <Modal show={show} onHide={onHide} size="medium">
            <Modal.Header closeButton>
                <Modal.Title className={styles.ModalTitle}>
                    {initialData.id ? "Editar Cuenta Bancaria" : "Agregar Nueva Cuenta Bancaria"}
                </Modal.Title>
            </Modal.Header>
            <Form className={styles.Form} onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Banco</Form.Label>
                        <Form.Select
                        value={formData.name}
                        name="name"
                        onChange={handleChange}
                        className={styles.Select}
                        required>

                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
            </Form>
        </Modal>
    )
}

export default BankAccountModal