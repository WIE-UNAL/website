import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import './LogIn.css';
import { getUsuarioByID } from "../ctrl/UsuarioCtrl";
import { estaAutenticado, getUsuarioStorage } from "../util/Auth";

import loading from "../resources/loading.gif";

export const Perfil = () => {
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                if (estaAutenticado()) {
                    const id = getUsuarioStorage();
                    const userData = await getUsuarioByID(id);
                    
                    if (!userData) {
                        throw new Error('No se encontró el usuario');
                    }
                    
                    setUsuario(userData);
                } else {
                    navigate("/");
                }
            } catch (err) {
                console.error('Error al cargar usuario:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsuario();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="error">
                <img src={loading} alt="Cargando..." className="loading" /> 
                <p className="no-projects">Cargando el Proyecto...</p> 
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <img src={loading} alt="Cargando..." className="loading" /> 
                <p className="no-projects">Ocurrió un Error...</p> 
            </div>
        );
    }

    return (
        <div className="profile">
            <Container className="menu">
                <h2>{usuario.nombre} {usuario.apellido}</h2>
            </Container>
        </div>
    );
};

export default Perfil;