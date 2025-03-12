import { useEffect, useState } from "react";

// Components
import Header from "../components/Header";
import Menu from "../components/Menu";
import Analytics from "../components/admin/Analytics";
import Support from "../components/instructor/Support";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

// Styles
import styles from "../styles/dashboard.module.css";

const DashboardAdmin = () => {
  let [totalStudents, setTotalStudents] = useState(0);
  let [totalInstructors, setTotalInstructors] = useState(0);
  let [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    document.body.className = ""; // Limpia todas las clases previas
    document.body.classList.add(styles.dashboardBody);

    return () => {
      document.body.classList.remove(styles.dashboardBody); // Limpia cuando se desmonta
    };
  }, []);

  return (
    <>
      <Sidebar />
      <Header userName="Vanessa Juárez" />
      <Menu />
      <Analytics />
      <Support />
      <Footer />
    </>
  );
};

export default DashboardAdmin;
