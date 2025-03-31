import { headersUpload } from "../../utils/config/config";
import { base_api_url, storage_path, upload } from "../../utils/config/paths";

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
