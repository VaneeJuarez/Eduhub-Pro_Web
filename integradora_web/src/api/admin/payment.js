import { headers } from "../../utils/config/config";
import { 
    admin_path, 
    base_api_url, 
    payment_management,
    change_status
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
        console.log("Pending payments response:", response);
        console.log("Pending payments data structure:", JSON.stringify(response));

        if (response.type !== "SUCCESS") {
            return { 
                success: false, 
                error: response.text || global_error_message 
            };
        }

        return { success: true, data: response.result };
    })
    .catch((error) => {
        console.error("Error fetching pending payments:", error);
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
        console.log("Finished payments response:", response);
        console.log("Finished payments data structure:", JSON.stringify(response));

        if (response.type !== "SUCCESS") {
            return { 
                success: false, 
                error: response.text || global_error_message 
            };
        }

        return { success: true, data: response.result };
    })
    .catch((error) => {
        console.error("Error fetching finished payments:", error);
        return { 
            success: false, 
            error: error?.message || global_error_message 
        };
    });
};

// Cambiar el estado del pago (aprobar/rechazar)
export const changePaymentStatus = async (paymentId, status) => {
    return await fetch(`${base_api_url}${admin_path}${payment_management}${change_status}`, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({
            paymentId,
            status
        })
    })
    .then((response) => response.json())
    .then((response) => {
        console.log("Change payment status response:", response);
        console.log("Change payment status data structure:", JSON.stringify(response));

        if (response.type !== "SUCCESS") {
            return { 
                success: false, 
                error: response.text || global_error_message 
            };
        }

        return { success: true, message: response.text };
    })
    .catch((error) => {
        console.error("Error changing payment status:", error);
        return { 
            success: false, 
            error: error?.message || global_error_message 
        };
    });
};
