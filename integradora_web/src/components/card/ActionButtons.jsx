import React from "react";
import styles from "../../styles/actionButtons.module.css";

const DeleteButton = ({ onClick }) => (
  <button onClick={onClick}>
    <i className="fas fa-trash-alt"></i>
  </button>
);

const EditButton = ({ onClick }) => (
  <button onClick={onClick}>
    <i className="fas fa-edit"></i>
  </button>
);

const MoreOptionsButton = ({ onClick }) => (
  <button onClick={onClick}>
    <i className="fas fa-ellipsis-h"></i>
  </button>
);

const VoucherButton = ({ text, onClick }) => (
  <button onClick={onClick}>
    {text}
  </button>
);

const ActionButtons = ({ onDelete, onEdit, onMoreOptions, onVoucherClick, voucherText }) => (
  <div className={`action-buttons ${styles.actions}`}>
    <DeleteButton onClick={onDelete} />
    <EditButton onClick={onEdit} />
    <MoreOptionsButton onClick={onMoreOptions} />
  </div>
);

export { DeleteButton, EditButton, MoreOptionsButton, VoucherButton, ActionButtons };
