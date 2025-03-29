import React, { useState } from "react";

// Styles
import styles from "../../styles/general.module.css"

// Components
import Header from "../../components/Header";
import ControlPanel from "../../components/ControlPanel";
import SidebarInstructor from "../../components/SidebarInstructor";
import Footer from "../../components/Footer";
import CourseList from "../../components/CourseList";

// Modals
import CourseModal from "../../components/modals/CourseModal"
import { useUserContext } from "../../contexts/UserProvider";

const MyCourses = () => {

  const { user } = useUserContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Cursos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveCourse = (course) => {
    // Aquí guardaríamos el curso en la base de datos y obtendríamos un id real
    const newCourseId = Date.now().toString()

    // Simulamos guardar el curso en localStorage para mantener los datos
    const existingCourses = JSON.parse(localStorage.getItem("courses") || "[]")
    const newCourse = {
      ...course,
      id: newCourseId,
      instructor: "Usuario Actual", // Esto vendría de la sesión
      rating: 0, // Inicialmente sin calificación
      status: "Pendiente", // Estado inicial
    }

    localStorage.setItem("courses", JSON.stringify([...existingCourses, newCourse]))

    // Cerramos el modal
    setIsModalOpen(false)

    // Forzar actualización
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <>
      <SidebarInstructor />
      <Header userName={user?.name} />
      <section className={styles.content}>
        <ControlPanel
          showAddButton={true}
          modalId="addCourseModal"
          showSearch={true}
          showToggle={true}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          toggleOptions={["Cursos", "En Curso", "Pendientes"]}
          onAddClick={() => setIsModalOpen(true)}
        />
        <CourseList />
        <CourseModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onSave={handleSaveCourse} />
      </section>
      <Footer />
    </>
  );
}

export default MyCourses;