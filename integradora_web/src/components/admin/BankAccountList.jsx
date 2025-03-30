"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

// Styles 
import styles from "../../styles/card.module.css"

// Modals
import BankAccountModal from "../modals/BankAccountModal";

import { admin_path, base_api_url, account_management, change_status } from "../utils/config/paths";
import { headers, sweetAlert } from "../utils/config/config"

function BankAccountList({ accountList }) {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        setAccounts(accountList);
    }, [accountList]);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [accountToEdit, setAccountToEdit] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: "", body: "", variant: "success" })
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar cuentas desde localStorage
        const storedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]")
        setAccounts(storedAccounts);

        const handleStorageChange = () => {
            const updatedAccounts = JSON.parse(localStorage.getItem("accounts") || "[]")
            setAccounts(updatedAccounts)
        }

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const showToastMessage = (title, body, variant = "success") => {
        setToastMessage({ title, body, variant });
        setShowToast(true);
    };

    const formatAccountNumber = (number) => {
        return number.replace(/\s+/g, "") // eliminar espacios existentes
        .replace(/(.{4})/g, "$1 ")     // cada 4 dígitos agrega espacio
        .trim();                       // quitar espacio final
    }

    const handleEditAccount = (account, e) => {
        e.stopPropagation();

        setAccountToEdit(account);
        setIsEditModalOpen(true);
    }

    const handleDeleteAccount = (accountId, e) => {
        e.stopPropagation();

        const accountToDelete = accounts.find((account) => account.id === accountId);

        setAccountToDelete(accountId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteAccount = () => {
        if (accountToDelete) {
            const updatedAccounts = accounts.filter((account) => account.id !== accountToDelete)
            localStorage.setItem("accounts", JSON.stringify(updatedAccounts))
            setAccounts(updatedAccounts)
            setIsDeleteDialogOpen(false)
            setAccountToDelete(null)

            showToastMessage("Cuenta eliminada", "La cuenta bancaria ha sido eliminada con éxito", "danger")

            window.dispatchEvent(new Event("storage"))
        }
    }

    const handleSaveEditedAccount = (updatedAccount) => {
        const updatedAccounts = accounts.map((account) =>
            account.id === updatedAccount.id ? { ...updatedAccount, id: account.id } : account,
        )

        localStorage.setItem("accounts", JSON.stringify(updatedAccounts));
        setAccounts(updatedAccounts);
        setIsEditModalOpen(false);
        setAccountToEdit(null);

        showToastMessage("Cuenta actualizada", "La cuenta bancaria ha sido actualizada exitosamente")

        window.dispatchEvent(new Event("storage"));
    };

    if (accounts.length === 0) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">
                    No hay cuentas bancarias registradas
                </p>
            </div>
        )
    }

    return (
        <>
            <Row className="mt-4 m-5">
                {accounts.map((account) => (
                    <Col md={4} key={account.id} className="mb-3">
                        <Card className={styles.Card}>
                            <Card.Body className="p-1">
                                <Row className="align-items-center mb-0">
                                    <Col xs="auto">
                                        <div>
                                            <img
                                                src={account.logo}
                                                alt={`Logo de ${account.name}`}
                                                className={styles.ImgBank}
                                            />
                                        </div>
                                    </Col>
                                    <Col style={{ minWidth: 0 }}>

                                        <h6 className={`mb-0 fw-bold ${styles.Title}`}>{account.name}</h6>

                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id={`tooltip-number-${account.id}`}>{account.number}</Tooltip>}
                                        >
                                            <p className={`text-muted mb-0 ${styles.Description}`}>
                                               <strong>No.Cuenta:</strong> {formatAccountNumber(account.number)}
                                            </p>
                                        </OverlayTrigger>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id={`tooltip-key-${account.id}`}>{account.key}</Tooltip>}
                                        >
                                            <p className={`text-muted mb-0 ${styles.Description}`}>
                                                <strong>CLABE:</strong> {account.key}
                                            </p>
                                        </OverlayTrigger>
                                    </Col>
                                </Row>
                                <Row className="mt-0">
                                    <Col xs={12} className="d-flex justify-content-end gap-3">
                                        <Button size="sm" className={`me-1 mr-2 ${styles.Icons}`} onClick={(e) => handleDeleteAccount(account.id, e)}>
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </Button>
                                        <Button size="sm" className={`me-1 mr-2 ${styles.Icons}`} onClick={(e) => handleEditAccount(account, e)}>
                                            <FontAwesomeIcon icon={faPenToSquare} />
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/* Modal de confirmación para eliminar una cuenta */}
            <Modal show={isDeleteDialogOpen} onHide={() => setIsDeleteDialogOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>¿Estás seguro?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta bancaria.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteAccount}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
                        {/* Modal para editar una cuenta */}
                        {accountToEdit && (
                <BankAccountModal
                    show={isEditModalOpen}
                    onHide={() => {
                        setIsEditModalOpen(false);
                        setAccountToEdit(null);
                    }}
                    onSave={handleSaveEditedAccount}
                    initialData={accountToEdit}
                />
            )}
        </>
    )
}

export default BankAccountList