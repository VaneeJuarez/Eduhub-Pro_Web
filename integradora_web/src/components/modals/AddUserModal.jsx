import React, { useState } from "react";
import styles from '../../styles/modal.module.css';
import { admin_path, base_api_url, create_user, user_management } from "../../utils/config/paths";
import { headers, sweetAlert } from "../../utils/config/config";


const AddUserModal = ({ fetchAllUsers }) => {

  /*    
 useEffect(() => {
        console.log("El modal de agregar usuario se ha abierto")
    }, []);
    */
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  // Función para manejar la creación de usuario
  const handleSaveUser = () => {
    fetch(base_api_url + admin_path + user_management + create_user, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        name,
        email,
        password,
        role: role
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

        sweetAlert('success', 'Éxito', result.text, '', null);

        fetchAllUsers();

        setName("");
        setEmail("");
        setPassword("");
        setRole("");
      }).catch((error) => {
        console.log(error);
        sweetAlert('error', "Error", "No pudimos crear el usuario. Inténtalo nuevamente.", "", null);
      });
  };

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
            <form className={styles.formModal}>
              <div className="mb-3">
                <label className={`form-label ${styles.formLabel}`}>Nombre Completo</label>
                <input
                  type="text"
                  className={styles.formControl}
                  placeholder="Ej: Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className={`form-label ${styles.formLabel}`}>Correo Electrónico</label>
                <input
                  type="email"
                  className={styles.formControl}
                  placeholder="Ej: usuario@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className={`form-label ${styles.formLabel}`}>Contraseña</label>
                <input
                  type="password"
                  className={styles.formControl}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={`mb-3 ${styles.formGroup}`}>
                <label className={`form-label ${styles.formLabel}`}>Rol</label>
                <select
                  className={styles.formSelect}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option disabled value="">Selecciona un rol</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="STUDENT">Estudiante</option>
                </select>
              </div>
            </form>
          </div>
          <div className={`modal-footer ${styles.modalFooter}`}>
            <button type="button" className={`btn btn-secondary ${styles.btnSecondary}`} data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" className={`btn btn-primary ${styles.btnPrimary}`} onClick={handleSaveUser} >
              Guardar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
