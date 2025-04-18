import { headers } from "../../utils/config/config";
import {
    admin_path,
    base_api_url,
    change_status,
    payment_management,
    registration_management
} from "../../utils/config/paths";

const global_error_message = "Ha ocurrido un error. Por favor intenta de nuevo más tarde.";

// Obtener todos los pagos pendientes
export const fetchPendingPayments = async () => {
    return await fetch(`${base_api_url}${admin_path}${payment_management}pending/all`, {
        method: "GET",
        headers: headers
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.type !== "SUCCESS") {
                return {
                    success: false,
                    error: response.text || global_error_message
                };
            }

            return { success: true, data: response.result };
        })
        .catch((error) => {
            return {
                success: false,
                error: error?.message || global_error_message
            };
        });
};

// Obtener todos los pagos aprobados
export const fetchFinishedPayments = async () => {
    return await fetch(`${base_api_url}${admin_path}${payment_management}finished`, {
        method: "GET",
        headers: headers
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.type !== "SUCCESS") {
                return {
                    success: false,
                    error: response.text || global_error_message
                };
            }

            return { success: true, data: response.result };
        })
        .catch((error) => {
            return {
                success: false,
                error: error?.message || global_error_message
            };
        });
};

// Cambiar el estado del pago (aprobar/rechazar)
export const changePaymentStatus = async (registrationId, registrationStatus) => {
    return await fetch(`${base_api_url}${admin_path}${registration_management}${change_status}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
            registrationId,
            registrationStatus
        })
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.type !== "SUCCESS") {
                return {
                    success: false,
                    error: response.text || global_error_message
                };
            }

            return { success: true, message: response.text };
        })
        .catch((error) => {
            return {
                success: false,
                error: error?.message || global_error_message
            };
        });
};
