import React, { useEffect, useState } from "react";

// Importamos nuestras rutas y encabezados
import {
  base_api_url,
  user_management,
  get_all_users,
  admin_path
} from "../utils/config/paths";
import { unlogin } from "../utils/config/config";

// Styles
import styles from "../styles/general.module.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Components
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Card from "../components/Card";
import { ActionButtons } from "../components/card/ActionButtons";

// Modals
import AddUserModal from "../components/modals/AddUserModal";

import img from "../assets/img/unknow.jpeg";

const Users = () => {

  const [searchTerm, setSearchTerm] =
    useState(""); /* Almacena el término de búsqueda y lo actualiza */
  const [selectedFilter, setSelectedFilter] =
    useState("Instructores"); /* Guarda la opción seleccionada y la actualiza */

  // Estado para la lista de usuarios
  const [users, setUsers] = useState([]);

  // Función para obtener usuarios de la API
  const fetchAllUsers = () => {
    // Construimos la URL usando base_api_url + user_management + el endpoint deseado
    fetch(base_api_url + admin_path + user_management + get_all_users, {
      method: "GET",
      headers: unlogin, // DESPUES CAMBIAR A HEADERS
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.result);
        setUsers(data.result);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
      });
  };

  // useEffect para hacer la petición al montar el componente
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDelete = () => {
    console.log("Elemento eliminado"); // Aquí puedes agregar la lógica de eliminación
  };

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

          {/* Cards */}

          {
            users.length === 0 ? (
              <h5>No hay registros</h5>
            ) : (
              users.map((user, index) => (
                <div className={`col-md-3 mb-3 ${styles.cards}`} key={index}>
                  <div className={styles.registerCard}>
                    <Card
                      // Puedes usar la propiedad user.profilePhotoPath si está disponible
                      image={user.profilePhotoPath ? user.profilePhotoPath : img}
                      title={user.name}
                      description={user.email}
                    />
                    <ActionButtons
                      showDelete={true}
                      showEdit={true}
                      showMoreOptions={true}
                    />
                  </div>
                </div>
              ))
            )
          }

        </div >
      </section >
      <AddUserModal />
      <Footer />
    </>
  );
};

export default Users;
