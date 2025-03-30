import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Svgs
import forgotImage from '../../assets/svg/forgot_password.svg';
import recoverImage from '../../assets/svg/recover_password.svg';

import styles from '../../styles/login.module.css';

import { sweetAlert, unlogin } from '../../utils/config/config.js';
import { USER_ACTIONS } from '../../utils/config/enums.js';

import { useUserContext } from '../../contexts/UserProvider.jsx';

import {
    auth_path,
    base_api_url,
    login,
    register
} from '../../utils/config/paths.js';

const Login = () => {

    const navigate = useNavigate();

    const { dispatch } = useUserContext();

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

    const loginRequest = async () => {

        if (email === '' && password === '') {
            sweetAlert('error', 'Error', 'El correo y la contraseña no pueden estar vacíos.', '', null);
            return;
        }

        if (email === '') {
            sweetAlert('error', 'Error', 'El correo no puede estar vacío.', '', null);
            return;
        }
        if (password === '') {
            sweetAlert('error', 'Error', 'La contraseña no puede estar vacía.', '', null);
            return;
        }

        await fetch(`${base_api_url}${auth_path}${login}`, {
            method: "POST",
            headers: unlogin,
            body: JSON.stringify(
                {
                    email: email,
                    password: password
                }
            )
        }).then(response => response.json())
            .then(response => {

                dispatch({
                    type: USER_ACTIONS.LOGIN,
                    value: {
                        jwt: response.jwt,
                        role: response.role,
                        name: response.name
                    }
                });

                if (response.role.includes("ADMIN")) {
                    // sweetAlert('success', 'Éxito', 'Inicio de sesión exitoso', '/admin/dashboard', navigate);
                    navigate('/admin/dashboard');
                } else if (response.role.includes("INSTRUCTOR")) {
                    // sweetAlert('success', 'Éxito', 'Inicio de sesión exitoso', '', navigate);
                    navigate('/inst/courses');
                } else if (response.role.includes("STUDENT")) {
                    sweetAlert('question', 'Aviso', 'Tu cuenta es de estudiante. Inicia sesión en nuestra app móvil.', '', navigate);
                    dispatch({ type: USER_ACTIONS.LOGOUT });
                    return;
                }

            }).catch((error) => {
                console.log(error);
                sweetAlert('error', 'Error', 'Hubo un error al iniciar sesión, por favor revisa tus creenciales o inténtalo de nuevo más tarde', '', null);
            });
    }

    const loginRequestR = async (email, password) => {
        await fetch(`${base_api_url}${auth_path}${login}`, {
            method: "POST",
            headers: unlogin,
            body: JSON.stringify(
                {
                    email: email,
                    password: password
                }
            )
        }).then(response => response.json())
            .then(response => {

                dispatch({
                    type: USER_ACTIONS.LOGIN,
                    value: {
                        jwt: response.jwt,
                        role: response.role,
                        name: response.name
                    }
                });

                if (role === 'STUDENT') {
                    sweetAlert('success', 'Éxito', `Registro exitoso. Inicia sesión en nuestra app móvil`, '', navigate);
                    dispatch({ type: USER_ACTIONS.LOGOUT });
                    return;
                }

                if (response.role.includes("ADMIN")) {
                    // sweetAlert('success', 'Éxito', 'Inicio de sesión exitoso', '/admin/dashboard', navigate);
                    navigate('/admin/dashboard');
                } else if (response.role.includes("INSTRUCTOR")) {
                    // sweetAlert('success', 'Éxito', 'Inicio de sesión exitoso', '', navigate);
                    navigate('/inst/courses');
                }

            }).catch((error) => {
                console.log(error);
                sweetAlert('error', 'Error', 'Hubo un error al iniciar sesión, por favor revisa tus creenciales o inténtalo de nuevo más tarde.', '', null);
            });
    }

    const registerRequest = async () => {
        await fetch(`${base_api_url}${auth_path}${register}`, {
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

                loginRequestR(email, password);


                /* 
                setTimeout(() => {
                window.location.reload();
                }, 4000); 
                */
            }).catch((error) => {
                console.log(error);
                sweetAlert('error', 'Error', 'No pudimos hacer el registro, vuelve a intentarlo.', '', null);
            });
    }

    return (
        <div className={`${styles.owncontainer} ${isSignUpMode ? styles.sign_up_mode : ''}`}>
            <div className={styles.signin_signup}>
                <form className={styles.sign_in_form}>
                    <h2 className={styles.title}>Recuperar Contraseña</h2>
                    <div className={styles.input_field}>
                        <i className="bi bi-envelope-fill"></i>
                        <input type="text" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <input type='button' value="Enviar código" onClick={() => setIsSignUpMode(true)} className={styles.botonpro} />
                    <p className={styles.social_text}>
                        <a href="#" onClick={() => navigate('/')}><i class="bi bi-arrow-left"></i> Volver al inicio de sesión</a>
                    </p>


                    <p className={styles.account_text}>¿No tienes una cuenta?
                        <a href="#" onClick={() => setIsSignUpMode(true)}>Regístrate</a>
                    </p>
                </form>
                <form className={styles.sign_up_form}>
                    <h2 className={styles.title}>Restaurar Contraseña</h2>
                    <div className={styles.input_field}>
                        <i className="bi bi-key-fill"></i>
                        <input type="text" placeholder="Código de recuperación" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={styles.input_field}>
                        <i className="bi bi-lock-fill"></i>
                        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className={styles.input_field}>
                        <i className="bi bi-lock-fill"></i>
                        <input type="password" placeholder="Repetir contraseña" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <input type="button" value="Restaurar" className={styles.botonpro} onClick={async () => await registerRequest()} />

                    <p className={styles.account_text}>¿Ya tienes una cuenta?
                        <a href="#" onClick={() => setIsSignUpMode(false)}>Inicia sesión</a>
                    </p>
                </form>
            </div>
            <div className={styles.panels_container}>
                <div className={`${styles.panel} ${styles.left_panel}`}>
                    <div className={styles.content_panel}>
                        <h3>Revisa tu correo electrónico</h3>
                        <p>Ingresa el código de recuperación que te enviamos a tu correo e ingresa tu nueva contraseña.</p>
                        <button className={styles.botonpro} onClick={() => setIsSignUpMode(false)}>Regresar</button>
                    </div>
                    <img src={recoverImage} className={styles.image} alt="Recover Password" />
                </div>
                <div className={`${styles.panel} ${styles.right_panel}`}>
                    <div className={styles.content_panel}>
                        <h3>¿Olvidaste tu contraseña?</h3>
                        <p>Ingresa tu correo electrónico para recuperar tu cuenta.</p>
                        <br></br>
                        <br></br>
                    </div>
                    <img src={forgotImage} className={styles.image} alt="Forgot Password" />
                </div>
            </div>
        </div>
    );
};

export default Login;
