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
  const [error, setError] = useState(null);

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
    try {
      const response = await fetch(`${base_api_url}${instructor_path}${course_management}${create}`, {
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
      });
      const result = await response.json();

      if (result.type !== 'SUCCESS') {
        if (typeof result === 'object' && !result.text) {
          const errorMessages = Object.values(result).join("\n");
          sweetAlert('error', 'Error', errorMessages, '');
        } else if (result.text) {
          sweetAlert('error', 'Error', result.text, '');
        }
        return;
      }

      await fetchAllCourses();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      sweetAlert('error', "Error", "No pudimos crear el curso. Inténtalo nuevamente.", "", null);
    }
  };

  // Obtiene el promedio de reseñas de un curso
  const fetchCourseRating = async (courseId) => {
    try {
      const response = await fetch(`${base_api_url}${instructor_path}${review_management}${by_id}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ courseId: courseId }),
      });
      const data = await response.json();

      if (data.type === "SUCCESS") {
        const reviews = data.result;
        if (!reviews || reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.score, 0);
        return sum / reviews.length;
      }

      return 0;
    } catch (error) {
      console.error("Error al obtener reseñas del curso", error);
      return 0;
    }
  };

  // Cargar los cursos del instructor y sus ratings si están finalizados
  const fetchAllCourses = async () => {
    try {
      setError(null);

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

      if (data.type !== "SUCCESS") {
        throw new Error(data.text || "Error al cargar los cursos");
      }

      let loadedCourses = data.result || [];

      // Cargar ratings en paralelo para mejorar el rendimiento
      const coursesWithRatings = await Promise.all(
        loadedCourses.map(async (course) => ({
          ...course,
          rating: course.courseStatus === "FINALIZED" ? await fetchCourseRating(course.courseId) : 0
        }))
      );

      setCourses(coursesWithRatings);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      setError(error.message);
      sweetAlert('error', "Error", "No pudimos cargar la lista de cursos.", "", null);
    }
  };

  useEffect(() => {
    fetchAllCourses();
    // Configurar actualización automática cada 30 segundos
    const interval = setInterval(fetchAllCourses, 30000);
    return () => clearInterval(interval);
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
        
        {error ? (
          <div className="text-center py-5">
            <p className="text-danger">{error}</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <CourseList 
            setCourses={setCourses} 
            courses={filteredCourses} 
            refreshCourses={fetchAllCourses} 
          />
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No se encontraron cursos que coincidan con los criterios de búsqueda.</p>
          </div>
        )}

        <CourseModal 
          show={isModalOpen} 
          onHide={() => setIsModalOpen(false)} 
          onSave={handleSaveCourse} 
        />
      </section>
      <Footer />
    </>
  );
}

export default MyCourses;