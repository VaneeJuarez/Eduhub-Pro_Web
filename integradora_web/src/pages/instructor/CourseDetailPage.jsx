"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { Badge, Button, Card, Col, Container, Modal, Row, Toast } from "react-bootstrap"
import { ArrowLeft, Plus } from "react-bootstrap-icons"

// Components
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import CourseStatusCard from "../../components/card/CourseStatusCard"
import ModuleAccordion from "../../components/courses/ModuleAccordion"
import SidebarInstructor from "../../components/instructor/SidebarInstructor"
import ModuleModal from "../../components/modals/ModuleModal"
import ModuleProgressModal from "../../components/modals/ModuleProgressModal"

// Styles
import { useUserContext } from "../../contexts/UserProvider"
import style from "../../styles/coursecard.module.css"
import styles from "../../styles/general.module.css"
import { headers, sweetAlert } from "../../utils/config/config"
import { base_api_url, change_status, course_management, instructor_path, registered_students } from "../../utils/config/paths"
import {
  changeStatusCourses,
  deleteModule,
  fetchCourseById,
  saveModule,
  updateModule,
} from "../../api/instructor/intructor"
import { formatCourseDate, normalizeDate } from "../../utils/dateUtils"

function CourseDetailPage() {
  const { user } = useUserContext()

  const { id } = useParams()
  const navigate = useNavigate()
  const [reloadCourse, setReloadCourse] = useState(false)

  const [course, setCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
  const [currentModule, setCurrentModule] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showModuleProgress, setShowModuleProgress] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", body: "", variant: "success" })
  const [registeredStudents, setRegisteredStudents] = useState([])

  const changeStatusCourse = (courseId) => {
    return fetch(`${base_api_url}${instructor_path}${course_management}${change_status}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        courseId: courseId,
        courseStatus: "INACTIVE",
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error)
        sweetAlert("error", "Error", "No se pudo eliminar el curso.", "", null)
      })
  }

  useEffect(() => {
    const loadCourse = async () => {
      const result = await fetchCourseById(id)

      if (!result.success) {
        setCourse(null)
        setIsLoading(false)
        return
      }

      const courseData = result.data.courseDetails
      const studentsCount = result.data.students

      console.log("effect uno")

      console.log(result.data)

      const mappedCourse = {
        id: courseData.courseId,
        title: courseData.title,
        description: courseData.description,
        image: courseData.bannerPath,
        startDate: courseData.startDate,
        endDate: courseData.endDate,
        price: courseData.price,
        size: courseData.size,
        status: courseData.courseStatus,
        modules:
          courseData.modules?.map((mod) => ({
            moduleId: mod.moduleId,
            title: mod.name,
            order: mod.date,
            description: mod?.description,
            lessons:
              mod.sections?.map((lesson) => ({
                sectionId: lesson.sectionId,
                title: lesson.name,
                description: lesson.description,
                content: lesson.contentUrl,
                type: lesson.contentType,
              })) || [],
          })) || [],
        tags: courseData.categories,
        instructor: courseData.instructor.name,
        studentsCount: studentsCount,
      }

      if (mappedCourse.status === "TO_APPROVE" && mappedCourse.startDate) {
        const courseStartDate = normalizeDate(mappedCourse.startDate) // día completo
        const today = normalizeDate(new Date())

        if (today > courseStartDate) {
          console.log("hoy", today, "inicio", courseStartDate)
          console.log("eliminando curso por la fecha")

          await changeStatusCourse(mappedCourse.id)
          sweetAlert(
            "warning",
            "Curso eliminado",
            "El curso ha sido eliminado porque pasó su fecha de inicio sin ser aprobado",
            "",
            null,
          )
          setTimeout(() => navigate("/inst/courses"), 3000)
          return
        }
      }

      setCourse(mappedCourse)
      setIsLoading(false)
    }

    const loadRegisteredStudents = async () => {
      try {
        const body = { courseId: id }
        const response = await fetch(`${base_api_url}${instructor_path}${course_management}${registered_students}`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body),
        })
        const data = await response.json()
        if (data.type === "SUCCESS") {
          setRegisteredStudents(data.data)
        } else {
          console.log(data.message)
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadCourse()
    loadRegisteredStudents()
  }, [id, navigate])

  const showToastMessage = (title, body, variant = "success") => {
    setToastMessage({ title, body, variant })
    setShowToast(true)
  }

  const handlePublishCourse = async () => {
    if (!course || !course.id) return

    const result = await changeStatusCourses(course.id)

    if (!result.success) {
      sweetAlert("error", "Error", result.error, "", null)
      return
    }

    showToastMessage("Curso enviado", "El curso ha sido enviado para aprobación")

    // Cambiar estado local para bloquear edición
    setCourse((prev) => ({
      ...prev,
      status: "TO_APPROVE",
    }))

    setReloadCourse(true)
  }

  const handleDeleteCourse = () => {
    if (!course) return

    const courses = JSON.parse(localStorage.getItem("courses") || "[]")
    const updatedCourses = courses.filter((c) => c.id != course.id)
    localStorage.setItem("courses", JSON.stringify(updatedCourses))

    showToastMessage("Curso eliminado", "El curso ha sido eliminado exitosamente", "danger")

    window.dispatchEvent(new Event("storage"))

    navigate("/")
  }

  const handleSaveModule = async (module) => {
    if (!course) return

    const isEditing = !!currentModule

    console.log(currentModule)

    const date = new Date();
    const localIsoString = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString(); // Ajuste local

    const body = {
      moduleId: currentModule?.moduleId, // Solo para edición
      name: module.title,
      date: module.order || localIsoString,
      courseId: id,
    }

    const result = isEditing ? await updateModule(body) : await saveModule(body)

    console.log(result)

    if (!result.success) {
      sweetAlert("error", "Error", result.error, "", null)
      return
    }

    showToastMessage(
      isEditing ? "Módulo actualizado" : "Módulo agregado",
      isEditing ? "El módulo ha sido actualizado exitosamente" : "El módulo ha sido agregado exitosamente",
    )

    setIsModuleModalOpen(false)
    setCurrentModule(null)
    setReloadCourse(true)
  }

  const handleEditModule = (module) => {
    setCurrentModule(module)
    setIsModuleModalOpen(true)
  }

  const handleDeleteModule = async (moduleId) => {
    console.log(moduleId)

    const result = await deleteModule(moduleId)

    if (!result.success) {
      sweetAlert("error", "Error", result.error, "", null)
      return
    }

    showToastMessage("Módulo eliminado", "El módulo ha sido eliminado exitosamente", "danger")
    setReloadCourse(true)
  }

  // Función para manejar la visualización del progreso de un módulo
  const handleViewModuleProgress = (moduleIndex) => {
    if (!course || !course.modules || !course.modules[moduleIndex]) return

    // Generar datos de progreso simulados para este módulo
    const moduleProgress = generateModuleProgress(moduleIndex)

    setSelectedModule({
      ...course.modules[moduleIndex],
      progress: moduleProgress,
    })

    setShowModuleProgress(true)
  }

  // Generar datos de progreso simulados para un módulo
  const generateModuleProgress = (moduleIndex) => {
    if (!course || !course.modules || !course.modules[moduleIndex]) return []

    const mockStudents = []
    // Usar el límite de estudiantes del curso o un valor predeterminado
    const numStudents = Math.floor(Math.random() * (course.size || 20)) + 5 // Al menos 5 estudiantes

    for (let i = 1; i <= numStudents; i++) {
      const completed = Math.random() > 0.3 // 70% de probabilidad de completar
      mockStudents.push({
        id: i,
        name: `Estudiante ${i}`,
        email: `estudiante${i}@ejemplo.com`,
        completed,
        progress: completed ? 100 : Math.floor(Math.random() * 80), // Progreso aleatorio para los que no han completado
      })
    }

    return mockStudents
  }

  // Verificar si el curso está en un estado editable
  const isEditable = () => {
    if (!course) return false
    return course.status === "IN_EDITION"
  }

  useEffect(() => {
    if (!reloadCourse) return

    const loadCourse = async () => {
      const result = await fetchCourseById(id)

      if (!result.success) {
        setCourse(null)
        setIsLoading(false)
        return
      }

      const courseData = result.data.courseDetails

      console.log("effect de recargar")

      console.log(courseData)

      const mappedCourse = {
        id: courseData.courseId,
        title: courseData.title,
        description: courseData.description,
        image: courseData.bannerPath,
        startDate: courseData.startDate,
        endDate: courseData.endDate,
        price: courseData.price,
        size: courseData.size,
        status: courseData.courseStatus,
        modules:
          courseData.modules?.map((mod) => ({
            moduleId: mod.moduleId,
            title: mod.name,
            order: mod.date,
            description: mod?.description,
            lessons:
              mod.sections?.map((lesson) => ({
                sectionId: lesson.sectionId,
                title: lesson.name,
                description: lesson.description,
                content: lesson.contentUrl,
                type: lesson.contentType,
              })) || [],
          })) || [],
        tags: courseData.categories,
        instructor: courseData.instructor.name,
      }

      setCourse(mappedCourse)
      setIsLoading(false)
      setReloadCourse(false)
    }

    loadCourse()
  }, [reloadCourse, id])

  if (isLoading) {
    return (
      <Container className="py-4">
        <div className="text-center">Cargando...</div>
      </Container>
    )
  }

  if (!course) {
    return (
      <Container className="py-4">
        <p>Curso no encontrado</p>
        <Button variant="outline-primary" onClick={() => navigate("/inst/courses")} className="mt-3">
          <ArrowLeft className="me-2" /> Volver
        </Button>
      </Container>
    )
  }

  return (
    <>
      <SidebarInstructor />
      <Header userName={user?.name} />
      <section className={styles.content} style={{ backgroundColor: "gray" }}>
        <Button variant="outline-primary" onClick={() => navigate("/inst/courses")} className={`ml-5 ${style.btnBack}`}>
          <ArrowLeft className="me-2" /> Volver
        </Button>
        <Row className="row g-3 mb-4 mt-4 m-4">
          <Col lg={9}>
            <Card className={`mb-4 ${style.cardDetail}`}>
              <Card.Body>
                <Row>
                  <div className="col-md-4 d-flex align-items-stretch">
                    {course.image && (
                      <img
                        src={course.image || "/palceholder.svg"}
                        alt={course.title}
                        className="img-fluid rounded mb-3 mb-md-0 w-100"
                        style={{ objectFit: "contain", maxHeight: "280px" }}
                      />
                    )}
                  </div>
                  <div className="col-md-8">
                    <h3 className="mb-2">{course.title}</h3>
                    <p className={`text-muted mb-2 ${style.cardInfo}`}>{course.description}</p>
                    <div className="mb-3">
                      {course.tags?.map((tag, index) => (
                        <Badge key={index} text="light" className={`py-1 px-2 ${style.cardTag}`}>
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="mb-2">
                      <i className={`bi bi-calendar me-2 ${style.cardIcons}`}></i>
                      {formatCourseDate(course.startDate)} - {formatCourseDate(course.endDate)}
                    </div>
                    <div className="mb-2">
                      <i className={`bi bi-person me-2 ${style.cardIcons}`}></i>
                      Creado por: {course.instructor}
                    </div>
                    <div className="mb-2">
                      <i className={`bi bi-people me-2 ${style.cardIcons}`}></i>
                      Límite de estudiantes: {course.size}
                    </div>
                    <div className="h5 mt-3">${course.price.toFixed(2)} mx</div>
                  </div>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <div className="col-lg-3">
            {/* Card de estado del curso */}
            <CourseStatusCard course={course} onPublishCourse={handlePublishCourse} registeredStudents={registeredStudents} />
          </div>
        </Row>

        {/* Contenido del curso */}
        <div className="col-md-9 d-flex justify-content-between align-items-center mb-4">
          <h5 className={`mb-3 g-3 ${style.contentCourse}`}>Contenido del curso</h5>
          {isEditable() && (
            <Button
              className={`mr-2 ${style.btnAdd}`}
              onClick={() => {
                setCurrentModule(null)
                setIsModuleModalOpen(true)
              }}
            >
              <Plus className={"me-2"} /> Agregar Módulo
            </Button>
          )}
        </div>
        <Col lg={9}>
          {course.modules && course.modules.length > 0 ? (
            <ModuleAccordion
              modules={course.modules}
              onEditModule={handleEditModule}
              onDeleteModule={handleDeleteModule}
              isPublished={!isEditable()}
              course={course}
              onViewProgress={handleViewModuleProgress}
              setReloadCourse={setReloadCourse}
            />
          ) : (
            <p className="text-muted text-center py-4">No hay módulos disponibles. ¡Agrega uno nuevo!</p>
          )}
        </Col>
        {/* Modal para agregar/editar módulos */}
        <ModuleModal
          show={isModuleModalOpen}
          onHide={() => {
            setIsModuleModalOpen(false)
            setCurrentModule(null)
          }}
          onSave={handleSaveModule}
          initialData={currentModule}
        />

        {/* Modal de confirmación para eliminar curso */}
        <Modal show={isDeleteDialogOpen} onHide={() => setIsDeleteDialogOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>¿Estás seguro?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Esta acción no se puede deshacer. Se eliminará permanentemente el curso y todos sus módulos y lecciones.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteCourse}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para ver el progreso de un módulo */}
        <ModuleProgressModal
          show={showModuleProgress}
          onHide={() => {
            setShowModuleProgress(false)
            setSelectedModule(null)
          }}
          module={selectedModule}
          course={course}
        />
        {/* Toast para notificaciones */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastMessage.variant}
          text={toastMessage.variant === "danger" ? "white" : undefined}
          style={{ position: "fixed", top: 20, right: 20 }}
        >
          <Toast.Header>
            <strong className="me-auto">{toastMessage.title}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage.body}</Toast.Body>
        </Toast>
      </section>
      <Footer />
    </>
  )
}

export default CourseDetailPage

