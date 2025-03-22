import React, { useEffect, useState } from "react";
import styles from "../../styles/modal.module.css";
import CheckboxMultiSelect from "../courses/CheckboxMultiSelect";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const categoryOptions = [
  { value: "Programación", label: "Programación" },
  { value: "Informática", label: "Informática" },
  { value: "Marketing", label: "Marketing" },
  { value: "Diseño", label: "Diseño" },
  { value: "Negocios", label: "Negocios" },
  { value: "Ciencias", label: "Ciencias" },
  { value: "Comunicación", label: "Comunicación" },
];

const AddCourseModal = ({ show, onHide, onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    image: initialData.image || "",
    startDate: initialData.startDate || "",
    endDate: initialData.endDate || "",
    price: initialData.price || 0.0,
    studentLimit: initialData.studentLimit || 1,
    tags: initialData.tags || [],
    modules: initialData.modules || [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.image || "");

  // Función para formatear fechas de formato ISO a "Mar 20"
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Función para convertir de "Mar 20" a fecha ISO para el input date
  const parseDisplayDate = (displayDate) => {
    if (!displayDate) return "";
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    const [month, day] = displayDate.split(" ");
    const monthIndex = months.indexOf(month);
    if (monthIndex === -1) return "";

    const currentYear = new Date().getFullYear();
    return `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(
      Number.parseInt(day)
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    // Inicializar las fechas en formato ISO para los inputs date
    setFormData((prev) => ({
      ...prev,
      startDateISO: parseDisplayDate(prev.startDate),
      endDateISO: parseDisplayDate(prev.endDate),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "studentLimit"
          ? Number.parseFloat(value)
          : value,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const date = new Date(value);
    const formattedDate = formatDateForDisplay(date);

    // Actualizar tanto la fecha ISO como la fecha formateada
    setFormData((prev) => ({
      ...prev,
      [name === "startDateISO" ? "startDate" : "endDate"]: formattedDate,
      [name]: value,
    }));
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Crear una URL para previsualizar la imagen
    const imageUrl = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(imageUrl);
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mantener los campos que no se editan si es una edición
    const completeData = {
      ...initialData,
      ...formData,
      instructor: initialData.instructor || "Usuario Actual",
      rating: initialData.rating !== undefined ? initialData.rating : 0,
      status: initialData.status || "Pendiente",
      image: imagePreview, // Usar la URL de la imagen
    };

    onSave(completeData);
  };

  return (
    <Modal show={show} onHide={onHide} size="medium">
      <Modal.Header closeButton>
        <Modal.Title className={styles.ModalTitle}>
          {initialData.id ? "Editar Curso" : "Agregar Nuevo Curso"}
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
                  value={formData.startDateISO || ""}
                  onChange={handleDateChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Fecha de Fin</Form.Label>
                <Form.Control
                  type="date"
                  name="endDateISO"
                  value={formData.endDateISO || ""}
                  onChange={handleDateChange}
                  required
                />
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
                  name="studentLimit"
                  value={formData.studentLimit}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <CheckboxMultiSelect 
            options={categoryOptions}
            value={formData.tags}
            onChange={(newTags) => setFormData((prev) => ({ ...prev, tags: newTags}))}
          />

          <Form.Group className="mb-3">
            <Form.Label>Imagen de Portada</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
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
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCourseModal;
