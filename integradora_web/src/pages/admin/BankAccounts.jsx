import React, { useEffect, useState } from "react"

// Styles
import styles from "../../styles/general.module.css"

// Components
import ControlPanel from "../../components/ControlPanel";
import Header from "../../components/Header";
import Sidebar from "../../components/admin/Sidebar";
import Footer from "../../components/Footer";
import BankAccountList from "../../components/admin/BankAccountList";

// Modals
import BankAccountModal from "../../components/modals/BankAccountModal";

import { useUserContext } from "../../contexts/UserProvider";
import { headers, sweetAlert } from "../../utils/config/config";
import { admin_path, all, base_api_url, save, account_management } from "../../utils/config/paths";



const BankAccounts = () => {
  const { user } = useUserContext();
  const [accountList, setAccountList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [response, setResponse] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleSaveAccount = async (account) => {
    console.log(account);
    
    await fetch(`${base_api_url}${admin_path}${account_management}${save}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        adminId: user.jwt,
        bankName: account.bankName, 
        accountNumber: account.accountNumber,
        key: account.key
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

        setResponse(true);
        fetchAllAccounts();
        setIsModalOpen(false);
        setResponse(true);

      }).catch((error) => {
        console.log(error);
        
        sweetAlert('error', "Error", "No pudimos crear la cuenta. Inténtalo nuevamente.", "", null);
      });
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
      <Header userName={user?.name} />
      <section className={styles.content}>
        <ControlPanel
          showAddButton={true} /* Muestra el botón de agregar */
          onAddClick={() => setIsModalOpen(true)}
          modalId="addAccountModal" // Pasar el id del modal
        />
        <BankAccountList accountList={accountList} refreshAccounts={fetchAllAccounts} />
        <BankAccountModal show={isModalOpen} onHide={() => setIsModalOpen(false)} onSave={handleSaveAccount} />
      </section>
      <Footer />
    </>
  )

}

export default BankAccounts