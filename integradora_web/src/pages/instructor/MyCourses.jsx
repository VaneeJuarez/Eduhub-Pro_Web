import React, { useState } from "react";

// Styles
import styles from "../../styles/general.module.css"

// Components
import Header from "../../components/Header";
import ControlPanel from "../../components/ControlPanel";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import CourseList from "../../components/CourseList";

// Modals
import CourseModal from "../../components/modals/CourseModal"
import { useUserContext } from "../../contexts/UserProvider";
import { admin_path, base_api_url, course_management, create } from "../../utils/config/paths";
import { headers, sweetAlert } from "../../utils/config/config";

const MyCourses = () => {

  const { user } = useUserContext();

  const [response, setResponse] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Cursos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveCourse = async (course) => {

    await fetch(`${base_api_url}${admin_path}${course_management}${create}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        title: course.title,
        description: course.description,
        bannerPath: course.bannerPath,
        startDate: course.startDate,
        endDate: course.endDate,
        price: course.price,
        size: course.size,
        instructorId: user.jwt,
        categoriesId: course.categoriesId
      }),
    }).then(response => response.json())
      .then((result) => {
        console.log(result);

        if (result.type !== 'SUCCESS') {
          if (typeof result === 'object' && !result.text) {
            const errorMessages = Object.values(result).join("\n");
            sweetAlert('error', 'Error', errorMessages, '');
          } else if (result.text) {
            sweetAlert('error', 'Error', result.text, '');
          }
          return;
        }

        setResponse(true);
        fetchAllUsers();

      }).catch((error) => {
        console.log(error);
        sweetAlert('error', "Error", "No pudimos crear el curso. Inténtalo nuevamente.", "", null);
      });

    // Cerramos el modal
    if (response) {
      setIsModalOpen(false);
      setResponse(false);
    }
  }

  return (
    <>
      <Sidebar />
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