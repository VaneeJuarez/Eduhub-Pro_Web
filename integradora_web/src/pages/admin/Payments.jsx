import React, { useEffect, useState } from "react";

// Styles 
import styles from "../../styles/general.module.css";

// Components
import ControlPanel from "../../components/ControlPanel";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import PaymentList from "../../components/admin/PaymentList";
import Sidebar from "../../components/admin/Sidebar";

import defaultProfile from "../../assets/img/unknow.jpeg";
import { useUserContext } from "../../contexts/UserProvider";

const Payments = () => {
  const { user } = useUserContext();
  const [selectedFilter, setSelectedFilter] = useState("FINISHED");

  return (
    <>
      <Sidebar />
      <Header userName={user?.name} />
      <section className={styles.content}>
        <ControlPanel
          showSearch={true}
          showToggle={true}
          selectedFilter={selectedFilter} /* Indica que opción del filtro está activa */
          setSelectedFilter={setSelectedFilter}
          toggleOptions={[
            "FINISHED",
            "PENDING_PAYMENT",
          ]} /* Define los valores de los botones de alternancia */
          toggleLabels={[
            "Pagado",
            "Pendiente",
          ]} /* Define las etiquetas amigables para mostrar */
        />

        <PaymentList selectedFilter={selectedFilter} />
      </section>
      <Footer />
    </>
  )


}

export default Payments