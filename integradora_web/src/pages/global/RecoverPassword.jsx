import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Svgs
import forgotImage from '../../assets/svg/forgot_password.svg';
import recoverImage from '../../assets/svg/recover_password.svg';

import styles from '../../styles/login.module.css';

import { sweetAlert } from '../../utils/config/config.js';
import { restorePassword, sendRecoveryCode } from '../../api/global/global.js';

const RecoverPassword = () => {
    const navigate = useNavigate();

    const [isSignUpMode, setIsSignUpMode] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');

    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(styles.fade_in, styles.loginBody);
        return () => {
            document.body.classList.remove(styles.fade_in, styles.loginBody);
        };
    }, []);

    const handleSendCode = async () => {
        if (!email) {
            sweetAlert("error", "Error", "No se ha proporcionado un correo.", "", null);
            return;
        }
        const response = await sendRecoveryCode(email);
        if (!response.success) {
            sweetAlert("error", "Error", response.error, "", null);
            return;
        }
        setIsSignUpMode(true);
    };

    const handleRestorePassword = async () => {
        if (password !== repeatPassword) {
            sweetAlert("error", "Error", "Las contraseñas no coinciden.", "", null);
            return;
        }

        const response = await restorePassword(email, password, recoveryCode);
        if (!response.success) {
            sweetAlert("error", "Error", response.error, "", null);
            return;
        }

        sweetAlert("success", "Éxito", "Contraseña actualizada. Ya puedes iniciar sesión.", "/", navigate);
    };

    return (
        <div className={`${styles.owncontainer} ${isSignUpMode ? styles.sign_up_mode : ''}`}>
            <div className={styles.signin_signup}>
                <form className={styles.sign_in_form}>
                    <h2 className={styles.title}>Recuperar Contraseña</h2>
                    <div className={styles.input_field}>
                        <i className="bi bi-envelope-fill"></i>
                        <input type="text" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <input type='button' value="Enviar código" onClick={handleSendCode} className={styles.botonpro} />

                    <p className={styles.social_text}>
                        <a href="#" onClick={() => navigate('/')}><i className="bi bi-arrow-left"></i> Volver al inicio de sesión</a>
                    </p>

                    <p className={styles.account_text} style={{ marginTop: "1rem" }}>
                        ¿Ya tienes un código?
                        <a href="#" onClick={() => setIsSignUpMode(true)} style={{ color: "#bb86fc", marginLeft: "5px" }}>
                            Ingresar código
                        </a>
                    </p>

                </form>

                <form className={styles.sign_up_form}>
                    <h2 className={styles.title}>Restaurar Contraseña</h2>
                    <div className={styles.input_field}>
                        <i className="bi bi-key-fill"></i>
                        <input type="text" placeholder="Código de recuperación" onChange={(e) => setRecoveryCode(e.target.value)} />
                    </div>
                    <div className={styles.input_field}>
                        <i className="bi bi-lock-fill"></i>
                        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className={styles.input_field}>
                        <i className="bi bi-lock-fill"></i>
                        <input type="password" placeholder="Repetir contraseña" onChange={(e) => setRepeatPassword(e.target.value)} />
                    </div>
                    <input type="button" value="Restaurar" className={styles.botonpro} onClick={handleRestorePassword} />

                    <p className={styles.account_text}>¿No tienes un código?
                        <a href="#" onClick={() => setIsSignUpMode(false)}>Solicitar código</a>
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
                        <br /><br />
                    </div>
                    <img src={forgotImage} className={styles.image} alt="Forgot Password" />
                </div>
            </div>
        </div>
    );
};

export default RecoverPassword;
