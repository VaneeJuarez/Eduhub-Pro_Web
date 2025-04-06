import { headers } from "../../utils/config/config";
import { admin_path, all, base_api_url, by_id, change_status, course_management } from "../../utils/config/paths";

// Traer todos los cursos
export const fetchAllCourses = async () => {
    return await fetch(`${base_api_url}${admin_path}${course_management}${all}`, {
        method: "GET",
        headers: headers
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
            console.error("Error fetchAllCourses:", error);
            return { success: false, error: error?.message || global_error_message };
        });
};

// Curso por id
export const fetchCourseById = async (courseId) => {
    return await fetch(`${base_api_url}${admin_path}${course_management}${by_id}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ courseId })
    }).then((response) => response.json())
        .then((response) => {
            console.log(response);

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

// Cambiar el estado del curso aceptar / rechazar
export const changeStatusCourses = async (body) => {
    return await fetch(`${base_api_url}${admin_path}${course_management}${change_status}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
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