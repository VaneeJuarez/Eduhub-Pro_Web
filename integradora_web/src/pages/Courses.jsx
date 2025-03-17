import React, { useState }from "react";

// Components
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import CourseCard from "../components/CourseCard";

// Styles
import styles from "../styles/general.module.css";

//data 
import { courses } from '../data/courses'

const Courses = () => {
  const [searchTerm, setSearchTerm] =
    useState(""); /* Almacena el término de búsqueda y lo actualiza */
  const [selectedFilter, setSelectedFilter] = useState("Aprobados");

    // Filtrar cursos según el término de búsqueda y el filtro seleccionado
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (
        (selectedFilter === "Aprobados" && course.status === "Aprobado") ||
        (selectedFilter === "Pendientes" && course.status === "Pendiente") ||
        (selectedFilter === "En Curso" && course.status === "En Curso")
      )
  );

  return (
    <>
      <Sidebar />
      <Header userName={"Vanessa Juárez"} />
      <section className={styles.content}>
        <ControlPanel 
        showSearch={true} 
        showToggle={true} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        toggleOptions={[
            "Aprobados",
            "Pendientes",
            "En Curso"
        ]}
        />
        {filteredCourses.length === 0 ? (
        <div className="text-left m-4 py-5 ">
          <p className="text-muted">No se encontraron cursos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 m-2 mt-5" >
        {filteredCourses.map(course => (
          <div key={course.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-md-4 mb-4">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
      )}
      </section>
      <Footer/>
    </>
  );
};

export default Courses
