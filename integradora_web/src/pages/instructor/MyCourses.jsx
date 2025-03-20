import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Styles
import styles from "../../styles/general.module.css"

// Components
import Header from "../../components/Header";
import ControlPanel from "../../components/ControlPanel";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import CourseCard from "../../components/CourseCard";

// Modals
import AddCourseModal from "../../components/modals/AddCourseModal"

// data
import { courses } from '../../data/courses';

const MyCourses = ({ addCourse }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("Cursos");
    const navigate = useNavigate();

    // Instructor a filtrar
    const instructorFilter = "Derick Axel Lagunes";

    // Filtra cursos por título, instructor y categoría
    const filteredCourses = courses.filter(course => {
        const matchesInstructor = course.instructor === instructorFilter;

        const matchesSearch = 
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||  
          course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
        const matchesFilter = 
          selectedFilter === "Cursos" ||  // Muestra todos los cursos
          (selectedFilter === "En Curso" && course.status === "En Curso");
      
        return matchesSearch && matchesFilter && matchesInstructor;
      });

      const handleAddCourse = (newCourse) => {
        const addedCourse = addCourse(newCourse)
        navigate(`/course/${addedCourse.id}`)
      }

      return(
        <>
        <Sidebar />
        <Header />
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
            toggleOptions={["Cursos", "En Curso"]}
            />
            {filteredCourses.length === 0 ? (
        <div className="text-left m-4 py-5 ">
          <p className="text-muted">No se encontraron cursos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 m-2 mt-5" >
        {filteredCourses.map(course => (
          <div key={course.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-md-4 mb-4">
            <CourseCard course={course} showActions={true} />
          </div>
        ))}
      </div>
      )}
        </section>
        <AddCourseModal onAddCourse={handleAddCourse} />
        <Footer />
        </>
      );
}

export default MyCourses;