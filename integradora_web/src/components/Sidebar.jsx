import React, { useState } from "react";
import { useUserContext } from "../contexts/UserProvider";
import styles from "../styles/sidebar.module.css";
import { headers, sweetAlert } from "../utils/config/config";
import { auth_path, base_api_url, logout } from "../utils/config/paths";
import { USER_ACTIONS } from "../utils/config/enums";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Inicio", link: "#", icon: "bi bi-house" },
  { label: "Usuarios", link: "#", icon: "bi bi-person" },
  { label: "Cursos", link: "#", icon: "bi bi-book" },
  { label: "Finanzas", link: "#", icon: "bi bi-coin" },
  { label: "Cuentas bancarias", link: "#", icon: "bi bi-credit-card" },
  { label: "Analíticas", link: "#analytics", icon: "bi bi-bar-chart-line" },
];

const Sidebar = () => {
  const { dispatch } = useUserContext();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  const logoutRequest = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.jwt) {
      sweetAlert('error', 'Error', 'No se encontró información del usuario', '', null);
      return;
    }

    await fetch(base_api_url + auth_path + logout, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify(
        {
          userId: user.jwt
        }
      ),
      credentials: 'include'
    }).then(response => response.json())
      .then(response => {
        if (response.type !== 'SUCCESS') {
          if (typeof response === 'object' && !response.text) {
            const errorMessages = Object.values(response).join("\n");
            sweetAlert('error', 'Error', errorMessages, '', null);
          } else if (response.text) {
            sweetAlert('error', 'Error', response.text, '', null);
          }
          return;
        }

        dispatch({ type: USER_ACTIONS.LOGOUT });
        sweetAlert('success', 'Éxito', response.text, '/login', navigate);
      }).catch((error) => {
        console.log(error);
        sweetAlert('error', 'Error', 'Hubo un error al cerrar la sesión, por favor revisa tu conexión a internet o inténtalo más tarde', '', null);
      });
  };

  return (
    <>
      <div className={styles.menuIcon} onClick={toggleSidebar}>
        ☰
      </div>

      <div className={`${styles.sidebar} ${isActive ? styles.active : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <span className={styles.brandName}>Menú</span>
          </div>
          <button className={styles.closeBtn} onClick={toggleSidebar}>
            ✖
          </button>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.sidebarMenu}>
            {menuItems.map((item, index) => (
              <a key={index} href={item.link} className={styles.sidebarMenuItem}>
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.userProfile}>
            <a href="" onClick={async (e) => { e.preventDefault(); await logoutRequest(); }} className={styles.sidebarLogout}>
              <i className="bi bi-box-arrow-right"></i>
              <span>Cerrar sesión</span>
            </a>
          </div>
        </div>
      </div>

      <div
        className={`${styles.overlay} ${isActive ? styles.active : ""}`}
        onClick={toggleSidebar}
      ></div>
    </>
  );
};

export default Sidebar;
