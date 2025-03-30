import React, { useEffect, useState } from "react"

// Styles
import styles from "../../styles/general.module.css"

// Components
import ControlPanel from "../../components/ControlPanel";
import Header from "../../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../../components/Footer";
import BankAccountList from "../components/BankAccountList";

// Modals
import BankAccountModal from "../../components/modals/BankAccountModal";

import { useUserContext } from "../contexts/UserProvider";
import { headers, sweetAlert } from "../utils/config/config";
import { admin_path, all, base_api_url, create, account_management } from "../utils/config/paths";

const BankAccounts = () => {
  const { user } = useUserContext();
  const [accountList, setAccountList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [response, setResponse] = useState(false);


  const handleSaveAccount = async (account) => {
    await fetch(`${base_api_url}${admin_path}${account_management}${create}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        bank_name: account.bank_name,
        account_number: account.account_number,
        key: account.key
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
        fetchAllAccounts();

      }).catch((error) => {
        console.log(error);
        sweetAlert('error', "Error", "No pudimos crear la cuenta. Inténtalo nuevamente.", "", null);
      });

      if (response) {
        setIsModalOpen(false);
        setResponse(true);
      }
  };

  // Función para obtener usuarios
  const fetchAllAccounts = async () => {
    await fetch(`${base_api_url}${admin_path}${account_management}${all}`, {
      method: "GET",
      headers: headers,
    })
    .then((response) => response.json())
    .then((data) => {
      setAccountList(data.result);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    fetchAllAccounts();
  }, []);

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
        <BankAccountList accountList={accountList} />
        <BankAccountModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onSave={handleSaveAccount} />
      </section>
      <Footer />
    </>
  )

}

export default BankAccounts