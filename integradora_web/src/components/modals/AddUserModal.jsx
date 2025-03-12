import React, { useEffect } from "react";
import styles from '../../styles/modal.module.css';


const AddUserModal = () => {
    useEffect(() => {
        console.log("El modal de agregar usuario se ha abierto")
    }, []);
    
  return (
    <div
      className={`modal fade ${styles.modalBackdrop}`}
      id="addUserModal"
      tabIndex="-1"
      aria-labelledby="addUserModalLabel"
      aria-hidden="true"
    >
      <div className={`modal-dialog ${styles.modalDialog}`}>
        <div className={`modal-content ${styles.modalContent}`}>
          <div className={`modal-header ${styles.modalHeaer}`}>
            <h5 className={`modal-title ${styles.modalTitle}`} id="addUserModalLabel">
              Agregar Usuario
            </h5>
            <button
              type="button"
              className={`btn-close ${styles.btnClose}`}
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className={styles.modalBody}>
            <form>
              <div className="mb-3">
                <label className={`form-label ${styles.formLabel}`}>Nombre Completo</label>
                <input type="text" className={styles.formControl} placeholder="Ej: Juan Pérez" />
              </div>
              <div className="mb-3">
                <label className={`form-label ${styles.formLabel}`}>Correo Electrónico</label>
                <input type="email" className={styles.formControl} placeholder="Ej: usuario@email.com" />
              </div>
              <div className="mb-3">
                <label className={`form-label ${styles.formLabel}`}>Contraseña</label>
                <input type="password" className={styles.formControl} placeholder="********" />
              </div>
              <div className={`mb-3 ${styles.formGroup}`}>
                <label className={`form-label ${styles.formLabel}`}>Rol</label>
                <select className={styles.formSelect}>
                  <option value="Instructor">Instructor</option>
                  <option value="Estudiante">Estudiante</option>
                </select>
              </div>
            </form>
          </div>
          <div className={`modal-footer ${styles.modalFooter}`}>
            <button type="button" className={`btn btn-secondary ${styles.btnSecondary}`} data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" className={`btn btn-primary ${styles.btnPrimary}`}>
              Guardar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
