import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Svgs
import signinImage from '../assets/svg/signup.svg';
import signupImage from '../assets/svg/signin.svg';

import styles from '../styles/login.module.css';


import { useUserContext } from '../contexts/UserProvider';
import { sweetAlert, unlogin } from '../utils/config/config.js';
import { USER_ACTIONS } from '../utils/config/enums.js';

import {
    base_api_url,

    auth_path,
    global_path,

    user_management,

    login,
    create_user
} from '../utils/config/paths.js';

const Login = () => {

    // Animation
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    // Login
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        document.body.className = ''; // Limpia todas las clases previas
        document.body.classList.add(styles.fade_in, styles.loginBody);

        return () => {
            document.body.classList.remove(styles.fade_in, styles.loginBody); // Limpia cuando se desmonta
        };
    }, []);

    const { dispatch } = useUserContext();
    const navigate = useNavigate();

    const loginRequest = async () => {
        await fetch(base_api_url + auth_path + login, {
            method: "POST",
            headers: unlogin,
            body: JSON.stringify(
                {
                    email: email,
                    password: password
                }
            ),
            credentials: 'include'
        }).then(response => response.json())
            .then(response => {

                if (!response.jwt) {
                    sweetAlert('error', 'Error', 'Usuario no encontrado', '');
                } else {

                    dispatch({
                        type: USER_ACTIONS.LOGIN,
                        value: {
                            jwt: response.jwt,
                            role: response.role,
                            name: response.name
                        }
                    });

                    if (response.role.includes("ADMIN")) {
                        sweetAlert('success', 'Éxito', 'Inicio de sesión exitoso', '/admin/dashboard', navigate);
                    } else if (response.role.includes("INSTRUCTOR")) {
                        sweetAlert('success', 'Éxito', 'Inicio de sesión exitoso', '', navigate);
                    } else if (response.role.includes("STUDENT")) {
                        sweetAlert('success', 'Éxito', 'Inicio de sesión exitoso', '', navigate);
                    }
                }

            }).catch((error) => {
                console.log(error);
                sweetAlert('error', 'Error', 'Hubo un error, por favor revisa tu conexión a internet o inténtalo más tarde', '');
            });
    }

    const registerRequest = async () => {
        await fetch(base_api_url + global_path + user_management + create_user, {
            method: "POST",
            headers: unlogin,
            body: JSON.stringify(
                {
                    name: name,
                    email: email,
                    password: password,
                    role: role
                }
            )
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

                sweetAlert('success', 'Éxito', response.text + '. Por favor, inicia sesión', '', null);
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            }).catch((error) => {
                console.log(error);
                sweetAlert('error', 'Error', 'Hubo un error al registrarte, por favor revisa tu conexión a internet o inténtalo más tarde', '', null);
            });
    }

    return (
        <div className={`${styles.owncontainer} ${isSignUpMode ? styles.sign_up_mode : ''}`}>
            <div className={styles.signin_signup}>
                <form className={styles.sign_in_form}>
                    <h2 className={styles.title}>Iniciar Sesión</h2>
                    <div className={styles.input_field}>
                        <i className="bi bi-envelope-fill"></i>
                        <input type="text" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.input_field}>
                        <i className="bi bi-lock-fill"></i>
                        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <input type='button' value="Iniciar sesión" onClick={async () => await loginRequest()} className={styles.botonpro} />
                    <p className={styles.social_text}>O inicia sesión con tu cuenta de Google</p>
                    <div className={styles.social_media}>
                        <a href="#" className={styles.social_icon}>
                            <i className="bi bi-google"></i>
                        </a>
                    </div>
                    <p className={styles.account_text}>¿No tienes una cuenta?
                        <a href="#" onClick={() => setIsSignUpMode(true)}>Regístrate</a>
                    </p>
                </form>
                <form className={styles.sign_up_form}>
                    <h2 className={styles.title}>Registrarse</h2>
                    <div className={styles.input_field}>
                        <i className="bi bi-person-fill"></i>
                        <input type="text" placeholder="Nombre completo" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className={styles.input_field}>
                        <i className="bi bi-envelope-fill"></i>
                        <input type="text" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.input_field}>
                        <i className="bi bi-lock-fill"></i>
                        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className={styles.input_field}>
                        <i className="bi bi-people-fill"></i>
                        <select className={styles.role_select} value={role} onChange={(e) => setRole(e.target.value)}>
                            <option disabled value="">Selecciona un rol</option>
                            <option value="INSTRUCTOR">Docente</option>
                            <option value="STUDENT">Estudiante</option>
                        </select>
                    </div>
                    <input type="button" value="Registrarse" className={styles.botonpro} onClick={async () => await registerRequest()} />
                    <p className={styles.social_text}>O regístrate con tu cuenta de Google</p>
                    <div className={styles.social_media}>
                        <a href="#" className={styles.social_icon}>
                            <i className="bi bi-google"></i>
                        </a>
                    </div>
                    <p className={styles.account_text}>¿Ya tienes una cuenta?
                        <a href="#" onClick={() => setIsSignUpMode(false)}>Inicia sesión</a>
                    </p>
                </form>
            </div>
            <div className={styles.panels_container}>
                <div className={`${styles.panel} ${styles.left_panel}`}>
                    <div className={styles.content_panel}>
                        <h3>¿Ya eres miembro?</h3>
                        <p>Inicia sesión y sigue disfrutando de todo nuestro contenido.</p>
                        <button className={styles.botonpro} onClick={() => setIsSignUpMode(false)}>Inicia sesión</button>
                    </div>
                    <img src={signupImage} className={styles.image} alt="Sign up" />
                </div>
                <div className={`${styles.panel} ${styles.right_panel}`}>
                    <div className={styles.content_panel}>
                        <h3>¿Eres nuevo aquí?</h3>
                        <p>Regístrate y conoce todo lo que nuestro sistema ofrece para el aprendizaje.</p>
                        <button className={styles.botonpro} onClick={() => setIsSignUpMode(true)}>Registrarse</button>
                    </div>
                    <img src={signinImage} className={styles.image} alt="Sign in" />
                </div>
            </div>
        </div>
    );
};

export default Login;
