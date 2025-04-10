"use client"

import { useState, useRef, useEffect } from "react"
import { Card, Button, Form, Row, Col, Image, Spinner, } from "react-bootstrap"
import { CheckCircleFill } from "react-bootstrap-icons"
import { useNavigate } from 'react-router-dom';

// Styles
import styles from '../../styles/card.module.css'
import style from "../../styles/general.module.css"

import defaultProfile from "../../assets/img/unknow.jpeg";

// Components
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Config
import { base_api_url, instructor_path, student_path, user_management, upload_photo, storage_path, upload, update_profile } from "../../utils/config/paths";
import { useUserContext } from "../../contexts/UserProvider";
import { headers, sweetAlert, headersUpload } from "../../utils/config/config"

function ProfilePhoto() {
    const { user } = useUserContext();
    const navigate = useNavigate();

    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Obtener el email directamente del localStorage para asegurar que tenemos un valor
    const getUserEmail = () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            return userData?.email || "eeeerick28@gmail.com"; // Valor de respaldo si no hay email
        } catch (error) {
            console.error("Error al obtener email del usuario:", error);
            return "eeeerick28@gmail.com"; // Valor de respaldo
        }
    };

    // Manejar el cambio de imagen de perfil
    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setIsUploading(true);

        // Vista previa
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result);
        reader.readAsDataURL(file);

        try {
            // Subir el archivo al servidor
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${base_api_url}${storage_path}${upload}`, {
                method: "POST",
                headers: headersUpload,
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error desconocido al subir el archivo.");
            }

            const imageUrl = await response.text();
            setUploadedUrl(imageUrl);
            setIsUploading(false);
        } catch (error) {
            console.error("Error al subir imagen:", error);
            sweetAlert("error", "Error al subir imagen", error.message || "No se pudo subir la imagen", "", null);
            setIsUploading(false);
        }
    };


    const handleImageClick = () => {
        // Activa la entrada del archivo oculto cuando se hace clic en la imagen
        fileInputRef.current.click()
    }

    const handleCompleteProfile = async () => {
        if (!uploadedUrl) {
            sweetAlert("warning", "Falta imagen", "Primero selecciona una imagen válida.", "", null);
            return;
        }

        try {
            // Depurar el token y los headers
            const userToken = user?.jwt;
            console.log("Token de usuario:", userToken);
            
            // Obtener el email del usuario
            const userEmail = getUserEmail();
            console.log("Email del usuario:", userEmail);
            
            // Estructura del cuerpo de la solicitud - incluir password como en Postman
            const requestBody = {
                userId: userToken,
                name: user?.name || "Usuario",
                email: userEmail, // Usar el email obtenido directamente
                password: "NuevaPassword2024", // Incluir password como en el ejemplo de Postman
                profilePhotoPath: uploadedUrl
            };
            console.log("Cuerpo de la solicitud:", requestBody);
            
            // Probar con la ruta instructor en lugar de student
            const updateUrl = `${base_api_url}${instructor_path}${user_management}${update_profile}`;
            console.log("URL de actualización:", updateUrl);
            
            // Intentar con XMLHttpRequest en lugar de fetch para ver si evita el problema de CORS
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", updateUrl, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Authorization", `Bearer ${userToken}`);
            xhr.withCredentials = true;
            
            xhr.onload = function() {
                console.log("Código de respuesta XHR:", xhr.status);
                console.log("Respuesta XHR:", xhr.responseText);
                
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const resultJson = JSON.parse(xhr.responseText);
                        if (resultJson?.type === "SUCCESS") {
                            sweetAlert("success", "¡Perfil actualizado!", "Tu foto de perfil ha sido guardada.", "", null);
                            navigate("/inst/courses");
                        } else {
                            sweetAlert("error", "Error", resultJson?.text || "No se pudo actualizar el perfil.", "", null);
                        }
                    } catch (e) {
                        console.error("Error al procesar respuesta:", e);
                        sweetAlert("success", "¡Perfil actualizado!", "Tu foto de perfil ha sido guardada.", "", null);
                        navigate("/inst/courses");
                    }
                } else {
                    console.error("Error del servidor:", xhr.responseText);
                    sweetAlert("error", "Error", `Error ${xhr.status}: ${xhr.statusText}`, "", null);
                }
            };
            
            xhr.onerror = function() {
                console.error("Error de red en la solicitud XHR");
                sweetAlert("error", "Error de conexión", "No se pudo conectar con el servidor. Verifica tu conexión a internet.", "", null);
            };
            
            xhr.send(JSON.stringify(requestBody));
            
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            sweetAlert("error", "Error", error.message || "Hubo un problema al actualizar tu perfil.", "", null);
        }
    };


    // Vista de configuración del perfil inicial
    return (
        <>
            <Header userName={user?.name} />
            <section className={style.content} >
                <div className="py-4">
                    <Row className="justify-content-center">
                        <Col xs={12} md={8} lg={8}>
                            <Card className={`shadow-sm ${styles.cardProfile}`}>
                                <div className="text-center">
                                    <Card.Title className="h3">¡Bienvenido/a {user.name?.split(" ")[0]} a la plataforma!</Card.Title>
                                    <Card.Subtitle className="text-muted">
                                        Completa tu perfil subiendo una foto para finalizar el registro
                                    </Card.Subtitle>
                                </div>
                                <Card.Body>
                                    <Form className={styles.ProfileForm}>
                                        <Row>
                                            {/* Profile picture upload section */}
                                            <Col md={12} className="d-flex flex-column align-items-center mb-4">
                                                <div className="position-relative mb-3" style={{ width: "192px", height: "192px" }}>
                                                    <Image
                                                        src={profileImage || defaultProfile}
                                                        alt="Foto de perfil"
                                                        roundedCircle
                                                        className={styles.ImageProfile}
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        onClick={handleImageClick}
                                                    />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        ref={fileInputRef}
                                                        style={{ display: "none" }}
                                                        onChange={handleImageChange}
                                                    />
                                                </div>
                                                <div className="w-100" style={{ maxWidth: "250px" }}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label className="text-center d-block">Sube tu foto de perfil</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="cursor-pointer"
                                                        />
                                                        <Form.Text className="text-muted text-center d-block">JPG, PNG o GIF. Máximo 2MB.</Form.Text>
                                                    </Form.Group>
                                                </div>
                                            </Col>
                                        </Row>
                                        <div className="d-flex justify-content-center mt-2">
                                            <Button
                                                type="button"
                                                onClick={handleCompleteProfile}
                                                size="lg"
                                                className={`px-4 ${styles.BtnProfile}`}
                                                style={{ maxWidth: "250px", width: "100%" }}
                                                disabled={!profileImage || isUploading}
                                            >
                                                {isUploading ? (
                                                    <>
                                                        Subiendo
                                                        {' '}
                                                        <Spinner animation="border" size="sm" className="me-2" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Completar perfil
                                                        {' '}
                                                        <CheckCircleFill className="me-2" />
                                                    </>
                                                )}
                                            </Button>

                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </section>
            <Footer />
        </>
    )

}

export default ProfilePhoto