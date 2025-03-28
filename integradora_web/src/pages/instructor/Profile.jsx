"use client"

import { useState, useRef } from "react"
import { Button, Form, Row, Col, Image, Toast, ToastContainer } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import defaultProfile from "../../assets/img/unknow.jpeg";
import "../../styles/bootstrap/bootstrap.min.css"

// Styles
import styles from '../../styles/card.module.css'
import style from "../../styles/general.module.css"

// Components
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

function Profile() {
    // Esto debería de ir de la autenticación
    const [instructor, setInstructor] = useState({
        fullName: "Vanessa Juárez",
        email: "vanessajuarez@gmail.com",
        profilePicture: null,
    })

    const [formData, setFormData] = useState({
      fullName: instructor.fullName,
      email: instructor.email,
    })

    const [profileImage, setProfileImage] = useState(null)
    const [passwords, setPasswords] = useState({ new: "", confirm: ""})
    const fileInputRef = useRef(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")

    const showToastMessage = (message) => {
      setToastMessage(message)
      setShowToast(true)
    }

    // Manejar el cambio de imagen de perfil
    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleImageClick = () => {
        // Activa la entrada del archivo oculto cuando se hace clic en la imagen
        fileInputRef.current.click()
    }

    const handleUpdateProfile = (e) => {
      e.preventDefault()

      // Validación de campos
      if (!formData.fullName.trim()) {
        showToastMessage("El nombre completo no puede estar vacío.")
        return
      }

      if (!formData.email.trim()) {
        showToastMessage("El correo electrónico no puede estar vacío.")
        return
      }

      if ((passwords.new || passwords.confirm) && passwords.new !== passwords.confirm) {  
        showToastMessage("Las contraseñas no coinciden.")
        return
      }

      // Simular guardado
      setInstructor({
        ...instructor,
        fullName: formData.fullName,
        email: formData.email,
      })

      // Limpiar contraseñas
      setPasswords({ new: "", confirm: "" })

      showToastMessage("Tus datos han sido actualizados correctamente.")
    }

    // Vista de edción del pefil 
    return (
        <>
        <Sidebar />
        <Header />
        <section className={style.content}>
        <div className="py-5">

            <Row className="justify-content-center" >
                <Col xs={12} lg={7} style={{ zIndex: "90" }}>
                    {/* Encabezado con imagen clickeable */}
                    <div className="d-flex align-items-center mb-4">
                        <div
                            style={{
                                position: "relative",
                                cursor: "pointer",
                                width: "100px",
                                height: "100px"
                            }}
                            onClick={handleImageClick}
                            className="me-4"
                        >
                            <Image
                                src={profileImage || defaultProfile}
                                alt="Foto de perfil"
                                roundedCircle
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                            {/* Overlay con indicación de que es clickeable */}
                            <div className={styles.Overlay}
                                style={{
                                    
                                }}
                            >
                              <FontAwesomeIcon icon={faCamera} />
                            </div>
                            {/* Input de archivo oculto */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                style={{ display: "none" }}
                            />
                        </div>
                        <div>
                            <h2 className="mb-0 ml-2">{instructor.fullName}</h2>
                            <small className="text-muted ml-2">Gestiona tu información personal</small>
                            
                        </div>
                    </div>
                    <Form onSubmit={handleUpdateProfile} className={styles.ProfileForm} >
                    <h5 className={`mb-3 m-0 ${styles.InfoProfile}`}>Información básica</h5>
            <Row className="mb-4">
              <Col sm={6} className="mb-3 mb-sm-0">
                <Form.Group>
                  <Form.Label>Nombre completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Contraseña */}
            <h5 className={`mb-3 m-0 ${styles.InfoProfile}`}>Cambiar contraseña</h5>
            <Row className="mb-3">
              <Col sm={6} className="mb-3 mb-sm-0">
                <Form.Group>
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Text className="text-muted mb-4 d-block">
              Deja estos campos vacíos si no deseas cambiar tu contraseña.
            </Form.Text>

            <div className="text-end">
              <Button type="submit" variant="primary" className={`px-4 ${styles.BtnProfile}`}>
                Guardar cambios
              </Button>
            </div>
                    </Form>
                </Col>
            </Row>

        </div>
        </section>
        <Footer />
        <ToastContainer position="top-end" className="p-3"style={{ zIndex: 9999}} >
          <Toast 
          bg="primary"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          >
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
        </>

    )

}

export default Profile