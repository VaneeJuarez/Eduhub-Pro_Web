import React, { useEffect, useState } from "react";

// Styles
import styles from "../../styles/general.module.css";

// Components
import ControlPanel from "../../components/ControlPanel";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Sidebar from "../../components/admin/Sidebar";
import UserList from "../../components/admin/UserList";

// Modals
import UserModal from "../../components/modals/UserModal";

import { useUserContext } from "../../contexts/UserProvider";
import { headers, sweetAlert } from "../../utils/config/config";
import { admin_path, all, base_api_url, create, user_management } from "../../utils/config/paths";

const Users = () => {

  const { user } = useUserContext();
  const [userList, setUserList] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); /* Almacena el término de búsqueda y lo actualiza */
  const [selectedFilter, setSelectedFilter] = useState(null); /* Guarda la opción seleccionada y la actualiza */
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterClick = (option) => {
    if (selectedFilter === option) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(option);
    }
  };

  const filteredUsers = userList.length > 0 ? userList.filter((user) => {
    // Filtro por rol
    if (selectedFilter === "Instructores") {
      return user.role === "INSTRUCTOR";
    } else if (selectedFilter === "Estudiantes") {
      return user.role === "STUDENT";
    }
    return true;
  }).filter((user) => {
    // Filtro por término de búsqueda en nombre o email
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(lowerSearch) || 
      user.email.toLowerCase().includes(lowerSearch)
    );
  }) : [];

  const [response, setResponse] = useState(false);

  const handleSaveUser = async (user) => {
    // Función para manejar la creación de usuario
    await fetch(`${base_api_url}${admin_path}${user_management}${create}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
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

        // Show success message with SweetAlert
        sweetAlert('success', 'Éxito', 'Usuario creado exitosamente', '', null);

        setResponse(true);
        fetchAllUsers();
        setIsModalOpen(false);  // <--- cerrar el modal directo aquí

        /*   setName("");
          setEmail("");
          setPassword("");
          setRole(""); */
      }).catch((error) => {
        console.log(error);
        sweetAlert('error', "Error", "No pudimos crear el usuario. Inténtalo nuevamente.", "", null);
      });


  }

  // Función para obtener usuarios de la API
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${base_api_url}${admin_path}${user_management}${all}`, {
        method: "GET",
        headers: headers,
        credentials: 'include' // Asegura que las cookies se envíen con la solicitud
      });
      
      const data = await response.json();
      console.log('Datos de usuarios cargados:', data);
      
      if (data && data.result) {
        setUserList(data.result);
      } else {
        console.error('Respuesta inesperada al cargar usuarios:', data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      // sweetAlert('error', "Error", "No pudimos cargar la lista de usuarios. Inténtalo nuevamente.", "", null);
    }
  };

  useEffect(() => {
    // Asegura que fetchAllUsers se ejecute después de que el componente esté completamente montado
    const loadUsers = async () => {
      await fetchAllUsers();
    };
    
    loadUsers();
    
    // Eliminar el hash de la URL si existe
    if (window.location.hash === '#') {
      const newUrl = window.location.href.replace('#', '');
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return (
    <>
      <Sidebar />
      <Header userName={user?.name} />
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
          onFilterClick={handleFilterClick}
        />

        <UserList userList={filteredUsers} />
        <UserModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onSave={handleSaveUser} />
      </section>
      <Footer />
    </>
  );
};

export default Users;