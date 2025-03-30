// Components
import Header from "../../components/Header";
import Support from "../../components/instructor/Support";
import Footer from "../../components/Footer";
import SidebarInstructor from "../../components/instructor/SidebarInstructor";

import { useUserContext } from "../../contexts/UserProvider";


const TechnicalSupport = () => {
const { user } = useUserContext();

    return (
        <>
        <SidebarInstructor />
        <Header userName={user?.name} />
        <Support />
        <Footer />
        </>
    )
}

export default TechnicalSupport