import { headers } from "../../utils/config/config";
import { base_api_url, by_id, change_status, course_management, create, instructor_path, module_management, section_management, update } from "../../utils/config/paths";

const global_error_message = "Ocurrió un error inesperado al intentar realizar la acción.";

// Guardar un módulo
export const saveModule = async (body) => {
    return await fetch(`${base_api_url}${instructor_path}${module_management}${create}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    }).then((response) => response.json())
        .then((response) => {
            if (!response.type === "SUCCESS") {
                return { success: false, error: response.text || global_error_message };
            }
            return { success: true, data: response };
        })
        .catch((error) => {
            console.log(error);
            return { success: false, error: error.text || global_error_message };
        });
};

// Editar un módulo
export const updateModule = async (body) => {
    return await fetch(`${base_api_url}${instructor_path}${module_management}${update}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
    }).then((response) => response.json())
        .then((response) => {
            if (!response.type === "SUCCESS") {
                return { success: false, error: response.text || global_error_message };
            }
            return { success: true, data: response };
        })
        .catch((error) => {
            console.log(error);
            return { success: false, error: error.text || global_error_message };
        });
};

// Eliminar módulo
export const deleteModule = (moduleId) => {
    return fetch(`${base_api_url}${instructor_path}${module_management}${change_status}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(
            {
                moduleId: moduleId,
                status: "DELETED"
            }
        ),
    }).then((response) => response.json())
        .then((response) => {
            if (response.type !== "SUCCESS") {
                return { success: false, error: response.text || global_error_message, };
            }
            return { success: true, data: response, };
        })
        .catch((error) => {
            console.error("Error al eliminar el módulo:", error);
            return { success: false, error: global_error_message, };
        });
};

// Curso por id
export const fetchCourseById = async (courseId) => {
    return await fetch(`${base_api_url}${instructor_path}${course_management}${by_id}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ courseId })
    }).then((response) => response.json())
        .then((response) => {
            if (!response.type === "SUCCESS" && !response.result.courseDetails) {
                return { success: false, error: response.text || global_error_message };
            }

            return { success: true, data: response.result };
        })
        .catch((error) => {
            console.error("Error al obtener el curso:", error);
            return { success: false, error: global_error_message };
        });
};

// Crear sección
export const createSection = async (body) => {
    return await fetch(`${base_api_url}${instructor_path}${section_management}${create}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
    }).then((res) => res.json())
        .then((result) => {
            console.log(result);

            if (result.type !== "SUCCESS") {
                return {
                    success: false,
                    error: result.text || global_error_message,
                };
            }
            return { success: true, data: result };
        })
        .catch((error) => {
            console.error(error);
            return {
                success: false,
                error: global_error_message,
            };
        });
};

// Editar sección
export const updateSection = async (body) => {

    return await fetch(`${base_api_url}${instructor_path}${section_management}${update}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
    }).then((res) => res.json())
        .then((result) => {
            console.log(result);
            if (result.type !== "SUCCESS") {
                return {
                    success: false,
                    error: result.text || global_error_message,
                };
            }
            return { success: true, data: result };
        })
        .catch((error) => {
            console.error(error);
            return {
                success: false,
                error: global_error_message,
            };
        });
};

// Eliminar sección
export const deleteSection = async (sectionId) => {
    return await fetch(`${base_api_url}${instructor_path}${section_management}${change_status}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ sectionId: sectionId, status: "INACTIVE" }),
    })
        .then((res) => res.json())
        .then((result) => {
            console.log(result);

            if (result.type !== "SUCCESS") {
                return {
                    success: false,
                    error: result.text || global_error_message,
                };
            }
            return { success: true };
        })
        .catch((error) => {
            console.error(error);
            return {
                success: false,
                error: global_error_message,
            };
        });
};

// Por aprobar un curso
export const changeStatusCourses = async (courseId) => {
    return await fetch(`${base_api_url}${instructor_path}${course_management}${change_status}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ courseId: courseId, courseStatus: "TO_APPROVE" }),
    })
        .then((res) => res.json())
        .then((result) => {
            console.log(result);

            if (result.type !== "SUCCESS") {
                return {
                    success: false,
                    error: result.text || global_error_message,
                };
            }
            return { success: true };
        })
        .catch((error) => {
            console.error(error);
            return {
                success: false,
                error: global_error_message,
            };
        });
};
// api/userApi.js

export const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return await fetch(`${base_api_url}${}${}`, {
        method: "POST",
        body: formData
    }).then(res => res.json())
        .then(response => {
            if (response.type !== "SUCCESS" || !response.result?.url) {
                return { success: false, error: response.text || "No se pudo subir la imagen." };
            }
            return { success: true, url: response.result.url };
        })
        .catch(() => {
            return { success: false, error: "Error inesperado al subir imagen." };
        });
};
