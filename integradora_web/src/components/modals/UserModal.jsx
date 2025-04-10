import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import defaultProfile from "../../assets/img/unknow.jpeg";
// Styles
import styles from '../../styles/modal.module.css';


const UserModal = ({ show, onHide, onSave, initialData = {} }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || "",
        email: initialData.email || "",
        password: initialData.password || "",
        role: initialData.role || ""
    });

    useEffect (() => {
        if (!show) {
            // Limpiar campos al cerrar el modal
            setFormData({
                name: "",
                email: "",
                password: "",
                role: ""
            });
        }
    }, [show])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const newUser = {
            ...initialData,
            ...formData,
            // Si estamos editando y la contraseña está vacía, no la incluimos
            ...(initialData.userId && !formData.password && { password: undefined }),
            status: initialData.status || "Activo",
            profilePicture: initialData.profilePicture || defaultProfile
        }

        onSave(newUser);
    };

    return (
        <Modal show={show} onHide={onHide} size="medium">
            <Modal.Header closeButton>
                <Modal.Title className={styles.ModalTitle}>
                    {initialData.userId ? "Editar Usuario" : "Agregar Usuario"}
                </Modal.Title>
            </Modal.Header>
            <Form className={styles.Form} onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            maxLength={40}
                            value={formData.name}
                            onChange={(e) => {
                                const letters = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]/g, "");
                                setFormData({ ...formData, name: letters});
                            }}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            maxLength={40}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            // Si existe el userId, deshabilitar el input
                            disabled = {Boolean(initialData.userId)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            maxLength={30}
                            onChange={handleChange}
                            required={!initialData.userId} // Solo requerido para nuevos usuarios
                            
                        />
                    </Form.Group>
                    <Form.Group controlId="formRole">
                        <Form.Label>Rol de Usuario</Form.Label>
                        <Form.Select
                            value={formData.role}
                            name="role"
                            onChange={handleChange}
                            required
                            className={styles.Select}
                            disabled={Boolean(initialData.userId)}
                        >
                            <option value="">Selecciona un rol</option>
                            <option value="INSTRUCTOR">Instructor</option>
                            <option value="STUDENT">Estudiante</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className={styles.btnPrimary} onClick={onHide}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" className={styles.btnSecondary} >
                        Guardar
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default UserModal
