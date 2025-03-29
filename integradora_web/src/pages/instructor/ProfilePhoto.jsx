"use client"

import { useState, useRef, useEffect } from "react"
import { Card, Button, Form, Row, Col, Image, } from "react-bootstrap"
import { PersonFill, EnvelopeFill, LockFill, CheckCircleFill } from "react-bootstrap-icons"
import defaultProfile from "../../assets/img/unknow.jpeg";

// Styles
import styles from '../../styles/card.module.css'
import style from "../../styles/general.module.css"

// Components
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function ProfilePhoto() {
    // Esto debería de ir de la autenticación
    const [instructor, setInstructor] = useState({
        fullName: "Vanessa Juárez",
        email: "vanessajuarez@gmail.com",
        profilePicture: null,
    })

    const [profileImage, setProfileImage] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isNewUser, setIsNewUser] = useState(true) // Determina si un usuario acaba de registrarse
    const fileInputRef = useRef(null)

    // Manejar el cambio de imagen de perfil
    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setIsUploading(true)
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result)
                setIsUploading(false)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageClick = () => {
        // Activa la entrada del archivo oculto cuando se hace clic en la imagen
        fileInputRef.current.click()
    }

    // Manejo de el envío del formulario para el nuevo usuario (solo cargar la foto de perfil)
    const handleCompleteProfile = (e) => {
        e.preventDefault()

        if (!profileImage) {
            alert("Por favor sube una foto de perfil para continuar.")
        }

        alert("Tu perfil ha sido configurado correctamente")

        // Cambiar al modo de edición después de completar el perfil
        setIsNewUser(false)
    }

    // Manejo de el envío del formulario para la edición de perfil
    const handleUpdateProfile = (e) => {
        e.preventDefault()

        // Checar si las contraseñas coinciden y están completos
        if (passwords.new || passwords.confirm) {
            if (passwords.new !== passwords.confirm) {
                alert("Las contraseñas no coinciden")
            }

            // La lógica de cambio de contraseña iría aquí
            // Restablecer los campos de contraseña después de una actualización exitosa
            setPasswords({
                new: "",
                confirm: "",
            })
        }

        alert("Tus datos han sido actualizados correctamente.")
    }

    // Vista de configuración del perfil inicial
        return (
            <>
            <Header />
            <section className={style.content} >
            <div className="py-4">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={8}>
                        <Card className={`shadow-sm ${styles.cardProfile}`}>
                            <div className="text-center">
                                <Card.Title className="h3">¡Bienvenido/a {instructor.fullName.split(" ")[0]} a la plataforma!</Card.Title>
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