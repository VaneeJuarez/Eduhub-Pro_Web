import React from "react";

// Styles
import styles from "../../styles/actionButtons.module.css";

// Alerts
import { Delete } from "../../utils/config/config";

const DeleteButton = ({ onConfirm }) => (
  <button onClick={() => Delete(onConfirm)}>
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

const ActionButtons = ({ onDelete, onEdit, onMoreOptions }) => (
  <div className={`action-buttons ${styles.actions}`}>
    <DeleteButton onClick={onDelete} />
    <EditButton onClick={onEdit} />
    <MoreOptionsButton onClick={onMoreOptions} />
  </div>
);

export { DeleteButton, EditButton, MoreOptionsButton, ActionButtons };
