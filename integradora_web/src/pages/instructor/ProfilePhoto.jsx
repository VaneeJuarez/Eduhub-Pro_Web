"use client"

import { useState, useRef, useEffect } from "react"
import { Card, Button, Form, Row, Col, Image, } from "react-bootstrap"
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
import { base_api_url, instructor_path, user_management, upload_photo}  from "../../utils/config/paths";
import { useUserContext } from "../../contexts/UserProvider";
import { headers, sweetAlert } from "../../utils/config/config"
import { uploadFile } from "../../api/global/global";

function ProfilePhoto() {
    const { user } = useUserContext();
    const navigate = useNavigate();


    const [profileImage, setProfileImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Manejar el cambio de imagen de perfil
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file)
        }
    };

    const handleImageClick = () => {
        // Activa la entrada del archivo oculto cuando se hace clic en la imagen
        fileInputRef.current.click()
    }

    // Manejo de el envío del formulario para el nuevo usuario (solo cargar la foto de perfil)
    const handleCompleteProfile = async (e) => {
        e.preventDefault();

        if (!profileImage) {
            sweetAlert("warning", "Foto requerida", "Por favor sube una foto de perfil para continuar.", "", null);
            return;
        }

        setIsUploading(true);

        // Subir archivo
        const result = await uploadFile(selectedFile);
        if (!result.success) {
            setIsUploading(false);
            sweetAlert("error", "Error al subir imagen", result.error, "", null);
            return;
        }

        const profilePhotoUrl = result.data;

        try {
            const response = await fetch(`${base_api_url}${instructor_path}${user_management}${upload_photo}`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    userId: user.userId,
                    profilePhotoPath: profilePhotoUrl,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text(); // intenta obtener texto plano
                throw new Error(errorText || "Error inesperado del servidor");
            }
            
            const text = await response.text();
            const resultJson = text ? JSON.parse(text) : null;
            

            if (response.ok && resultJson?.type === "SUCCESS") {
                sweetAlert("success", "¡Perfil actualizado!", "Tu foto de perfil ha sido guardada correctamente.", "", null);
                navigate("/inst/courses");
              } else {
                sweetAlert("error", "Error", resultJson?.text || "No se pudo actualizar el perfil.", "", null);
              }
            } catch (error) {
              console.error("Error al actualizar perfil:", error);
              sweetAlert("error", "Error", "Hubo un problema al actualizar tu perfil.", "", null);
            } finally {
              setIsUploading(false);
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
                                    <Form onSubmit={handleCompleteProfile} className={styles.ProfileForm}>
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
                                            <Button type="submit" size="lg" className={`px-4 ${styles.BtnProfile}`} style={{ maxWidth: "250px", width: "100%" }}>
                                                <CheckCircleFill className="me-2" /> Completar perfil
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