import React from "react";
import { useNavigate } from "react-router-dom"

// Styles
import styles from "../styles/menu.module.css";

// Images
import img1 from "../assets/img/perfil.png";
import img2 from "../assets/img/libro.png";
import img3 from "../assets/img/credito.png";
import img4 from "../assets/img/tarjeta-de-credito.png";

const Menu = () => {
  const navigate = useNavigate(); // Hook para navegación

  const menuItems = [
    { img: img1, title: "Usuarios", route: "/admin/users" },
    { img: img2, title: "Cursos" },
    { img: img3, title: "Finanzas" },
    { img: img4, title: "Cuentas bancarias" },
  ];

  return (
    <section className={`${styles.mini}`}>
      <div className={`${styles.miniContent}`}>
        <div className="container">
          <div className="row">
            <div className="offset-lg-3 col-lg-6">
              <div className={`${styles.info}`}>
                <h1>Menú</h1>
              </div>
            </div>
          </div>
          <div className="row g-2">
            {menuItems.map((item, index) => (
              <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-6">
                <a href="#" className={`${styles.miniBox}`}>
                  <i>
                    <img src={item.img} style={{ height: "60px", width: "60px" }} alt="" />
                  </i>
                  <strong>{item.title}</strong>
                  <button 
                  type="button" 
                  className={styles.btnOutlineSecondary}
                  onClick={() => navigate(item.route)}
                  >Gestionar</button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
