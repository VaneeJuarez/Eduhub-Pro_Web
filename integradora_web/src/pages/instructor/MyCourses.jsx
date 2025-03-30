import React, { useState } from "react";

// Styles
import styles from "../../styles/general.module.css";

// Components
import ControlPanel from "../../components/ControlPanel";
import CourseList from "../../components/CourseList";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import SidebarInstructor from "../../components/SidebarInstructor";

// Modals
import CourseModal from "../../components/modals/CourseModal";
import { useUserContext } from "../../contexts/UserProvider";
import { headers, sweetAlert } from "../../utils/config/config";
import { all, base_api_url, course_management, create, instructor_path } from "../../utils/config/paths";

const MyCourses = () => {

  const { user } = useUserContext();

  const [courses, setCourses] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Cursos");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const fetchAllCourses = async () => {
    await fetch(`${base_api_url}${instructor_path}${course_management}${all}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(
        {
          instructorId: user?.jwt
        }
      )
    })
      .then((response) => response.json())
      .then((response) => {
        setCourses(response.result);
      })
      .catch((error) => {
        console.log(error);
        // sweetAlert('error', "Error", "No pudimos cargar la lista de usuarios. Inténtalo nuevamente.", "", null);
      });
  };

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
        <CourseList setCourses={setCourses} courses={courses} refreshCourses={fetchAllCourses} />
        <CourseModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onSave={handleSaveCourse} />
      </section>
      <Footer />
    </>
  );
}

export default MyCourses;