"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import defaultProfile from "../assets/img/unknow.jpeg";

// Styles
import styles from "../styles/card.module.css"

// Modals 
import UserModal from "./modals/UserModal";

function UserList() {
    const [users, setUsers] = useState([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null)
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: "", body: "", variant: "success" })
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar usuarios desde localStorage
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
        setUsers(storedUsers);

        // Suscribirse a cambios en el localStorge
        const handleStorageChange = () => {
            const updatedUsers = JSON.parse(localStorage.getItem("users") || "[]")
            setUsers(updatedUsers)
        }

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const showToastMessage = (title, body, variant = "success") => {
        setToastMessage({ title, body, variant });
        setShowToast(true);
    };

    const handleEditUser = (user, e) => {
        e.stopPropagation();

        setUserToEdit(user);
        setIsEditModalOpen(true);
    }

    const handleDeleteUser = (userId, e) => {
        e.stopPropagation();

        const userToDelete = users.find((user) => user.id === userId);

        setUserToDelete(userId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteUser = () => {
        if (userToDelete) {
            const updatedUsers = users.filter((user) => user.id !== userToDelete)
            localStorage.setItem("users", JSON.stringify(updatedUsers))
            setUsers(updatedUsers)
            setIsDeleteDialogOpen(false)
            setUserToDelete(null)

            showToastMessage("Usuario eliminado", "El usuario ha sido eliminado exitosamente", "danger")

            // Disparar evento para actualizar la lista en otras páginas
            window.dispatchEvent(new Event("storage"))
        }
    }

    const handleSaveEditedUser = (updatedUser) => {
        const updatedUsers = users.map((user) =>
            user.id === updatedUser.id ? { ...updatedUser, id: user.id } : user,
        )

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setIsEditModalOpen(false);
        setUserToEdit(null);

        showToastMessage("Curso actualizado", "El curso ha sido actualizado exitosamente")

        // Disparar evento para actualizar la lista en otras páginas
        window.dispatchEvent(new Event("storage"));
    };

    if (users.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">
                    No hay usuarios registrados
                </p>
            </div>
        )
    }

    return (
        <>
            <Row className="mt-4 m-5">
                {users.map((user) => (
                    <Col md={3} key={user.id} className="mb-3">
                        <Card className={styles.Card}>
                            <Card.Body className="p-1">
                                {/* Sección superior con imagen, nombre y correo */}
                                <Row className="align-items-center mb-0">
                                    <Col xs="auto">
                                        <div>
                                            <img
                                                src={user.profilePicture || defaultProfile}
                                                alt="User"
                                                className={styles.Img}    
                                            />
                                        </div>
                                    </Col>
                                    <Col style={{minWidth: 0}}>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id={`tooltip-name-${user.id}`}>{user.name}</Tooltip>}
                                        >
                                        <h6 className={`mb-0 fw-bold ${styles.Title}`}>{user.name}</h6>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id={`tooltip-email-${user.id}`}>{user.email}</Tooltip>}
                                        >
                                        <p className={`text-muted mb-0 ${styles.Description}`}>
                                            {user.email}
                                        </p>
                                        </OverlayTrigger>
                                    </Col>
                                </Row>

                                {/* Sección inferior con botones alineados a la derecha */}
                                <Row className="mt-0">
                                    <Col xs={12} className="d-flex justify-content-end gap-3">
                                        <Button size="sm" className={`me-1 mr-2 ${styles.Icons}`} onClick={(e) => handleDeleteUser(user.id, e)}>
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </Button>
                                        <Button size="sm" className={`me-1 mr-2 ${styles.Icons}`} onClick={(e) => handleEditUser(user, e)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/* Modal de confirmación para eliminar usuario */}
            <Modal show={isDeleteDialogOpen} onHide={() => setIsDeleteDialogOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el usuario.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteUser}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal para editar usuario */}
            {userToEdit && (
                <UserModal
                    show={isEditModalOpen}
                    onHide={() => {
                        setIsEditModalOpen(false);
                        setUserToEdit(null);
                    }}
                    onSave={handleSaveEditedUser}
                    initialData={userToEdit}
                />
            )}
        </>
    )
}

export default UserList
