import { useUserContext } from '../contexts/UserProvider.jsx';

// Config
import { sweetAlert, headers } from '../utils/config/config.js';
import { USER_ACTIONS } from '../utils/config/enums.js';
import {
    base_api_url,
    auth_path,
    logout
} from '../utils/config/paths.js';

// Img
import logo from '../assets/img/Logo.png'
import styles from '../styles/header.module.css'


const Header = ({userName}) => {

    const { dispatch } = useUserContext();

    const logoutRequest = async () => {

        const user = JSON.parse(localStorage.getItem("user"));

        await fetch(base_api_url + auth_path + logout, {
            method: "DELETE",
            headers: headers,
            body: JSON.stringify(
                {
                    userId: user.jwt
                }
            ),
            credentials: 'include'
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

                dispatch({
                    type: USER_ACTIONS.LOGOUT
                });
                sweetAlert('success', 'Éxito', response.text, '', null);
            }).catch((error) => {
                console.log(error);
                sweetAlert('error', 'Error', 'Hubo un error al cerrar la sesión, por favor revisa tu conexión a internet o inténtalo más tarde', '', null);
            });
    }

    return (
        <header className={`${styles.headerArea} ${styles.headerSticky}`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className={styles.mainNav}>
              <a href="#" className={styles.logo}>
                <img src={logo} alt="EduHub Pro" style={{ height: "100%" }} />
              </a>
              <ul className={styles.nav}>
                <li>
                  <a className="active" style={{ gap: "5px", display: "flex", alignItems: "center" }}>
                    <i className="bi bi-person-fill"></i> <span>{userName}</span>
                  </a>
                </li>
              </ul>
              <a className={styles.menuTrigger}>
                <span>Menu</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
    );
}

export default Header;