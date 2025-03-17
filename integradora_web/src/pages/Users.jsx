import React, { useEffect, useState } from "react";

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

// Importamos nuestras rutas y encabezados
import {
  base_api_url,
  user_management,
  get_all_users,
  admin_path,
  change_status_student,
  change_status_instructor
}
  from "../utils/config/paths";

import { headers, sweetAlert } from "../utils/config/config";
import { useUserContext } from "../contexts/UserProvider";

const Users = () => {

  const { user } = useUserContext();

  const [searchTerm, setSearchTerm] = useState(""); /* Almacena el término de búsqueda y lo actualiza */
  const [selectedFilter, setSelectedFilter] = useState("Instructores"); /* Guarda la opción seleccionada y la actualiza */

  // Estado para la lista de usuario
  const [users, setUsers] = useState([]);

  // Función para obtener usuarios de la API
  const fetchAllUsers = () => {
    // Construimos la URL usando base_api_url + user_management + el endpoint deseado
    fetch(base_api_url + admin_path + user_management + get_all_users, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.result);
      })
      .catch((error) => {
        console.log(error);
        sweetAlert('error', "Error", "No pudimos cargar la lista de usuarios. Inténtalo nuevamente.", "", null);
      });
  };

  // useEffect para hacer la petición al montar el componente
  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Filtrado en base a selectedFilter y searchTerm
  const filteredUsers = users.filter((user) => {
    // Filtro por rol
    if (selectedFilter === "Instructores") {
      return user.role === "INSTRUCTOR";
    } else if (selectedFilter === "Estudiantes") {
      return user.role === "STUDENT";
    }
    // Si hubiese más opciones, podrías agregar aquí
    return true;
  }).filter((user) => {
    // Filtro por searchTerm en nombre o email (case-insensitive)
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(lowerSearch) ||
      user.email.toLowerCase().includes(lowerSearch)
    );
  });

  // FUNCIÓN DE ELIMINACIÓN
  // 2. Cambiar estado (PUT) para Instructores
  const handleChangeStatusInstructor = (user) => {
    fetch(base_api_url + admin_path + user_management + change_status_instructor, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        userId: user.userId,
        status: "INACTIVE"
      })
    }).then((response) => response.json())
      .then((result) => {

        if (!result.ok) {
          if (typeof result === 'object' && !result.text) {
            const errorMessages = Object.values(result).join("\n");
            sweetAlert('error', 'Error', errorMessages, '');
          } else if (result.text) {
            sweetAlert('error', 'Error', result.text, '');
          }
          return;
        }
        // sweetAlert("success", "Éxito", result.text, "");
        fetchAllUsers();
      })
      .catch((error) => {
        console.log(error);
        sweetAlert('error', "Error", "No pudimos eliminar el instructor. Inténtalo nuevamente.", "", null);
      });
  };

  // 3. Cambiar estado (PUT) para Estudiantes
  const handleChangeStatusStudent = (user) => {
    fetch(base_api_url + admin_path + user_management + change_status_student, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        userId: user.userId,
        status: "INACTIVE"
      })
    })
      .then((response) => response.json())
      .then((result) => {

        if (!result.ok) {
          if (typeof result === 'object' && !result.text) {
            const errorMessages = Object.values(result).join("\n");
            sweetAlert('error', 'Error', errorMessages, '');
          } else if (result.text) {
            sweetAlert('error', 'Error', result.text, '');
          }
          return;
        }
        //  sweetAlert("success", "Éxito", result.text, "", null);
        fetchAllUsers();
      })
      .catch((error) => {
        console.log(error);
        sweetAlert('error', "Error", "No pudimos eliminar el estudiante. Inténtalo nuevamente", "", null);
      });
  };

  // FUNCIÓN DE EDICIÓN
  const handleEdit = (userId) => {
    console.log("Editar usuario con ID:", userId);
    // Lógica de edición (por ejemplo, abrir un modal o redirigir a un formulario)
  };

  // FUNCIÓN DE MÁS OPCIONES
  const handleMoreOptions = (userId) => {
    console.log("Más opciones para usuario con ID:", userId);
    // Aquí podrías mostrar un menú desplegable, un modal adicional, etc.
  };

  return (
    <>
      <Sidebar />
      <Header userName={user?.name} />
      <section className={styles.content}>
        <ControlPanel
          showAddButton={true} /* Muestra el botón de agregar */
          showSearch={true} /* Muestra la barra de búsqueda */
          showToggle={true} /* Muestra los botones de alternancia */
          searchTerm={searchTerm} /* Pasa el estado searchTerm a ControlPanel para sincronizar la búsqueda */
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter} /* Indica que opción del filtro está activa */
          setSelectedFilter={setSelectedFilter}
          toggleOptions={["Instructores", "Estudiantes",]} /* Define los nombres de los botones de alternancia */
        />

        <div class="row mt-4 m-5">

          {/* Cards */}

          {
            filteredUsers.length === 0 ? (
              <h5>No hay registros</h5>
            ) : (
              filteredUsers.map((user, index) => (
                <div className={`col-md-3 mb-3 ${styles.cards}`} key={index}>
                  <div className={styles.registerCard}>
                    <Card
                      // Puedes usar la propiedad user.profilePhotoPath si está disponible
                      image={user.profilePhotoPath ? user.profilePhotoPath : img}
                      title={user.name}
                      description={user.email}
                    />
                    <ActionButtons
                      onDelete={() => user.role === 'INSTRUCTOR' ? handleChangeStatusInstructor(user) : handleChangeStatusStudent(user)}
                      onEdit={() => handleEdit(user.userId)}
                      onMoreOptions={() => handleMoreOptions(user.userId)}
                    />
                  </div>
                </div>
              ))
            )

          }

        </div >
      </section >
      <AddUserModal fetchAllUsers={fetchAllUsers} />
      <Footer />
    </>
  );
};

export default Users;
