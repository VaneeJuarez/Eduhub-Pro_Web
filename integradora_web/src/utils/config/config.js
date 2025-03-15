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