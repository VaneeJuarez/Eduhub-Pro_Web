import React, { useEffect, useState } from "react";
import styles from "../../styles/modal.module.css";

const EditUserModal = ({ modalId, user }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  // Cuando el usuario cambia, actualizamos el estado
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.title || "",
        email: user.description || "",
        password: user.password || "",
        role: user.role || "Instructor",
      });
    }
  }, [user]);

  return (
    <div
          className={`modal fade ${styles.modalBackdrop}`}
          id={modalId}
          tabIndex="-1"
          aria-labelledby={`${modalId}Label`}
          aria-hidden="true"
        >
          <div className={`modal-dialog ${styles.modalDialog}`}>
            <div className={`modal-content ${styles.modalContent}`}>
              <div className={`modal-header ${styles.modalHeader}`}>
                <h5 className={`modal-title ${styles.modalTitle}`} id={`${modalId}Label`}>
                  Editar Usuario
                </h5>
                <button
                  type="button"
                  className={`btn-close ${styles.btnClose}`}
                  data-bs-dismiss="modal"
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className={styles.modalBody}>
                <form className={styles.formModal}>
                  <div className="mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Nombre Completo</label>
                    <input 
                    type="text" 
                    className={styles.formControl} 
                    placeholder="Ej: Juan Pérez" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Correo Electrónico</label>
                    <input 
                    type="email" 
                    className={styles.formControl} 
                    placeholder="Ej: usuario@email.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className={`form-label ${styles.formLabel}`}>Contraseña</label>
                    <input 
                    type="password" 
                    className={styles.formControl} 
                    placeholder="********"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value})}
                    />
                  </div>
                  <div className={`mb-3 ${styles.formGroup}`}>
                    <label className={`form-label ${styles.formLabel}`}>Rol</label>
                    <select 
                    className={styles.formSelect}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
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

export default EditUserModal;
