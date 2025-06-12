import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import './LogIn.css';
import { getUsuarioByID } from "../ctrl/UsuarioCtrl";
import { estaAutenticado, getUsuarioStorage } from "../util/Auth";

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
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="profile">
            <Container className="menu">
                {usuario && <h2>{usuario.nombre}</h2>}
            </Container>
        </div>
    );
};

export default Perfil;