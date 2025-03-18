import React, { useEffect } from "react";
import styles from "../../styles/modal.module.css";
import CheckboxMultiSelect from "../courses/CheckboxMultiSelect";

const AddCourseModal = () => {
  useEffect(() => {
    console.log("El modal de agregar curso se ha abierto");
  }, []);

  return (
    <div
      className={`modal fade ${styles.modalBackdrop}`}
      id="addCourseModal"
      tabIndex="-1"
      aria-labelledby="addCourseModalLabel"
      aria-hidden="true"
    >
      <div className={`modal-dialog ${styles.modalDialog}`}>
        <div className={`modal-content ${styles.modalContent}`}>
          <div className={`modal-header ${styles.modalHeaer}`}>
            <h5
              className={`modal-title ${styles.modalTitle}`}
              id="addCourseModalLabel"
            >
              Agregar Curso
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
                <label className={`form-label ${styles.formLabel}`}>
                  Nombre del curso
                </label>
                <input
                  type="text"
                  className={styles.formControl}
                  placeholder="Nombre del Curso"
                />
              </div>

              <div className="mb-3">
                <label className={`form-label ${styles.formLabel}`}>
                  Descripción del curso
                </label>
                <textarea
                  className={styles.formControl}
                  rows="2"
                  maxLength="200"
                ></textarea>
              </div>

              <div className="mb-3 row g-3">
                <div className="col">
                  <label className={`form-label ${styles.formLabel}`}>
                    Fecha de inicio
                  </label>
                  <input type="date" className={`${styles.formControl} me-3`} />
                </div>

                <div className="col">
                  <label className={`form-label ${styles.formLabel}`}>
                    Fecha de fin
                  </label>
                  <input type="date" className={styles.formControl} />
                </div>
              </div>

              <div className="mb-3 row g-3">
                <div className="col">
                  <label className={`form-label ${styles.formLabel}`}>
                    Precio del curso
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="text"
                      className="form-control"
                      aria-label="Amount (to the nearest dollar)"
                    />
                    <span className="input-group-text">.00</span>
                  </div>
                </div>

                <div className="col">
                  <label className={`form-label ${styles.formLabel}`}>
                    Límite de estudiantes
                  </label>
                  <input type="number" className={styles.formControl} />
                </div>
              </div>

              <CheckboxMultiSelect />

              <div class="mb-3">
                <label for="formFile" class="form-label">
                  Subir portada del curso
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  accept="image/png, image/jpeg, image/jpg"
                />
              </div>
            </form>
          </div>
          <div className={`modal-footer ${styles.modalFooter}`}>
            <button
              type="button"
              className={`btn btn-secondary ${styles.btnSecondary}`}
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className={`btn btn-primary ${styles.btnPrimary}`}
            >
              Guardar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourseModal;
