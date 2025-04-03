import { headersUpload, unlogin } from "../../utils/config/config";
import { auth_path, base_api_url, request_reset, reset, storage_path, upload } from "../../utils/config/paths";

// Subir contenido multimedia (video, imagen o pdf)
export const uploadFile = (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    return fetch(`${base_api_url}${storage_path}${upload}`, {
        method: "POST",
        headers: headersUpload,
        body: formDataUpload,
    })
        .then((res) => {
            if (!res.ok) {
                return res.text().then((errorText) => ({
                    success: false,
                    error: errorText || "Error desconocido al subir el archivo.",
                }));
            }
            return res.text().then((url) => ({
                success: true,
                data: url,
            }));
        })
        .catch((error) => {
            console.error("Error en la subida de contenido:", error);
            return {
                success: false,
                error: "No se pudo subir el archivo al servidor.",
            };
        });
};

// Enviar código de recuperación
export const sendRecoveryCode = async (email) => {
    return await fetch(`${base_api_url}${auth_path}${request_reset}`, {
        method: "POST",
        headers: unlogin,
        body: JSON.stringify({ email: email })
    }).then(res => res.json())
        .then(response => {
            if (response.type !== "SUCCESS") {
                return { success: false, error: response.text || global_error_message };
            }
            return { success: true };
        })
        .catch(error => {
            console.error("Error al enviar el código:", error);
            return { success: false, error: global_error_message };
        });
};

// Restaurar contraseña
export const restorePassword = async (email, newPassword, recoveryCode) => {
    return await fetch(`${base_api_url}${auth_path}${reset}`, {
        method: "PUT",
        headers: unlogin,
        body: JSON.stringify(
            {
                email: email,
                password: newPassword,
                code: recoveryCode
            }
        )
    }).then(res => res.json())
        .then(response => {
            if (response.type !== "SUCCESS") {
                return { success: false, error: response.text || global_error_message };
            }
            return { success: true };
        })
        .catch(error => {
            console.error("Error al restaurar contraseña:", error);
            return { success: false, error: global_error_message };
        });
};
