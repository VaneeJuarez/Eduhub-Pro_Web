import React, { useState } from "react";
import styles from "../styles/sidebar.module.css";

const menuItems = [
    { label: "Inicio", link: "#", icon: "bi bi-house" },
    { label: "Usuarios", link: "#", icon: "bi bi-person" },
    { label: "Cursos", link: "#", icon: "bi bi-book" },
    { label: "Finanzas", link: "#", icon: "bi bi-coin" },
    { label: "Cuentas bancarias", link: "#", icon: "bi bi-credit-card" },
    { label: "Analíticas", link: "#analytics", icon: "bi bi-bar-chart-line" },
];

const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);
  
  const toggleSidebar = () => {
    setIsActive(!isActive);
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
            <a href="#" className={styles.sidebarLogout}>
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
