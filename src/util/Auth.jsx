
export const setUsuarioStorage = (idUsuario) => {
    try {
        localStorage.setItem('id_usuario', idUsuario);
        return true;
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        return false;
    }
};

export const getUsuarioStorage = () => {
    try {
        return localStorage.getItem('id_usuario');
    } catch (error) {
        console.error('Error al leer localStorage:', error);
        return null;
    }
};

export const estaAutenticado = () => {
    const idUsuario = getUsuarioStorage();
    return (!!idUsuario || idUsuario===undefined);
};