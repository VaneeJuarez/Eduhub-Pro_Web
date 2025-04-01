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

import { admin_path, base_api_url, account_management, change_status, course_management, update } from "../../utils/config/paths";
import { headers, sweetAlert } from "../../utils/config/config"

import bbva from "../../assets/img/banks/bbva.png";
import santander from "../../assets/img/banks/santander.png";
import banorte from "../../assets/img/banks/banorte.png";
import hsbc from "../../assets/img/banks/hsbc.png";
import bancoAzteca from "../../assets/img/banks/banco-azteca.png";
import citibanamex from "../../assets/img/banks/citi.png";

const bankLogos = {
  BBVA: bbva,
  Santander: santander,
  Banorte: banorte,
  HSBC: hsbc,
  "Banco Azteca": bancoAzteca,
  Citibanamex: citibanamex
};

function BankAccountList({ accountList, refreshAccounts }) {
    const [accounts, setAccounts] = useState(accountList);

    useEffect(() => {
        refreshAccounts();
        setAccounts(accountList);
    }, [accountList]);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [accountToEdit, setAccountToEdit] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ title: "", body: "", variant: "success" })

    const showToastMessage = (title, body, variant = "success") => {
        setToastMessage({ title, body, variant });
        setShowToast(true);
    };

    const formatAccountNumber = (number) => number;

    const handleEditAccount = (account, e) => {
        e.stopPropagation();

        setAccountToEdit(account);
        setIsEditModalOpen(true);
    }

    const handleDeleteAccount = (account, e) => {
        e.stopPropagation();
        setAccountToDelete(account);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteAccount = async () => {
        if (!accountToDelete) return;

        const result = await handleChangeStatusAccount(accountToDelete);

        if (result?.type !== "SUCCESS") {
            const message = result?.text || "Error al eliminar cuenta";
            showToastMessage("Error", message, "danger");
            setIsDeleteDialogOpen(false);
            setAccountToDelete(null);
            return;
        }

        setAccounts((prev) => prev.filter((a) => a.accountId !== accountToDelete.accountId));
        setIsDeleteDialogOpen(false);
        setAccountToDelete(null);
        showToastMessage("Cuenta eliminada", "La cuenta bancaria ha sido eliminada exitosamente", "danger");
    };

    const handleChangeStatusAccount = (account) => {
        return fetch(`${base_api_url}${admin_path}${account_management}${change_status}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
                accountId: account.accountId,
                status: "INACTIVE"
            })
        })
            .then((response) => response.json())
            .catch((error) => {
                console.log(error);
                return { type: "ERROR", text: "Error al eliminar la cuenta bancaria." };
            });
    };


    const handleSaveEditedAccount = (updatedAccount) => {
        const updatedAccounts = accounts.map((account) =>
            account.accountId === updatedAccount.accountId ? { ...updatedAccount, accountId: account.accountId } : account,
        );

        console.log(updatedAccount);

        editAccount(updatedAccount);

        setAccounts(updatedAccounts);
        setIsEditModalOpen(false);
        setAccountToEdit(null);

        showToastMessage("Cuenta actualizada", "La cuenta bancaria ha sido actualizada exitosamente")

    };

    const editAccount = async (account) => {
        await fetch(`${base_api_url}${admin_path}${account_management}${update}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({
                accountId: account.accountId,
                bankName: account.bankName,
                accountNumber: account.accountNumber,
                key: account.key
            }),
        }).then(response => response.json())
        .then((result) => {
            if (result.type !== 'SUCCESS') {
                if (typeof result === 'object' && !result.text) {
                  const errorMessages = Object.values(result).join("\n");
                  sweetAlert('error', 'Error', errorMessages, '');
                } else if (result.text) {
                  sweetAlert('error', 'Error', result.text, '');
                }
                return;
              }

              refreshAccounts();
              setIsEditModalOpen(false);
        }).catch((error) => {
            console.log(error);
            sweetAlert('error', "Error", "No pudimos editar la cuenta. Intentálo nuevamente.", "", null);
        });
    }
    
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
                                                src={bankLogos[account.bankName] || ""}
                                                alt={`Logo de ${account.bankName}`}
                                                className={styles.ImgBank}
                                            />

                                        </div>
                                    </Col>
                                    <Col style={{ minWidth: 0 }}>

                                        <h6 className={`mb-0 fw-bold ${styles.Title}`}>{account.bankname}</h6>

                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id={`tooltip-number-${account.id}`}>{account.accountNumber}</Tooltip>}
                                        >
                                            <p className={`text-muted mb-0 ${styles.Description}`}>
                                                <strong>No.Cuenta:</strong> {formatAccountNumber(account.accountNumber)}
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
                                        <Button size="sm" className={`me-1 mr-2 ${styles.Icons}`} onClick={(e) => handleDeleteAccount(account, e)}>
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