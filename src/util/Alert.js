import Swal from 'sweetalert2'

export const mostrarAlert = (tipo, mensaje) => {
    const configuracion = {
        success: {
            title: '¡Éxito!',
            icon: 'success',
            confirmButtonColor: '#28a745',
            customClass: {
                popup: 'alert-popup',
                title: 'alert-title',
                htmlContainer: 'alert-message',
                confirmButton: 'alert-button alert-button-success',
                icon: 'alert-icon',
            }
        },
        error: {
            title: '¡Error!',
            icon: 'error',
            confirmButtonColor: '#dc3545',
            customClass: {
                popup: 'alert-popup',
                title: 'alert-title',
                htmlContainer: 'alert-message',
                confirmButton: 'alert-button alert-button-error',
                icon: 'alert-icon'
            }
        },
        warning: {
            title: '¡Atención!',
            icon: 'warning',
            confirmButtonColor: '#ffc107',
            customClass: {
                popup: 'alert-popup',
                title: 'alert-title',
                htmlContainer: 'alert-message',
                confirmButton: 'alert-button alert-button-warning',
                icon: 'alert-icon'
            }
        }
    };

    return Swal.fire({
        ...configuracion[tipo],
        text: mensaje,
        confirmButtonText: 'Aceptar',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
};

export default mostrarAlert;