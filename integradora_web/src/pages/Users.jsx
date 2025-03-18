import React, { useState } from "react";

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
import EditUserModal from "../components/modals/EditUserModal";

const Users = () => {
  const userInfo = [
    {
      image: img,
      title: "Bryan Saldaña Villamil",
      description: "bryansaldana@gmail.com",
      password: "12345",
      role: "Instructor",
    },
    {
      image: img,
      title: "Vanessa Juárez",
      description: "vanessajuarez@email.com",
      password: "45678",
      role: "Estudiante",
    },
  ];

  const [searchTerm, setSearchTerm] = useState(""); /* Almacena el término de búsqueda y lo actualiza */
  const [selectedFilter, setSelectedFilter] = useState("Instructores"); /* Guarda la opción seleccionada y la actualiza */
  const [selectedUser, setSelectedUser] = useState(null);

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

        <div className="row mt-4 m-5">
          {/* <h5>No hay registros </h5> */
          /* Hcaer la lógica para mostrar cuando no hayan registros */}

          {/* Cards */}
          {userInfo.map((user, index) => (
            <div key={index} className={`col-md-3 mb-3 ${styles.cards}`}>
            <div className={styles.registerCard}>
              <Card
                image={user.image}
                title={user.title}
                description={user.description}
              />
              <ActionButtons
                showDelete={true}
                showEdit={true}
                showMoreOptions={false}
                onDelete={handleDelete} /* Alerta */
                onEdit = {() => setSelectedUser(user)}
                modalId="editUserModal"
              />
            </div>
          </div>
          ))}
          
        </div>
      </section>
      <AddUserModal />      
      <EditUserModal modalId="editUserModal" user={selectedUser}/>
      <Footer />
    </>
  );
};

export default Users;
