import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getUsuarioByCorreo, editarUsuario } from "../../ctrl/UsuarioCtrl"; 
import { buscarProyectosUsuario, updateProyectosUsuario } from "../../ctrl/UsuarioCtrl";
import { getCargos } from "../../ctrl/CargosCtrl";

import { formatearFecha } from "../../util/Fecha";
import { mostrarAlert } from "../../util/Alert";

import "./EditUser.css";

export const EditarUsuarioAdmin = () => {
    const [searchText, setSearchText] = useState(""); 
    const [foundUser, setFoundUser] = useState(null); 
    const [userProyects, setUserProyects] = useState(null);
    const [searchStatus, setSearchStatus] = useState("idle"); 

    const [cargos, setCargos] = useState([]);
    const [cargosP, setCargosP] = useState([]);

    useEffect(() => {
        const fetchCargos = async () => {
        try {
            const fetchedCargos = await getCargos(); 
            const filteredCargos = fetchedCargos.filter(cargo => ![1, 2, 3].includes(cargo.id_cargo));
            setCargos(fetchedCargos);
            setCargosP(filteredCargos);
        } catch (error) {
            console.error("Error fetching careers:", error);
        }
        };

        fetchCargos();
    }, []);

    const buscarUsuarioHandler = async () => {
        setSearchStatus("searching");
        setFoundUser(null);
        setUserProyects(null); // Reset projects when searching

        try {
            const usuarioData = await getUsuarioByCorreo(searchText);

            if (usuarioData) {
            setFoundUser(usuarioData);
            setSearchStatus("found");

            const proyectosData = await buscarProyectosUsuario(usuarioData.id_usuario);
            setUserProyects(proyectosData);
            } else {
            setSearchStatus("not_found");
            }
        } catch (error) {
            console.error("Error al buscar usuario:", error);
            setSearchStatus("error");
        }
    };

    const handleSave = async () => {
        try {
            await editarUsuario(foundUser);

            await Promise.all(
                userProyects.map(async (proyecto) => {
                    await updateProyectosUsuario(foundUser.id_usuario, proyecto);
                })
            );
            await mostrarAlert("success", "¡Información guardada exitosamente!");
        } catch (err) {
            console.error("Error while saving data:", err);
            await mostrarAlert("error", "Hubo un error al guardar los datos. Intenta nuevamente.");
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

        {searchStatus === "searching" && <p className="message">Buscando usuario...</p>}
        {searchStatus === "found" && (
            <div>
                <Row className="info-box">
                    <Col md={12} lg={6} className="information">
                        <p className="label">Nombres</p>
                        <p className="text">{foundUser.nombre}</p>
                        <p className="label">Apellidos</p>
                        <p className="text">{foundUser.apellido}</p>
                        <p className="label">Correo Electrónico</p>
                        <p className="text">{foundUser.correo}</p>
                        <p className="label">Número Telefónico</p>
                        <p className="text">{foundUser.telefono}</p>
                        <p className="label">Carrera</p>
                        <p className="text">{foundUser.carrera}</p>
                        <p className="label">Cumpleaños</p>
                        <p className="text">{formatearFecha(foundUser.cumple)}</p>
                        
                    </Col>
                    <Col md={12} lg={6} className="information">
                        <p className="label">Foto de Perfil</p>
                        <img
                            src={foundUser.foto} 
                            alt={`Imagen usuario ${foundUser.nombre}`} 
                            className="img" 
                        />
                        <p />
                        <p className="label">¿Suscrito?</p>
                        <p className="text">{foundUser.esta_suscrito ? "Si" : "No"}</p>
                    </Col>

                    <hr className="sep"/>

                    <h2>Datos Disponibles para Editar</h2>
                    
                    <Col md={12} lg={3} className="information">
                        <p className="label">Cargo en WIE</p>
                        <select
                            className="cargo-select"
                            value={foundUser.id_cargo}
                            name="cargo"
                            onChange={(e) => {
                            const selectedId = e.target.value;
                            setFoundUser((prevUser) => ({
                                ...prevUser,
                                id_cargo: selectedId,
                            }));
                            }}
                            required
                        >
                            {cargos.map((cargo) => (
                            <option key={cargo.id_cargo} value={cargo.id_cargo}>
                                {cargo.nombre}
                            </option>
                            ))}
                        </select>
                    </Col>
                    <Col md={12} lg={9} className="information">
                        <p className="label">Proyectos Relacionados</p>
                        <div className="links">
                            {userProyects && userProyects.length > 0 ? (
                                userProyects.map((proyecto, idx) => (
                                    <div>
                                        <Link to={`/proyecto/${proyecto.id_proyecto}`} className="mas" key={idx}>
                                            <i class="fa-solid fa-angle-right"></i> {proyecto.nombre_proyecto} 
                                        </Link>
                                        <select
                                            className="cargo-p-select"
                                            value={proyecto.id_cargo}
                                            name="cargo"
                                            onChange={(e) => {
                                            setUserProyects((prevProjects) =>
                                                prevProjects.map((p, index) => {
                                                if (index === idx) { return { ...p, id_cargo: parseInt(e.target.value, 10) }; }
                                                return p;
                                                })
                                            );
                                            }}
                                            required
                                        >
                                            <option value="-1">N/A</option>
                                            {cargosP.map((cargo) => (
                                            <option key={cargo.id_cargo} value={cargo.id_cargo}>
                                                {cargo.nombre}
                                            </option>
                                            ))}
                                        </select>
                                    </div>
                                ))
                            ) : (
                                <p className="no-projects">No hay proyectos asignados.</p>
                            )} 
                        </div>
                    </Col>
                    <button onClick={handleSave}>Guardar</button>
                </Row>
            </div>
        )}
        {searchStatus === "not_found" && (
            <p className="message">No se encontró ningún usuario con ese correo.</p>
        )}
        {searchStatus === "error" && (
            <p className="message">Ocurrió un error al buscar el usuario. Por favor, intenta de nuevo.</p>
        )}
        </Container>
    );
};

export default EditarUsuarioAdmin;