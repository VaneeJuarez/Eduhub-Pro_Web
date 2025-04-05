import { useEffect, useState } from "react";

// Components
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Analytics from "../../components/admin/Analytics";
import Menu from "../../components/admin/Menu";
import Sidebar from "../../components/admin/Sidebar";
import AnalyticsCourses from "../../components/admin/AnalyticsCourses";

// Styles
import styles from "../../styles/dashboard.module.css";

import { useUserContext } from "../../contexts/UserProvider";
import { headers, sweetAlert } from "../../utils/config/config";
import { admin_path, base_api_url, count, user_management } from "../../utils/config/paths";

const DashboardAdmin = () => {
  const { user } = useUserContext();

  let [totalStudents, setTotalStudents] = useState(0);
  let [totalInstructors, setTotalInstructors] = useState(0);
  let [totalCourses, setTotalCourses] = useState(0);
  let [newStudents, setNewStudents] = useState(0);

  useEffect(() => {
    document.body.className = ""; // Limpia todas las clases previas
    document.body.classList.add(styles.dashboardBody);

    getAnalytics();

    return () => {
      document.body.classList.remove(styles.dashboardBody); // Limpia cuando se desmonta
    };
  }, []);

  const getAnalytics = async () => {
    await fetch(`${base_api_url}${admin_path}${user_management}${count}`, {
      method: "GET",
      headers: headers,
    }).then(response => response.json())
      .then(response => {
        if (response.type !== 'SUCCESS') {
          if (typeof response === 'object' && !response.text) {
            const errorMessages = Object.values(response).join("\n");
            sweetAlert('error', 'Error', errorMessages, '', null);
          } else if (response.text) {
            sweetAlert('error', 'Error', response.text, '', null);
          }
          return;
        }

        setTotalStudents(response.result.totalStudents);
        setNewStudents(response.result.newStudents);
        setTotalInstructors(response.result.totalInstructors);
        setTotalCourses(response.result.totalCourses);

        //sweetAlert('success', 'Éxito', response.text, '', null);
      }).catch((error) => {
        console.log(error);
        // sweetAlert('error', 'Error', 'Hubo un error al cargar las analíticas del sistema, por favor revisa tu conexión a internet o inténtalo más tarde', '', null);
      });
  }

  return (
    <>
      <Sidebar />
      <Header userName={user?.name} />
      <Menu />
      <Analytics
        totalStudents={totalStudents}
        newStudents={newStudents}
        totalInstructors={totalInstructors}
        totalCourses={totalCourses}
      />
      <AnalyticsCourses />
      <Footer />
    </>
  );
};

export default DashboardAdmin;
