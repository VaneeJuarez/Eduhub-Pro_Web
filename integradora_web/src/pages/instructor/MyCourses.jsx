import React, { useState, useEffect } from "react";

// Styles
import styles from "../../styles/general.module.css";

// Components
import ControlPanel from "../../components/ControlPanel";
import CourseList from "../../components/instructor/CourseList";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import SidebarInstructor from "../../components/instructor/SidebarInstructor";

// Modals
import CourseModal from "../../components/modals/CourseModal";
import { useUserContext } from "../../contexts/UserProvider";
import { headers, sweetAlert } from "../../utils/config/config";
import { all, base_api_url, course_management, create, instructor_path, review_management, by_id } from "../../utils/config/paths";

const MyCourses = () => {

  const { user } = useUserContext();

  const [courses, setCourses] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Cursos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCourses = courses.length > 0 ? courses.filter((course) => {
    const status = course.courseStatus?.toUpperCase();

    if (selectedFilter === "Cursos") {
      return ["PUBLISHED", "IN_EDITION", "FINALIZED"].includes(status);
    } else if (selectedFilter === "En Curso") {
      return status === "IN_PROGRESS";
    } else if (selectedFilter === "Pendientes") {
      return status === "TO_APPROVE";
    }
    return true;
  }).filter((course) => {
    // Filtro por búsqueda
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();

    const titleMatch = course.title?.toLowerCase().includes(lowerSearch);
    const instructorMatch = course.instructor?.name?.toLowerCase().includes(lowerSearch);
    const categoryMatch = course.categories?.some(cat =>
      cat.name?.toLowerCase().includes(lowerSearch)
    );

    return titleMatch || instructorMatch || categoryMatch;
  }) : [];

  const handleSaveCourse = async (course) => {
    await fetch(`${base_api_url}${instructor_path}${course_management}${create}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        title: course.title,
        description: course.description,
        bannerPath: course.bannerPath,
        startDate: course.startDateISO,
        endDate: course.endDateISO,
        price: course.price,
        size: course.size,
        instructorId: user.jwt,
        categoriesId: course.tags
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

        fetchAllCourses();
        setIsModalOpen(false);

      }).catch((error) => {
        console.log(error);
        sweetAlert('error', "Error", "No pudimos crear el curso. Inténtalo nuevamente.", "", null);
      });
  }

    // Obtiene el promedio de reseñas de un curso
    async function fetchCourseRating(courseId) {
      try {
        const response = await fetch(`${base_api_url}${instructor_path}${review_management}${by_id}`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ courseId: courseId }), // Ajustar nombre de campo si difiere
        });
        const data = await response.json();
  
        if (data.type === "SUCCESS") {
          const reviews = data.result;
          if (!reviews || reviews.length === 0) return 0; // sin reseñas
          const sum = reviews.reduce((acc, r) => acc + r.score, 0);
          return sum / reviews.length;
        }
  
        // Si el backend no devolvió SUCCESS, devolvemos 0
        return 0;
      } catch (error) {
        console.error("Error al obtener reseñas del curso", error);
        return 0;
      }
    }
  
    // Cargar los cursos del instructor y sus ratings si están finalizados
    const fetchAllCourses = async () => {
      try {
        const response = await fetch(
          `${base_api_url}${instructor_path}${course_management}${all}`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
              instructorId: user?.jwt,
            }),
          }
        );
        const data = await response.json();
  
        // asumiendo que data.type === "SUCCESS" cuando todo va bien
        if (data.type !== "SUCCESS") {
          console.error("Error al cargar cursos:", data.text || "Desconocido");
          return;
        }
  
        // su lista de cursos vendrá en data.result
        let loadedCourses = data.result || [];
  
        // para cada curso FINALIZED, calculamos rating
        for (let c of loadedCourses) {
          if (c.courseStatus === "FINALIZED") {
            c.rating = await fetchCourseRating(c.courseId);
          } else {
            c.rating = 0;
          }
        }
  
        setCourses(loadedCourses);
      } catch (error) {
        console.error("Error al cargar cursos:", error);
        // sweetAlert('error', "Error", "No pudimos cargar la lista de cursos...", "", null);
      }
    };
  
    // Llama a fetchAllCourses apenas carga el componente
    useEffect(() => {
      fetchAllCourses();
      // eslint-disable-next-line
    }, []);



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
        <CourseList setCourses={setCourses} courses={filteredCourses} refreshCourses={fetchAllCourses} />
        <CourseModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onSave={handleSaveCourse} />
      </section>
      <Footer />
    </>
  );
}

export default MyCourses;