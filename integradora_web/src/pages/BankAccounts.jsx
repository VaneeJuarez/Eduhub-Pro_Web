import React, { useState } from "react"

// Styles
import styles from "../styles/general.module.css"

// Components
import ControlPanel from "../components/ControlPanel";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import BankAccountList from "../components/BankAccountList";

// Modals
import BankAccountModal from "../components/modals/BankAccountModal";

const BankAccounts = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleSaveAccount = (account) => {
        const existingAccounts = JSON.parse(localStorage.getItem("accounts") || "[]")

        const newAccountId = existingAccounts.length > 0
        ? Math.max(...existingAccounts.map((a) => a.id)) + 1
        : 1;

        const newAccount = {
            ... account,
            id: newAccountId,
            status: "Activo" // Estado inicial
        }

        localStorage.setItem("accounts", JSON.stringify([...existingAccounts, newAccount]))

        setIsModalOpen(false);

        window.dispatchEvent(new Event ("storage"))
    }

    return (
        <>
        <Sidebar />
      <Header userName={"Vanessa Juárez"} />
      <section className={styles.content}>
        <ControlPanel
          showAddButton={true} /* Muestra el botón de agregar */
          onAddClick={() => setIsModalOpen(true)}
          modalId="addAccountModal" // Pasar el id del modal
        />
        <BankAccountList />
        <BankAccountModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onSave={handleSaveAccount} />
      </section>
      <Footer />
        </>
    )

}

export default BankAccounts