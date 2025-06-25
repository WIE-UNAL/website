import { useState } from "react";
import { Container } from "react-bootstrap";

import "./EditUser.css"

export const EditarUsuarioAdmin = () => {
    const [texto, setTexto] = useState("");

    const buscarUsuarioHandler = async () => {

    }

    return (
        <Container fluid className="box-info">
            <h2>Editar Proyectos de Usuario</h2>
            <input
                type="text"
                placeholder="Ingresa el correo del usuario"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
            />
            <button className="search-button" onClick={(buscarUsuarioHandler)}>
                <i className="fa-solid fa-magnifying-glass"></i> Buscar
            </button>
        </Container>
    );
};

export default EditarUsuarioAdmin;