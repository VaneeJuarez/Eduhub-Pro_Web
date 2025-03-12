import React from "react";
import styles from "../../styles/actionbuttons.module.css";

const Button = ({ text, onClick }) => {
  return (
    <div className={`action-buttons ${styles.actions}`}>
      <button className={styles.voucher} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
