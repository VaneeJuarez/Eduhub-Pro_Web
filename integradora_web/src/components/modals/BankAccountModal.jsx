import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"

// Styles
import styles from '../../styles/modal.module.css'

// Bank images
import bbva from "../../assets/img/banks/bbva.png"
import santander from "../../assets/img/banks/santander.png"
import banorte from "../../assets/img/banks/banorte.png"
import hsbc from "../../assets/img/banks/hsbc.png"
import bancoAzteca from "../../assets/img/banks/banco-azteca.png"
import citibanamex from "../../assets/img/banks/citi.png"

const bankOptions = [
    { name: "BBVA", logo: bbva },
    { name: "Santander", logo: santander },
    { name: "Banorte", logo: banorte },
    { name: "HSBC", logo: hsbc },
    { name: "Banco Azteca", logo: bancoAzteca },
    { name: "Citibanamex", logo: citibanamex }
  ];

const BankAccountModal = ({ show, onHide, onSave, initialData = {} }) => {
    const [formData, setFormData] = useState({
        bankName: initialData.bankName || "",
        accountNumber: initialData.accountNumber || "",
        key: initialData.key || "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!show) return

        setFormData({
            bankName: initialData.bankName || "",
            accountNumber: initialData.accountNumber || "",
            key: initialData.key || "",
        });
    }, [show, initialData.accountId]);

    const validate = () => {
        const newErrors = {};
        if (!formData.bankName) newErrors.bankName = "Selecciona un banco";
        if (!/^\d{10,11}$/.test(formData.accountNumber)) {
            newErrors.accountNumber = "Número de cuenta inválido (10-11 dígitos)";
          }          
        if (!/^\d{18}$/.test(formData.key)) newErrors.key = "CLABE debe tener 18 dígitos";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
      
      const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === "accountNumber") {
          if (/^\d{0,11}$/.test(value)) {
            setFormData((prev) => ({ ...prev, accountNumber: value }));
          }
        } else if (name === "key") {
          if (/^\d{0,18}$/.test(value)) {
            setFormData((prev) => ({ ...prev, key: value }));
          }
        } else {
          setFormData((prev) => ({ ...prev, [name]: value }));
        }
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const newAccount = {
            ...initialData,
            ...formData,
            status: initialData.status || "Activo",
        }

        onSave(newAccount);
        onHide();
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
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleChange}
                            required
                            isInvalid={!!errors.bankName}
                            className={styles.Select}
                        >
                            <option value="">Selecciona un banco</option>
                            {bankOptions.map((bank) => (
                                <option key={bank.name} value={bank.name}>
                                    {bank.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.bankName}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Número de Cuenta</Form.Label>
                        <Form.Control
                            type="text"
                            name="accountNumber"
                            maxLength={11}
                            value={formData.accountNumber}
                            onChange={handleChange}
                            isInvalid={!!errors.accountNumber}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{errors.accountNumber}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>CLABE</Form.Label>
                        <Form.Control
                            type="text"
                            name="key"
                            maxLength={18}
                            value={formData.key}
                            onChange={handleChange}
                            isInvalid={!!errors.key}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{errors.key}</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default BankAccountModal