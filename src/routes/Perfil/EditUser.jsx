import { useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getUsuarioByCorreo } from "../../ctrl/UsuarioCtrl"; 

import { formatearFecha } from "../../util/Fecha";

import "./EditUser.css";

export const EditarUsuarioAdmin = () => {
  const [searchText, setSearchText] = useState(""); // Renamed for clarity
  const [foundUser, setFoundUser] = useState(null); // Renamed for clarity, stores user object or null
  const [searchStatus, setSearchStatus] = useState("idle"); // 'idle', 'searching', 'found', 'not_found', 'error'

  const buscarUsuarioHandler = async () => {
    setSearchStatus("searching");
    setFoundUser(null); // Clear previous user when starting new search

    try {
      const usuarioData = await getUsuarioByCorreo(searchText); // This should return the user object or null/undefined
      if (usuarioData) {
        setFoundUser(usuarioData);
        setSearchStatus("found");
      } else {
        setSearchStatus("not_found");
      }
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      setSearchStatus("error");
      // Optionally, set an error message state here if you want to display it
    }
  };

  return (
    <Container fluid className="box-edit-user">
      <h2>Editar Información de Usuario</h2>

      <input
        type="text"
        placeholder="Ingresa el correo del usuario"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button className="search-button" onClick={buscarUsuarioHandler}>
        <i className="fa-solid fa-magnifying-glass"></i> Buscar
      </button>

      {searchStatus === "idle" && (
        <p>Ingresa un correo para buscar un usuario.</p>
      )}
      {searchStatus === "searching" && <p>Buscando usuario...</p>}
      {searchStatus === "found" && (
        <div>
            <Row>
                <Col md={12} lg={6} className="information">
                    <p className="label">Nombres</p>
                    <p className="text">{foundUser.nombre}</p>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Apellidos</p>
                    <p className="text">{foundUser.apellido}</p>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Correo Electrónico</p>
                    <p className="text">{foundUser.correo}</p>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Número Telefónico</p>
                    <p className="text">{foundUser.telefono}</p>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Carrera</p>
                    <p className="text">{foundUser.carrera}</p>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Cargo en WIE</p>
                    <p className="text">{foundUser.cargo}</p>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Cumpleaños</p>
                    <p className="text">{formatearFecha(foundUser.cumple)}</p>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">¿Suscrito?</p>
                    <p className="text">{foundUser.esta_suscrito ? "Si" : "No"}</p>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Proyectos Relacionados</p>
                    <div className="links">
                        {foundUser.proyectos && foundUser.proyectos.length > 0 ? (
                            foundUser.proyectos.map((proyecto, idx) => (
                                <Link
                                    to={`/proyecto/${proyecto.id_proyecto}`}
                                    className="mas"
                                    key={idx}
                                >
                                    <i class="fa-solid fa-angle-right"></i> {proyecto.nombre} <br />
                                </Link>
                            ))
                        ) : (
                            <p className="no-projects">No hay proyectos asignados.</p>
                        )} 
                    </div>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Foto de Perfil</p>
                    <img
                        src={foundUser.foto} 
                        alt={`Imagen usuario ${foundUser.nombre}`} 
                        className="img" 
                    />
                </Col>
            </Row>
        </div>
      )}
      {searchStatus === "not_found" && (
        <p>No se encontró ningún usuario con ese correo.</p>
      )}
      {searchStatus === "error" && (
        <p>Ocurrió un error al buscar el usuario. Por favor, intenta de nuevo.</p>
      )}
    </Container>
  );
};

export default EditarUsuarioAdmin;