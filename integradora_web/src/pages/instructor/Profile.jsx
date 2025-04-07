"use client"

import { useState, useRef, useEffect } from "react"
import { Button, Form, Row, Col, Image, Toast, ToastContainer, Spinner } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import defaultProfile from "../../assets/img/unknow.jpeg";
import "../../styles/bootstrap/bootstrap.min.css"

// Styles
import styles from '../../styles/card.module.css'
import style from "../../styles/general.module.css"

// Components
import Header from "../../components/Header";
import SidebarInstructor from "../../components/instructor/SidebarInstructor";
import Footer from "../../components/Footer";

// Config
import { useUserContext } from "../../contexts/UserProvider";
import { sweetAlert } from "../../utils/config/config";
import { getInstructorProfile, uploadProfilePhoto, updateInstructorProfile } from "../../api/instructor/intructor";

function Profile() {
  const { user } = useUserContext();

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: "",
    confirmPassword: ""
  });

  // Guardamos la contraseña encriptada que viene del backend
  const [encryptedPassword, setEncryptedPassword] = useState("");

  const [profileImage, setProfileImage] = useState(user.profilePhotoPath || defaultProfile);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const showToastMessage = (message) => {
    setToastMessage(message)
    setShowToast(true)
  }

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    // Activa la entrada del archivo oculto cuando se hace clic en la imagen
    fileInputRef.current.click()
  }

  // Fetchs  

  // Manejar el cambio de imagen (uploadFile + setProfileImage)
  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Subir archivo al servidor y obtener la URL
    const uploadResult = await uploadFile(file);
    if (!uploadResult.success) {
      sweetAlert("error", "Error al subir imagen", uploadResult.error);
      setIsUploading(false);
      return;
    }

    // Guardar la URL devuelta, para luego enviarla con updateInstructorProfile
    setProfileImage(uploadResult.data);
    setIsUploading(false);

    // Opcional: mostrar un Toast de éxito tras subir
    showToastMessage("Imagen subida correctamente");
  };

  // Vista de edción del pefil
  const fetchProfile = async () => {
    // Llamada a la función de tu instructor.js
    const result = await getInstructorProfile(user.jwt);
    if (!result.success) {
      sweetAlert("error", "Error", result.error);
      return;
    }
    // El backend retorna algo como { data: { object: { name, email, password, profilePhotoPath } } } 
    // Dependiendo de cómo lo manejes, ajusta el acceso:
    const data = result.data.result;

    // Guardamos la contraseña encriptada en una variable aparte
    setEncryptedPassword(data.password);

    // Inicializamos formData (sin mostrar la pass encriptada)
    setFormData({
      name: data.name || "",
      email: data.email || "",
      password: "",
      confirmPassword: "",
    });

    setProfileImage(data.profilePhotoPath || defaultProfile);
  };

  // 4) Guardar cambios
  const handleUpdateProfile = async () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name.trim() || !email.trim()) {
      sweetAlert("warning", "Campos requeridos", "Nombre y correo no pueden estar vacíos.");
      return;
    }

    // Si el usuario introdujo algo en password, validamos
    let finalPassword = encryptedPassword; // de inicio, usamos la encriptada
    if (password || confirmPassword) {
      // Se intenta cambiar
      if (password !== confirmPassword) {
        sweetAlert("warning", "Las contraseñas no coinciden", "Verifica tu nueva contraseña.", "", null);
        return;
      }
      // Actualizamos la contraseña final a la nueva
      finalPassword = password;
    }

    // Estructura final del body, basado en tu UserDto.Modify
    const body = {
      userId: user?.jwt,
      name,
      email,
      password: finalPassword, // encriptada si no cambió, o nueva si cambió
      profilePhotoPath: profileImage,
    };

    const result = await updateInstructorProfile(body);
    if (!result.success) {
      sweetAlert("error", "Error al actualizar perfil", result.error, "", null);
      return;
    }

    sweetAlert("success", "Perfil actualizado", "Tus datos se han guardado con éxito.", "", null);
  };

  // Al montar, cargar datos del perfil
  useEffect(() => {
    fetchProfile();
  }, [user]);

  return (
    <>
      <SidebarInstructor />
      <Header userName={user?.name} />
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
                    onChange={handleImageClick}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
                <div>
                  <h2 className="mb-0 ml-2">{user.name}</h2>
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
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Confirmar contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Text className="text-muted mb-4 d-block">
                  Deja estos campos vacíos si no deseas cambiar tu contraseña.
                </Form.Text>

                <div className="text-end">
                  <Button variant="primary" onClick={handleUpdateProfile} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        Subiendo
                        <Spinner animation="border" size="sm" className="ms-2" />
                      </>
                    ) : (
                      "Guardar"
                    )}
                  </Button>

                </div>
              </Form>
            </Col>
          </Row>

        </div>
      </section>
      <Footer />
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }} >
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