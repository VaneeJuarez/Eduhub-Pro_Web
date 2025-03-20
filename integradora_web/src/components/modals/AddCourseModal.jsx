import React, { useEffect, useState } from "react";
import styles from "../../styles/modal.module.css";
import CheckboxMultiSelect from "../courses/CheckboxMultiSelect";
import { useNavigate } from "react-router-dom";
import * as bootstrap from "bootstrap";


const AddCourseModal = ({ onAdd }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [instructor, setInstructor] = useState("Derick Axel Lagunes")
  const [price, setPrice] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [tags, setTags] = useState([])
  const [studentLimit, setStudentLimit] = useState("")
  const [image, setImage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title || !description || !instructor || !price) {
      alert("Please fill all required fields")
      return
    }

    const newCourse = {
      title,
      description,
      instructor,
      price: Number.parseFloat(price),
      startDate,
      endDate,
      tags,
      studentLimit,
      image,
    }

    onAdd(newCourse)
  }

  useEffect(() => {
    console.log("El modal de agregar curso se ha abierto");
  }, []);

  const navigate = useNavigate(); // 🔹 Hook para redirigir

  const handleSaveCourse = () => {
    // 1️⃣ Obtener el modal por su ID
    const modal = document.getElementById("addCourseModal");
  
    // 2️⃣ Cerrar el modal usando Bootstrap API
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    }
  
    // 3️⃣ 🔹 Remover cualquier fondo del modal (Bootstrap deja `.modal-backdrop`)
    setTimeout(() => {
      document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.remove());
      document.body.classList.remove("modal-open"); // Elimina la clase que evita el scroll
      document.body.style = ""; // Restablece los estilos del body
  
      // 4️⃣ Redirigir después de limpiar todo
      navigate("/inst/create-course");
    }, 300); // Delay para evitar errores visuales
  };

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
            <form className={styles.formModal} onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className={`form-label ${styles.formLabel}`}>
                  Nombre del curso
                </label>
                <input
                  type="text"
                  className={styles.formControl}
                  placeholder="Nombre del Curso"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  id="title"
                  required
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

              <div className="mb-3">
                <label className="form-label">
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
              className={`btn btn-primary ${styles.btnPrimary}`} onClick={handleSaveCourse}
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
