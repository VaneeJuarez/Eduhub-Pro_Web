"use client";

import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Card, Col, Modal, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import defaultProfile from "../assets/img/unknow.jpeg";

// Styles
import styles from "../styles/card.module.css";

// Modals 
import UserModal from "./modals/UserModal";
import { admin_path, base_api_url, change_status_instructor, change_status_student, user_management } from "../utils/config/paths";
import { headers, sweetAlert } from "../utils/config/config";

function UserList({ userList }) {
    const [users, setUsers] = useState(userList);

    useEffect(() => {
        setUsers(userList);
    }, [userList]);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null)
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: "", body: "", variant: "success" })

    const showToastMessage = (title, body, variant = "success") => {
        setToastMessage({ title, body, variant });
        setShowToast(true);
    };

    const handleEditUser = (user, e) => {
        e.stopPropagation();

        setUserToEdit(user);
        setIsEditModalOpen(true);
    }

    const handleDeleteUser = (user, e) => {
        e.stopPropagation();
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };


    const confirmDeleteUser = () => {
        if (!userToDelete) return;

        const handler = userToDelete.role === "INSTRUCTOR"
            ? handleChangeStatusInstructor
            : handleChangeStatusStudent;

        // PASAR objeto completo, no solo ID
        handler(userToDelete).then((result) => {
            if (result?.type !== "SUCCESS") {
                const message = result?.text || "Error al eliminar el usuario.";
                showToastMessage("Error", message, "danger");
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
                return;
            }

            setUsers((prev) => prev.filter((u) => u.userId !== userToDelete.userId));
            setIsDeleteDialogOpen(false);
            setUserToDelete(null);
            showToastMessage("Usuario eliminado", "El usuario ha sido eliminado exitosamente", "danger");
        });
    };


    // FUNCIÓN DE ELIMINACIÓN
    // 2. Cambiar estado (PUT) para Instructores
    const handleChangeStatusInstructor = (user) => {
        return fetch(`${base_api_url}${admin_path}${user_management}${change_status_instructor}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
                userId: user.userId, // ⬅️ importante: debe ser user.userId, no el objeto completo
                status: "INACTIVE"
            })
        })
            .then((response) => response.json())
            .catch((error) => {
                console.log(error);
                showToastMessage("Error", "No pudimos eliminar el instructor. Inténtalo nuevamente.", "danger");
                return { type: "ERROR" }; // ⬅️ asegura que siempre retorne algo
            });
    };


    // 3. Cambiar estado (PUT) para Estudiantes
    const handleChangeStatusStudent = (user) => {
        return fetch(`${base_api_url}${admin_path}${user_management}${change_status_student}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
                userId: user.userId,
                status: "INACTIVE"
            })
        })
            .then((response) => response.json())
            .catch((error) => {
                console.log(error);
                return { type: "ERROR", text: "Error al eliminar el estudiante." };
            });
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
                {users.map((user, id) => (
                    <Col md={3} key={id} className="mb-3">
                        <Card className={styles.Card}>
                            <Card.Body className="p-1">
                                {/* Sección superior con imagen, nombre y correo */}
                                <Row className="align-items-center mb-0">
                                    <Col xs="auto">
                                        <div>
                                            <img
                                                src={user.profilePhotoPath || defaultProfile}
                                                alt="User"
                                                className={styles.Img}
                                            />
                                        </div>
                                    </Col>
                                    <Col style={{ minWidth: 0 }}>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id={`tooltip-name-${user.userId}`}>{user.name}</Tooltip>}
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
                                        <Button size="sm" className={`me-1 mr-2 ${styles.Icons}`} onClick={(e) => handleDeleteUser(user, e)}>
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
