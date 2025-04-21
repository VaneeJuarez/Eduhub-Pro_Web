import { headers } from "../../utils/config/config";
import { all, attendance_management, base_api_url, by_id, change_status, course_management, create, instructor_path, module_management, profile, section_management, storage_path, support, update, update_profile, upload, user_management } from "../../utils/config/paths";

const global_error_message = "Ha ocurrido un error. Por favor intenta de nuevo más tarde.";

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
            if (result.type !== "SUCCESS") {
                return {
                    success: false,
                    error: result.text || global_error_message,
                };
            }
            return { success: true, data: result };
        })
        .catch((error) => {
            return {
                success: false,
                error: global_error_message,
            };
        });
};

// Editar sección
export const updateSection = async (body) => {
    console.log(body);

    return await fetch(`${base_api_url}${instructor_path}${section_management}${update}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
    }).then((res) => res.json())
        .then((result) => {
            if (result.type !== "SUCCESS") {
                return {
                    success: false,
                    error: result.text || global_error_message,
                };
            }
            return { success: true, data: result };
        })
        .catch((error) => {
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
            if (result.type !== "SUCCESS") {
                return {
                    success: false,
                    error: result.text || global_error_message,
                };
            }
            return { success: true };
        })
        .catch((error) => {
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
            if (result.type !== "SUCCESS") {
                return {
                    success: false,
                    error: result.text || global_error_message,
                };
            }
            return { success: true };
        })
        .catch((error) => {
            return {
                success: false,
                error: global_error_message,
            };
        });
};

// Subir foto de perfil
export const uploadProfilePhoto = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return await fetch(`${base_api_url}${storage_path}${upload}`, {
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

// Soporte
export const sendSupportMessage = async (fullName, email, comment) => {
    const params = new URLSearchParams({
        fullName,
        email,
        description: comment
    });
    return await fetch(`${base_api_url}${instructor_path}${user_management}${support}?${params.toString()}`, {
        method: "POST",
        headers: headers
    }).then((response) => response.json())
        .then((response) => {
            if (response.type !== "SUCCESS") {
                if (typeof response === "object" && !response.text) {
                    const errorMessages = Object.values(response).join("\n");
                    return {
                        success: false,
                        error: errorMessages,
                    };
                }

                if (response.text) {
                    return { success: false, error: response.text };
                }

                return { success: false, error: global_error_message, };
            }
            return { success: true, data: response, };
        })
        .catch((error) => {
            return { success: false, error: error?.text || global_error_message, };
        });
};

// Obtener perfil del instructor
export const getInstructorProfile = async (userId) => {
    return await fetch(`${base_api_url}${instructor_path}${user_management}${profile}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ userId: userId }),
    }).then((res) => res.json())
        .then((response) => {
            // Verificamos que response.type sea SUCCESS
            if (response.type !== "SUCCESS") {
                return {
                    success: false,
                    error: response.text || global_error_message,
                };
            }
            // Retornamos el response completo o solo una parte
            return { success: true, data: response };
        })
        .catch((error) => {
            return { success: false, error: global_error_message };
        });
};

// Actualizar perfil
export const updateInstructorProfile = async (body) => {
    return await fetch(`${base_api_url}${instructor_path}${user_management}${update_profile}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
    }).then((res) => res.json())
        .then((response) => {
            if (response.type !== "SUCCESS") {
                return {
                    success: false,
                    error: response.text || global_error_message,
                };
            }
            return { success: true, data: response };
        })
        .catch((error) => {
            return { success: false, error: global_error_message };
        });
};

export const fetchStudentProgress = async (moduleId, courseId) => {
    console.log("\nPETICION ", moduleId, courseId);

    return await fetch(`${base_api_url}${instructor_path}${attendance_management}${all}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(
            {
                moduleId: moduleId,
                courseId: courseId
            }
        )
    }).then((response) => response.json())
        .then((response) => {
            console.log(response);

            if (response.type !== "SUCCESS") {
                if (typeof response === "object" && !response.text) {
                    const errorMessages = Object.values(response).join("\n");
                    return { success: false, error: errorMessages };
                }

                if (response.text) {
                    return { success: false, error: response.text };
                }

                return { success: false, error: global_error_message };
            }

            return { success: true, data: response.result };
        })
        .catch((error) => {
            return { success: false, error: error?.message || global_error_message };
        });
};
