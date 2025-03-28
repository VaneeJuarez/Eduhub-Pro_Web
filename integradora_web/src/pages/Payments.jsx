import React, { useState, useEffect } from "react";

// Styles 
import styles from "../styles/general.module.css";

// Components
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import PaymentList from "../components/PaymentList";

import defaultProfile from "../assets/img/unknow.jpeg"

const Payments = () => {
    const [selectedFilter, setSelectedFilter] = useState("Pagado");

    useEffect(() => {
        const existingPayments = JSON.parse(localStorage.getItem("payments") || "[]")

        if (existingPayments.length === 0) {
            const mockPayment = {
              id: 3,
              studentName: "Erick Ramírez",
              courseName: "React Básico",
              cost: 199.99,
              status: "Pendiente",
              instructor: "Vanessa Juárez",
              email: "erick@example.com",
              startDate: "2024-05-10",
              endDate: "2024-06-10",
              profileUser: defaultProfile,
              voucher: "https://example.com/comprobante-erick.jpeg"
            }

            localStorage.setItem("payments", JSON.stringify([mockPayment]))
            window.dispatchEvent(new Event("storage"))
        }
    }, [])

    return (
        <>
        <Sidebar />
      <Header userName={"Vanessa Juárez"} />
      <section className={styles.content}>
        <ControlPanel
        showSearch={true}
        showToggle={true}
          selectedFilter={selectedFilter} /* Indica que opción del filtro está activa */
          setSelectedFilter={setSelectedFilter}
          toggleOptions={[
            "Pagado",
            "Pendiente",
          ]} /* Define los nombres de los botones de alternancia */
        />

        <PaymentList selectedFilter={selectedFilter}/>
      </section>
      <Footer />
        </>
    )


}

export default Payments