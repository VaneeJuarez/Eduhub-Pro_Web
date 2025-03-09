import React from "react";
import styles from "../styles/footer.module.css";

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <p className={styles.copyright}>
              Copyright &copy; 2025 EduHub Pro
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
