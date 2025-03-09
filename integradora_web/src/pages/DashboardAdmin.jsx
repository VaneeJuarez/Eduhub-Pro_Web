import { useEffect, useState } from 'react';
import { sweetAlert, headers } from '../utils/config/config';
import {
    base_api_url,
    admin_path,
    count_all_users,
    user_management
} from '../utils/config/paths';

// Components
import Header from '../components/Header';
import Menu from '../components/Menu';

// Styles
import styles from '../styles/dashboard.module.css';
import Analytics from '../components/admin/Analytics';
import Support from '../components/instructor/Support';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';



const DashboardAdmin = () => {

    let [totalStudents, setTotalStudents] = useState(0);
    let [totalInstructors, setTotalInstructors] = useState(0);
    let [totalCourses, setTotalCourses] = useState(0);

    const getAnalytics = async () => {
        await fetch(base_api_url + admin_path + user_management + count_all_users, {
            method: "GET",
            headers: headers,
            credentials: 'include'
        }).then(response => response.json())
            .then(response => {

                console.log(response);

                if (response.type !== 'SUCCESS') {
                    if (typeof response === 'object' && !response.text) {
                        const errorMessages = Object.values(response).join("\n");
                        sweetAlert('error', 'Error', errorMessages, '', null);
                    } else if (response.text) {
                        sweetAlert('error', 'Error', response.text, '', null);
                    }
                    return;
                }

                setTotalStudents(response.result[0]);
                setTotalInstructors(response.result[1]);
                setTotalCourses(response.result[2]);

                //sweetAlert('success', 'Éxito', response.text, '', null);
            }).catch((error) => {
                console.log(error);
                //     sweetAlert('error', 'Error', 'Hubo un error al cargar las analíticas del sistema, por favor revisa tu conexión a internet o inténtalo más tarde', '', null);
            });
    }

    useEffect(() => {
        getAnalytics();
        document.body.className = ''; // Limpia todas las clases previas
        document.body.classList.add(styles.dashboardBody);

        return () => {
            document.body.classList.remove(styles.dashboardBody); // Limpia cuando se desmonta
        };
    }, []);

    return (
        <>
            <Sidebar />
            <Header userName="Vanessa Juárez"/>
            <Menu />
            <Analytics />
            <Support />
            <Footer />
        </>

    );
}

export default DashboardAdmin