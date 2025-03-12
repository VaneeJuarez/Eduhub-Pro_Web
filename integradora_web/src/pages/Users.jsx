import React, { useState } from "react";

// Styles
import styles from "../styles/general.module.css";

import "@fortawesome/fontawesome-free/css/all.min.css";

// Components
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { ActionButtons } from "../components/card/ActionButtons";

import img from "../assets/img/unknow.jpeg";

const Users = () => {
  const userInfo = {
    image: img,
    title: "Bryan Saldaña Villamil",
    description: "bryansaldana@gmail.com",
    price: "$150.00",
  };

  const [searchTerm, setSearchTerm] =
    useState(""); /* Almacena el término de búsqueda y lo actualiza */
  const [selectedFilter, setSelectedFilter] =
    useState("Instructores"); /* Guarda la opción seleccionada y la actualiza */

  return (
    <>
      <Sidebar />
      <Header userName={"Vanessa Juárez"} />
      <section className={styles.content}>
        <ControlPanel
          showAddButton={true} /* Muestra el botón de agregar */
          showSearch={true} /* Muestra la barra de búsqueda */
          showToggle={true} /* Muestra los botones de alternancia */
          searchTerm={
            searchTerm
          } /* Pasa el estado searchTerm a ControlPanel para sincronizar la búsqueda */
          setSearchTerm={setSearchTerm}
          selectedFilter={
            selectedFilter
          } /* Indica que opción del filtro está activa */
          setSelectedFilter={setSelectedFilter}
          toggleOptions={[
            "Instructores",
            "Estudiantes",
          ]} /* Define los nombres de los botones de alternancia */
        />

        <div class="row mt-4 m-5">
          {/* <h5>No hay registros </h5> */
          /* Hcaer la lógica para mostrar cuando no hayan registros */}

          {/* Cards */}
          <div className={`col-md-3 mb-3 ${styles.cards}`}>
            <div className={styles.registerCard}>
              <Card
                image={userInfo.image}
                title={userInfo.title}
                description={userInfo.description}
              />
              <ActionButtons
                showDelete={true}
                showEdit={true}
                showMoreOptions={true}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Users;
