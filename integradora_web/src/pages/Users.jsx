import React, { useState } from "react";

// Styles
import styles from "../styles/general.module.css";

// Components
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserList from "../components/UserList";

// Modals
import UserModal from "../components/modals/UserModal";

import defaultProfile from "../assets/img/unknow.jpeg";

const Users = () => {

  const [searchTerm, setSearchTerm] = useState(""); /* Almacena el término de búsqueda y lo actualiza */
  const [selectedFilter, setSelectedFilter] = useState("Instructores"); /* Guarda la opción seleccionada y la actualiza */
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveUser = (user) => {
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    // Aquí guardaríamos el usuario en la base de datos y obtendríamos un id
    const newUserId = existingUsers.length > 0
  ? Math.max(...existingUsers.map((u) => u.id)) + 1
  : 1;

    // Simulamos guardar el usuario en el localStorage para mantener los datos
    const newUser = {
      ... user,
      id: newUserId,
      profilePicture: user.profile || defaultProfile,
      status: "Activo" // Estado inicial
    }

    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]))

    // Cerramos el modal
    setIsModalOpen(false);

    // Forzar actualización
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <>
      <Sidebar />
      <Header userName={"Vanessa Juárez"} />
      <section className={styles.content}>
        <ControlPanel
          showAddButton={true} /* Muestra el botón de agregar */
          onAddClick={() => setIsModalOpen(true)}
          modalId="addUserModal" // Pasar el id del modal
          showSearch={true} /* Muestra la barra de búsqueda */
          showToggle={true} /* Muestra los botones de alternancia */
          searchTerm={searchTerm} /* Pasa el estado searchTerm a ControlPanel para sincronizar la búsqueda */
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter} /* Indica que opción del filtro está activa */
          setSelectedFilter={setSelectedFilter}
          toggleOptions={[
            "Instructores",
            "Estudiantes",
          ]} /* Define los nombres de los botones de alternancia */
        />

        <UserList />
        <UserModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onSave={handleSaveUser}/>  
      </section>
      <Footer />
    </>
  );
};

export default Users;
