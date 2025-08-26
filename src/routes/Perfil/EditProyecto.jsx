import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";

import { buscarProyectosLider } from "../../ctrl/ProyectosCtrl";
import { getEstados } from "../../ctrl/EstadosCtrl";
import { getTags } from "../../ctrl/TagsCtrl";

import  { MultiTagSelector } from "../../components/MultiSelect";
import  { VToolsManager } from "../../components/vTools";

import { Link } from "react-router-dom";

import { formatearFecha } from "../../util/Fecha";
import { mostrarAlert } from "../../util/Alert";

import loading from "../../resources/loading.gif";
import "./EditProyecto.css";

export const EditarProyectoAdmin = ( idUsuario ) => {
    const [proyectos, setProyectos] = useState([]);
    const [estados, setEstados] = useState([]);
    const [tags, setTags] = useState([]);
    const [state, setState] = useState("view");
    const [proyecto, setProyecto] = useState([]);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const fetchedEventos = await buscarProyectosLider(idUsuario); 
                setProyectos(fetchedEventos);
                const fetchedEstados = await getEstados();
                setEstados(fetchedEstados);
                const fetchedTags = await getTags();
                setTags(fetchedTags);
            } catch (error) {
                console.error("Error fetching careers:", error);
            }
        };

        fetchEventos();
    }, [idUsuario]);

    if (!proyectos || proyectos.length === 0) {
        return (
            <div className="error">
                <img src={loading} alt="Cargando..." className="loading" />
                <p className="no-projects">Cargando los proyectos...</p>
            </div>
        );
    }

    const handleEdit = (project) => {
        setState("edit");
        setProyecto(project);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProyecto((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    return (
        <Container fluid className="box-edit-proyecto">
            <h2>Editar Información de proyectos</h2>
            {state === "view" ? (
                proyectos.length > 0 ? (
                    proyectos.map((p, i) => (
                        <Row className="proyectos" key={i}>
                            <Col xs={10} md={8} className="project-item">
                                <span className="state">{p.estado_nombre}</span>
                                <h3>{p.nombre}</h3>
                                <p className="text">{p.descripcion_c}</p>
                                <p className="text">
                                    <i className="fa-solid fa-users-line"></i> {p.miembros_count} Integrantes
                                </p>
                                <p className="text">
                                    <i className="fa-solid fa-calendar-days"></i> {formatearFecha(p.fecha_creacion)}
                                </p>
                                <Link to={`/proyecto/${p.id_proyecto}`} className="mas">
                                    Ir al Proyecto...
                                </Link>
                                <hr />
                            </Col>
                            <Col xs={10} md={4} className="project-item">
                                <img
                                    src={p.foto}
                                    alt={`Imagen proyecto ${p.nombre}`}
                                    className="img"
                                />
                            </Col>
                            <div className="progress-container">
                                <div className="progress-bar" style={{ width: `${p.avance}%` }}>
                                    <span className="progress-text">{p.avance}%</span>
                                </div>
                            </div>
                            <button onClick={() => handleEdit(p)}>Editar</button>
                        </Row>
                    ))
                ) : (
                    <p>Sin proyectos asignados</p>
                )
            ) : state === "edit" ? (
                <div>
                    <hr />        
                    <Container fluid className="information">
                        <Row className="d-flex justify-content-center align-items-stretch">
                                <Row className="descripcion mb-3">
                                    <h3>Imagen</h3>
                                    <img
                                        src={proyecto.foto} 
                                        alt={`Imagen proyecto ${proyecto.nombre}`} 
                                        className="logo" 
                                    />
                                </Row>
                                <Row className="descripcion mb-3">
                                    <h3>Nombre</h3>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={proyecto.nombre}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Ingresa el nombre del evento"
                                    />
                                    <p className="counter">{proyecto.nombre.length}/50</p>
                                </Row>
                                <Row className="descripcion mb-3">
                                    <h3>Descripción Corta</h3>
                                    <input
                                        type="text"
                                        name="descripcion_c"
                                        value={proyecto.descripcion_c}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Ingresa una descripción corta para tu evento"
                                    />
                                    <p className="counter">{proyecto.descripcion_c.length}/200</p>
                                </Row>
                                <Row className="descripcion mb-3">
                                    <h3>Estado</h3>
                                        <select
                                            name="estado"
                                            value={proyecto.estado}
                                            onChange={(e) =>
                                                setProyecto({
                                                    ...proyecto,
                                                    estado: e.target.value,
                                                })
                                            }
                                            className="form-control"
                                        >
                                            <option value="">Selecciona el estado del evento</option>
                                            {estados.map((estado) => (
                                                <option key={estado.id_estado} value={estado.id_estado}>
                                                    {estado.nombre}
                                                </option>
                                            ))}
                                        </select>
                                </Row>
                                <Row className="descripcion mb-3">
                                    <h3>Etiquetas</h3>
                                    {console.log(tags, proyecto.tags_ids)}
                                        <MultiTagSelector 
                                            tags={tags}
                                            proyecto={proyecto}
                                            setProyecto={setProyecto}
                                            className="my-custom-class"
                                        />
                                    <hr />
                                </Row>
                                <Row className="descripcion mb-3">
                                    <h3>Descripción</h3>
                                    <textarea
                                        type="text"
                                        name="descripcion"
                                        value={proyecto.descripcion}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Ingresa una descripción corta para tu evento"
                                    />
                                </Row>
                                <Row className="impacto mb-3">
                                    <h3>Impacto y Metas</h3>
                                    <textarea
                                        type="text"
                                        name="impacto"
                                        value={proyecto.impacto}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Ingresa el impacto que tendrá tu evento"
                                    />
                                </Row>
                                <Row className="avance mb-3">
                                    <h3>Registros vTools</h3>
                                    <VToolsManager
                                        vtools={proyecto.vtools}
                                        proyecto={proyecto}
                                        setProyecto={setProyecto}
                                        onVToolsChange={(updatedVTools) => {
                                            console.log('vTools actualizados:', updatedVTools);
                                        }}
                                    />
                                </Row>
                                <Row className="stats mb-3">
                                    <h3>Creación</h3>
                                        <input
                                            type="date"
                                            name="cumple"
                                            value={proyecto.fecha_creacion}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                </Row>
                                <Row className="stats mb-3">
                                    <h3>Avance del Proyecto: </h3>
                                        <input
                                            type="number"
                                            name="avance"
                                            value={proyecto.avance}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value, 10);
                                                handleInputChange(e); // Función estándar para actualizar el esta5
                                            }}
                                            min="0"
                                            max="100"
                                            step="1" // Solo enteros
                                            className="form-control"
                                            placeholder="Ingresa un porcentaje (0-100)"
                                        />
                                    <div className="progress-container">
                                        <div className="progress-bar" style={{ width: `${proyecto.avance}%` }}>
                                            <span className="progress-text">{proyecto.avance}%</span>
                                        </div>
                                    </div>
                                </Row>
                                <Row className="unete mb-3">
                                    <h3>Únete</h3>
                                    <textarea
                                        type="text"
                                        name="nuevos"
                                        value={proyecto.nuevos}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Ingresa un mensaje para los interesados en unirse"
                                    />
                                </Row>
                                <Row className="unete mb-3">
                                    <h3>¿Evento Destacado?</h3>
                                    <select
                                        name="destcado"
                                        value={proyecto.destacado ? "Si" : "No"}
                                        onChange={(e) =>
                                            setProyecto({
                                            ...proyecto,
                                            destacado: e.target.value === "Si",
                                            })
                                        }
                                        className="form-control"
                                        >
                                        <option value="Si">Si</option>
                                        <option value="No">No</option>
                                    </select>
                                </Row>                                
                        </Row>
                    </Container>
                    
                </div>
            ) : (
                <p>Error en el estado</p>
            )}
        </Container>
    );
};

export default EditarProyectoAdmin;