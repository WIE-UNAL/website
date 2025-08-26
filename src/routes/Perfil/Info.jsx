import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getCarreras } from "../../ctrl/CarrerasCtrl";

import { subirFotoUsuario } from "../../ctrl/StorageCtrl";
import { editarUsuario } from "../../ctrl/UsuarioCtrl";
import { addCorreo, removeCorreo } from "../../ctrl/CorreoSuscripcionCtrl";

import { formatearFecha } from "../../util/Fecha";
import { mostrarAlert } from "../../util/Alert";

import "./Info.css"

export const Info = ({ usuario }) => {
    const [isEditing, setIsEditing] = useState(false); 
    const [formData, setFormData] = useState({ ...usuario });
    const [carreras, setCarreras] = useState([]); 
    const [previewImage, setPreviewImage] = useState(formData.foto);

    // Fetch careers on component mount
    useEffect(() => {
        const fetchCarreras = async () => {
        try {
            const fetchedCarreras = await getCarreras(); 
            setCarreras(fetchedCarreras);
        } catch (error) {
            console.error("Error fetching careers:", error);
        }
        };

        fetchCarreras();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            setFormData((prev) => ({
                ...prev,
                nuevaFoto: file,
            }));
        }
    };

    // Save the updated form data
    const handleSave = async () => {
        try {
            if (formData.esta_suscrito) { await addCorreo(formData.correo);
            } else { await removeCorreo(formData.correo); }

            await editarUsuario(formData);

            if (formData.nuevaFoto) { await subirFotoUsuario(formData.nuevaFoto, usuario.id_usuario); }

            setIsEditing(false);
            window.location.reload();
        } catch (err) {
            console.error("Error while saving data:", err);
            await mostrarAlert("error", "Hubo un error al guardar los datos. Intenta nuevamente.");
        }
    };

    if (!usuario) {
        return <p>No user data available</p>;
    }

    return (
        <div>
        <Container fluid className="box-info">
            <h2>Información Personal</h2>
            <Row className="personal">
            {!isEditing ? (
                /* Display User Information */
                <>
                <Col md={12} lg={6} className="information">
                        <p className="label">Nombres</p>
                        <p className="text">{usuario.nombre}</p>
                    </Col>
                    <Col md={12} lg={6} className="information">
                        <p className="label">Apellidos</p>
                        <p className="text">{usuario.apellido}</p>
                    </Col>
                    <Col md={12} lg={6} className="information">
                        <p className="label">Correo Electrónico</p>
                        <p className="text">{usuario.correo}</p>
                    </Col>
                    <Col md={12} lg={6} className="information">
                        <p className="label">Número Telefónico</p>
                        <p className="text">{usuario.telefono}</p>
                    </Col>
                    <Col md={12} lg={6} className="information">
                        <p className="label">Carrera</p>
                        <p className="text">{usuario.carrera}</p>
                    </Col>
                    <Col md={12} lg={6} className="information">
                        <p className="label">Cargo en WIE</p>
                        <p className="text">{usuario.cargo}</p>
                    </Col>
                    <Col md={12} lg={6} className="information">
                        <p className="label">Cumpleaños</p>
                        <p className="text">{formatearFecha(usuario.cumple)}</p>
                    </Col>
                    <Col md={12} lg={6} className="information">
                        <p className="label">¿Suscrito?</p>
                        <p className="text">{usuario.esta_suscrito ? "Si" : "No"}</p>
                    </Col>
                    <Col md={12} lg={6} className="information">
                        <p className="label">Proyectos Relacionados</p>
                        <div className="links">
                            {usuario.proyectos && usuario.proyectos.length > 0 ? (
                                usuario.proyectos.map((proyecto, idx) => (
                                    <Link
                                        to={`/proyecto/${proyecto.id_proyecto}`}
                                        className="mas"
                                        key={idx}
                                    >
                                        <i class="fa-solid fa-angle-right"></i> {proyecto.cargo} de {proyecto.nombre} <br />
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
                            src={usuario.foto} 
                            alt={`Imagen usuario ${usuario.nombre}`} 
                            className="img" 
                        />
                    </Col>
                </>
            ) : (
                /* Editable Form */
                <>
                <Col md={12} lg={6} className="information">
                    <p className="label">Nombres</p>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Apellidos</p>
                    <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Correo Electrónico</p>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Número Telefónico</p>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Cumpleaños</p>
                    <input
                        type="date"
                        name="cumple"
                        value={formData.cumple}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Carrera</p>
                    <select
                        className="carrera-select"
                        value={formData.id_carrera} // Ensure this stores the id (not the name)
                        name="carrera"
                        onChange={(e) => {
                        const selectedId = e.target.value; // Capture the selected id
                        setFormData((prevData) => ({
                            ...prevData,
                            id_carrera: selectedId, // Store the id
                        }));
                        }}
                        required
                    >
                        <option value="">Selecciona una carrera</option>
                        {carreras.map((carrera) => (
                        <option key={carrera.id_carrera} value={carrera.id_carrera}>
                            {carrera.nombre}
                        </option>
                        ))}
                    </select>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">¿Suscrito?</p>
                    <select
                    name="esta_suscrito"
                    value={formData.esta_suscrito ? "Si" : "No"}
                    onChange={(e) =>
                        setFormData({
                        ...formData,
                        esta_suscrito: e.target.value === "Si",
                        })
                    }
                    className="form-control"
                    >
                    <option value="Si">Si</option>
                    <option value="No">No</option>
                    </select>
                </Col>
                <Col md={12} lg={6} className="information">
                    <p className="label">Foto de Perfil</p>
                    <img
                        src={previewImage} 
                        alt={`Imagen usuario ${formData.nombre}`} 
                        className="img" 
                    />
                    <hr />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Col>
                </>
            )}
            </Row>
        
        <hr />
        <div className="botones">
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)}>Editar</button>
            ) : (
                <div>
                    <button onClick={() => setIsEditing(false)}>Cancelar</button>
                    <button onClick={handleSave}>Guardar</button>
                </div>
            )}
        </div>
        </Container>
        </div>
    );
};

export default Info;