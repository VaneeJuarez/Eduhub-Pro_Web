import Swal from 'sweetalert2';

// NO MOVER =>
// Encabezados comunes para todas las peticiones con autenticación
export const headers = {
    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user'))?.jwt,
    "Content-Type": "application/json",
    "Accept": "application/json"
};

// Encabezados comunes para todas las peticiones sin autenticación
export const unlogin = {
    "Content-Type": "application/json",
    "Accept": "application/json"
};
// <= NO MOVER

// Alertas
export function sweetAlert(icon, title, text, redirectUrl, navigate) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        showConfirmButton: false,
        stopKeydownPropagation: true,
        focusConfirm: false,
        scrollbarPadding: false,
        timer: 4000,
        customClass: {
            popup: "my-alert-popup",
        },
    }).then(() => {
        if (redirectUrl !== "") {
            navigate(redirectUrl);
        }
    });
}

export function deleteSweetAlert() {
    return Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
    }).then((result) => {
        return result.isConfirmed;
    });
}
// Alertas Sweet Alert
import Swal from "sweetalert2";

// Eliminar
export const Delete = (onConfirm) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(); // Ejecuta la función de eliminación si el usuario confirma
        Swal.fire("Eliminado", "El registro ha sido eliminado.", "success");
      }
    });
  };
