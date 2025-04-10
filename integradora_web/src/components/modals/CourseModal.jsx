import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import styles from "../../styles/modal.module.css";
import { headers, headersUpload, sweetAlert } from "../../utils/config/config";
import { all, base_api_url, category_management, instructor_path, storage_path, upload } from "../../utils/config/paths";
import { parseDisplayDate } from "../../utils/dateUtils";
import CheckboxMultiSelect from "../courses/CheckboxMultiSelect";

/* const categoryOptions = [
  { value: "Programación", label: "Programación" },
  { value: "Informática", label: "Informática" },
  { value: "Marketing", label: "Marketing" },
  { value: "Diseño", label: "Diseño" },
  { value: "Negocios", label: "Negocios" },
  { value: "Ciencias", label: "Ciencias" },
  { value: "Comunicación", label: "Comunicación" },
]; */

const CourseModal = ({ show, onHide, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    bannerPath: "",
    startDate: initialData.startDate || "",
    endDate: initialData.endDate || "",
    startDateISO: initialData.startDate || "",
    endDateISO: initialData.endDate || "",
    price: initialData.price || 0.0,
    size: initialData.size || 1,
    tags: initialData.tags || [],
  });

  // verificar al cargar una imagen
  const [isUploading, setIsUploading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.image || "");
  const [startDateError, setStartDateError] = useState("")
  const [endDateError, setEndDateError] = useState("")

  // Función para formatear fechas de formato ISO a "Mar 20"
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return ""
    const date = new Date(isoDate)
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    return `${months[date.getMonth()]} ${date.getDate()}`
  }

  // Obtener la fecha de mañana para el mínimo de la fecha de inicio
  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const year = tomorrow.getFullYear()
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0")
    const day = String(tomorrow.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Obtener la fecha mínima para la fecha de fin (un día después de la fecha de inicio)
  const getMinEndDate = () => {
    if (!formData.startDateISO) return getTomorrowDate()

    const startDate = new Date(formData.startDateISO)
    startDate.setDate(startDate.getDate() + 1)

    const year = startDate.getFullYear()
    const month = String(startDate.getMonth() + 1).padStart(2, "0")
    const day = String(startDate.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    if (!show) {
      // Limpiar campos al cerrar el modal
      setFormData({
        title: "",
        description: "",
        image: "",
        bannerPath: "",
        startDate: "",
        endDate: "",
        price: 0.0,
        size: 1,
        tags: [],
        startDateISO: "",
        endDateISO: ""
      });
      setImagePreview("");
      setImageFile(null);
      setStartDateError("");
      setEndDateError("");
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      fetchAllCategories();
      if (initialData?.courseId) {
        setFormData({
          title: initialData.title || "",
          description: initialData.description || "",
          bannerPath: initialData.bannerPath || "",
          price: initialData.price || 0.0,
          size: initialData.size || 1,
          startDate: initialData.startDate || "",
          endDate: initialData.endDate || "",
          startDateISO: initialData.startDate,
          endDateISO: initialData.endDate,
          tags: initialData.tags || []
        });
        setImagePreview(initialData.bannerPath || "");
      }
    }
  }, [show, initialData]);

  useEffect(() => {
    // Inicializar las fechas en formato ISO para los inputs date
    setFormData((prev) => ({
      ...prev,
      startDateISO: prev.startDate,
      endDateISO: prev.endDate,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "size" ? Number.parseFloat(value) : value,
    }))
  }

  const handleDateChange = (e) => {
    const { name, value } = e.target

    // Validar fecha de inicio
    if (name === "startDateISO") {
      const startDate = new Date(value)
      startDate.setHours(0, 0, 0, 0)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (startDate < today) {
        setStartDateError("La fecha de inicio debe ser igual o posterior a mañana")
        return
      } else {
        setStartDateError("")
      }

      // Si la fecha de fin ya está establecida, verificar que sea posterior a la nueva fecha de inicio
      if (formData.endDateISO) {
        const endDate = new Date(formData.endDateISO)
        endDate.setHours(0, 0, 0, 0)

        const minEndDate = new Date(startDate)
        minEndDate.setDate(minEndDate.getDate() + 1)

        if (endDate <= startDate) {
          setEndDateError("La fecha de fin no puede ser la misma que la fecha de inicio.")

          // Resetear la fecha de fin
          setFormData((prev) => ({
            ...prev,
            endDate: "",
            endDateISO: "",
          }))

          return
        } else {
          setEndDateError("")
        }
      }
    }

    // Validar fecha de fin
    if (name === "endDateISO") {
      if (formData.startDateISO) {
        const startDate = new Date(formData.startDateISO)
        startDate.setHours(0, 0, 0, 0)

        const endDate = new Date(value)
        endDate.setHours(0, 0, 0, 0)

        const minEndDate = new Date(startDate)
        minEndDate.setDate(minEndDate.getDate() + 1)

        if (endDate <= startDate) {
          setEndDateError("Debe ser al menos un día después de la fecha de inicio")
          return
        } else {
          setEndDateError("")
        }
      }
    }

    // Crear la fecha con la hora establecida a mediodía para evitar problemas de zona horaria
    const date = new Date(value + "T12:00:00")
    const formattedDate = formatDateForDisplay(date)

    // Actualizar tanto la fecha ISO como la fecha formateada
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "startDateISO" && { startDate: formattedDate }),
      ...(name === "endDateISO" && { endDate: formattedDate }),
    }));
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(imageUrl);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    setIsUploading(true);

    // Subir imagen
    const res = await fetch(`${base_api_url}${storage_path}${upload}`, {
      method: "POST",
      headers: headersUpload,
      body: formDataUpload,
    });

    // Validar respuesta
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error al subir la imagen:", errorText);
      sweetAlert("error", "Error", "No se pudo subir la imagen al servidor.", "", null);
      setIsUploading(false);
      return;
    }

    // Extraer la URL de la imagen (respuesta como string plano)
    const url = await res.text();

    setFormData((prev) => ({ ...prev, bannerPath: url }));
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar que ambas fechas estén establecidas
    if (!formData.startDateISO || !formData.endDateISO) {
      if (!formData.startDateISO) setStartDateError("La fecha de inicio es obligatoria");
      if (!formData.endDateISO) setEndDateError("La fecha de fin es obligatoria");
      return;
    }

    // Validar que la fecha de fin sea posterior a la fecha de inicio
    const startDate = new Date(formData.startDateISO + "T00:00:00");
    const endDate = new Date(formData.endDateISO + "T00:00:00");

    if (endDate <= startDate) {
      setEndDateError("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    // Mantener los campos que no se editan si es una edición
    const completeData = {
      ...initialData,
      ...formData,
      //  instructor: initialData.instructor || "Usuario Actual",
      rating: initialData.rating !== undefined ? initialData.rating : 0,
      status: initialData.status || "IN_EDITION",
      image: imagePreview, // Usar la URL de la imagen
      // Asegurarse de que las fechas estén en el formato correcto
      startDate: formData.startDateISO,
      endDate: formData.endDateISO,
    };

    onSave(completeData);
  };

  const fetchAllCategories = async () => {
    await fetch(`${base_api_url}${instructor_path}${category_management}${all}`, {
      method: "GET",
      headers: headers,
    })
      .then(response => response.json())
      .then(response => {
        if (response.type === "SUCCESS") {
          const options = response.result.map(cat => ({
            value: cat.categoryId,     // UUID
            label: cat.name    // Nombre visible
          }));
          setCategoryOptions(options);
        }
      });
  }

  return (
    <Modal show={show} onHide={onHide} size="medium">
      <Modal.Header closeButton>
        <Modal.Title className={styles.ModalTitle}>
          {initialData.courseId ? "Editar Curso" : "Agregar Nuevo Curso"}


        </Modal.Title>
      </Modal.Header>
      <Form className={styles.Form} onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Título del Curso</Form.Label>
            <Form.Control
              type="text"
              name="title"
              maxLength={40}
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              maxLength={203}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control
                  type="date"
                  name="startDateISO"
                  value={formData?.startDateISO}
                  onChange={handleDateChange}
                  min={getTomorrowDate()} // Usar la fecha de mañana como mínimo
                  required
                />
                {startDateError && <Form.Text className="text-danger">{startDateError}</Form.Text>}

              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha de Fin</Form.Label>
                <Form.Control
                  type="date"
                  name="endDateISO"
                  value={formData?.endDateISO}
                  onChange={handleDateChange}
                  min={getMinEndDate()} // Usar un día después de la fecha de inicio como mínimo
                  required
                  disabled={!formData.startDateISO} // Deshabilitar hasta que se seleccione una fecha de inicio
                />
                {endDateError && <Form.Text className="text-danger">{endDateError}</Form.Text>}

              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Precio ($)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Límite de Estudiantes</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <CheckboxMultiSelect
            options={categoryOptions}
            value={formData.tags}
            onChange={(newIds) =>
              setFormData(prev => ({ ...prev, tags: newIds }))
            }
          />

          <Form.Group className="mb-3">
            <Form.Label>Imagen de Portada</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Vista previa"
                  style={{ maxHeight: "150px", maxWidth: "100%" }}
                  className="border rounded"
                />
              </div>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isUploading}>
            {isUploading ? (
              <>
                Subiendo
                <Spinner animation="border" size="sm" className="me-2" />
              </>
            ) : (
              "Guardar"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CourseModal;
