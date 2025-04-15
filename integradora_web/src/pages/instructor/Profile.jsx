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
import { base_api_url, storage_path, upload } from "../../utils/config/paths";

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

  // Manejar el cambio de imagen (uploadFile + setProfileImage)
  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setSelectedFile(file);

    // Vista previa inmediata usando FileReader
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);

    try {
      // Subir el archivo al servidor
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${base_api_url}${storage_path}${upload}`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user'))?.jwt,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error desconocido al subir el archivo.");
      }

      const imageUrl = await response.text();
      setProfileImage(imageUrl);
      setIsUploading(false);
      
      // Mostrar mensaje de éxito
      showToastMessage("Imagen subida correctamente");
    } catch (error) {
      sweetAlert("error", "Error al subir imagen", error.message || "No se pudo subir la imagen", "", null);
      setIsUploading(false);
    }
  };

  // Vista de edición del perfil
  const fetchProfile = async () => {
    try {
      // Llamada a la función de tu instructor.js
      const result = await getInstructorProfile(user.jwt);
      if (!result.success) {
        sweetAlert("error", "Error", result.error);
        return;
      }
      
      
      // El backend retorna algo como { data: { result: { name, email, password, profilePhotoPath } } } 
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

      // Establecer la imagen de perfil si existe
      if (data.profilePhotoPath) {
        setProfileImage(data.profilePhotoPath);
      } else {
        setProfileImage(defaultProfile);
      }
    } catch (error) {
      sweetAlert("error", "Error", "No se pudo cargar la información del perfil");
    }
  };

  // Validación de contraseña
  const validatePasswordLength = (password) => {
    return password.length >= 8;
  };

  const validatePasswordFormat = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasUpperCase && hasNumber;
  };

  // 4) Guardar cambios
  const handleUpdateProfile = async () => {
    try {
      const { name, email, password, confirmPassword } = formData;

      if (!name.trim() || !email.trim()) {
        sweetAlert("warning", "Campos requeridos", "Nombre y correo no pueden estar vacíos.");
        return;
      }

      // Validación de contraseña solo si se está intentando cambiar
      if (password || confirmPassword) {
        if (password !== confirmPassword) {
          sweetAlert("error", "Error", "Las contraseñas no coinciden");
          return;
        }

        if (!validatePasswordLength(password)) {
          sweetAlert("warning", "Contraseña inválida", "La contraseña debe tener al menos 8 caracteres");
          return;
        }

        if (!validatePasswordFormat(password)) {
          sweetAlert("warning", "Contraseña inválida", "La contraseña debe contener al menos una letra mayúscula y un número");
          return;
        }
      }

      // Si el usuario introdujo algo en password, validamos
      let finalPassword = encryptedPassword; // de inicio, usamos la encriptada
      if (password || confirmPassword) {
        // Se intenta cambiar
        // Actualizamos la contraseña final a la nueva
        finalPassword = password;
      }

      // Verificar que tenemos una imagen de perfil
      if (!profileImage) {
        sweetAlert("warning", "Imagen de perfil", "Es necesario tener una imagen de perfil.");
        return;
      }

      // Estructura final del body, basado en tu UserDto.Modify
      const body = {
        userId: user?.jwt,
        name,
        email,
        password: finalPassword, // encriptada si no cambió, o nueva si cambió
        profilePhotoPath: profileImage,
      };

      // Mostrar indicador de carga
      setIsUploading(true);

      const result = await updateInstructorProfile(body);
      
      // Ocultar indicador de carga
      setIsUploading(false);
      
      if (!result.success) {
        sweetAlert("error", "Error al actualizar perfil", result.error, "", null);
        return;
      }

      // Limpiar campos de contraseña después de una actualización exitosa
      setFormData(prevData => ({
        ...prevData,
        password: "",
        confirmPassword: ""
      }));

      sweetAlert("success", "Perfil actualizado", "Tus datos se han guardado con éxito.", "", null);
      
      // Actualizar los datos en el localStorage si es necesario
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser) {
        currentUser.name = name;
        currentUser.profilePhotoPath = profileImage;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      
      // Mostrar mensaje de éxito
      showToastMessage("Perfil actualizado correctamente");
    } catch (error) {
      setIsUploading(false);
      sweetAlert("error", "Error", "Hubo un problema al actualizar tu perfil.", "", null);
    }
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
                    onChange={handleProfileImageChange}
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
                        maxLength={40}
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
                        maxLength={40}
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
                        maxLength={40}
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
                        maxLength={40}
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