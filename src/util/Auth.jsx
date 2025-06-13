
import { getUsuarioByID } from "../ctrl/UsuarioCtrl";

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

export const removeUsuarioStorage = () => {
    try {
        localStorage.removeItem('id_usuario');
        return window.location.reload();
    } catch (error) {
        console.error('Error al leer localStorage:', error);
        return null;
    }
}

export const AutenticadoC = async () => {
    if (estaAutenticado()) {
        const id = getUsuarioStorage();
        const userData = await getUsuarioByID(id);
        if (!userData) {
            return false
        }
        return userData;
    } else {
        return false
    }
}