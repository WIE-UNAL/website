import { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";

import { buscarProyectosLider, updateProyecto, createProyecto, deleteProyecto } from "../../ctrl/ProyectosCtrl";
import { getEstados } from "../../ctrl/EstadosCtrl";
import { getTags, addTagToProject, removeTagFromProject } from "../../ctrl/TagsCtrl";
import { subirFotoProyecto, getDefaultProyect } from "../../ctrl/StorageCtrl";
import { addLiderProyecto } from "../../ctrl/UsuarioCtrl";
import { getEventTitle } from "../../ctrl/vTools";

import  { MultiTagSelector } from "../../components/MultiSelect";
import  { VToolsManager } from "../../components/vTools";

import { Link } from "react-router-dom";

import { formatearFecha } from "../../util/Fecha";
import { mostrarAlert, mostrarConfirmacion } from "../../util/Alert";

import loading from "../../resources/loading.gif";
import "./EditProyecto.css";

const initialProject = {
    nombre: "",
    descripcion_c: "",
    descripcion: "",
    impacto: "",
    avance: 0,
    nuevos: "",
    destacado: false,
    estado: "",
    vtools: [],
    tags_ids: [],
    fecha_creacion: new Date().toISOString().slice(0, 10),
    foto: ""
};

export const EditarProyectoAdmin = (idUsuario) => {
    const [proyectos, setProyectos] = useState([]);
    const [estados, setEstados] = useState([]);
    const [tags, setTags] = useState([]);
    const [state, setState] = useState("view");
    const [proyecto, setProyecto] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        const fetchEventos = async () => {
        try {
            const fetchedEventos = await buscarProyectosLider(idUsuario);
            for (const evento of fetchedEventos) {
                if (evento.vtools && evento.vtools.length > 0) {
                    const vtoolsConNombres = await Promise.all(
                        evento.vtools.map(async (vtoolId) => {
                            const titulo = await getEventTitle(vtoolId);
                            return {
                                id: vtoolId,
                                title: titulo || `Event ${vtoolId}`
                            };
                        })
                    );
                    
                    evento.vtools = vtoolsConNombres;
                }
            }
            setProyectos(fetchedEventos);
            const fetchedEstados = await getEstados();
            setEstados(fetchedEstados);
            const fetchedTags = await getTags();
            setTags(fetchedTags);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        };
        fetchEventos();
    }, [idUsuario]);
    if (!proyectos) {
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
        setPreviewImage('');
    };

    const handleNewProject = () => {
        setProyecto({
            ...initialProject,
            foto: getDefaultProyect()
        });
        setPreviewImage('');
        setState("create");
    };

    const handleDelete = async (id_proyecto, nombre) => {
        const result = await mostrarConfirmacion(
            `Esta acción eliminará permanentemente el evento "${nombre}". Esta acción no se puede deshacer.`,
            '¿Eliminar evento?'
        );
        if (result.isConfirmed) {
            try {
                await deleteProyecto(id_proyecto);
                setProyectos(prev => prev.filter(p => p.id_proyecto !== id_proyecto));
                await mostrarAlert("success", "¡Evento eliminado correctamente!");
            } catch (error) {
                console.error("Error al eliminar evento:", error);
                await mostrarAlert("error", "No se pudo eliminar el evento. Intenta de nuevo.");
            }
        }
        setState("view");
    };

    const handleSave = async () => {
        try {
            let nuevoProyectoId = proyecto.id_proyecto;
            const vtoolsIds = proyecto.vtools ? proyecto.vtools.map(vtool => vtool.id) : [];
            if (state === "create") {
                const nuevo = await createProyecto(proyecto, vtoolsIds);
                nuevoProyectoId = nuevo.id_proyecto;
                if (proyecto.nuevaFoto) { await subirFotoProyecto(proyecto.nuevaFoto, nuevoProyectoId);      }

                for (const tagId of proyecto.tags_ids) {
                    await addTagToProject(nuevoProyectoId, tagId);
                }

                setProyectos(prev => [...prev, { ...proyecto, id_proyecto: nuevoProyectoId }]);
                await addLiderProyecto(idUsuario.idUsuario, nuevoProyectoId);
                await mostrarAlert("success", "¡Proyecto creado exitosamente!");
            } else {
                
                await updateProyecto(proyecto.id_proyecto, proyecto, vtoolsIds);
                for (const tag of tags) {
                    if (proyecto.tags_ids.includes(tag.id_tag)) {
                        await addTagToProject(proyecto.id_proyecto, tag.id_tag);
                    } else {
                        await removeTagFromProject(proyecto.id_proyecto, tag.id_tag);
                    }
                }
                if (proyecto.nuevaFoto) {
                    await subirFotoProyecto(proyecto.nuevaFoto, proyecto.id_proyecto);
                }
                await mostrarAlert("success", "¡Información guardada exitosamente!");
            }
            handleReturn();
        } catch (err) {
            console.error("Error while saving data:", err);
            await mostrarAlert("error", "Hubo un error al guardar los datos. Intenta nuevamente.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProyecto((prevData) => ({
        ...prevData,
        [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        setPreviewImage(URL.createObjectURL(file));
        setProyecto((prev) => ({
            ...prev,
            nuevaFoto: file,
        }));
        }
    };

    const handleReturn = async () => {
        setState("view");
        setProyecto(null);
        setPreviewImage('');
        const fetchedEventos = await buscarProyectosLider(idUsuario);
        for (const evento of fetchedEventos) {
            if (evento.vtools && evento.vtools.length > 0) {
                const vtoolsConNombres = await Promise.all(
                    evento.vtools.map(async (vtoolId) => {
                        const titulo = await getEventTitle(vtoolId);
                        return {
                            id: vtoolId,
                            title: titulo || `Event ${vtoolId}`
                        };
                    })
                );
                
                evento.vtools = vtoolsConNombres;
            }
        }
        console.log("Fetched updated projects:", fetchedEventos);
        setProyectos(fetchedEventos);
    };

    return (
        <Container fluid className="box-edit-proyecto">
        {state === "view" && (
            <>
            <h2>Editar Información de proyectos</h2>
            <button onClick={handleNewProject}>Crear Nuevo Evento</button>
            {proyectos.length > 0 ? (
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
            )}
            </>
        )}
        {(state === "edit" || state === "create") && (
            <div>
            <hr />
            <Container fluid className="information">
                <h2>{state === "create" ? "Nuevo Evento" : "Editar Proyecto"}</h2>
                <Row className="d-flex justify-content-center align-items-stretch">
                <Row className="descripcion mb-3">
                    <h3>Imagen</h3>
                    <img
                        src={previewImage || proyecto.foto}
                        alt={`Imagen proyecto ${proyecto.nombre}`}
                        className="logo"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control"
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
                        setProyecto(prev => ({ ...prev, vtools: updatedVTools }));
                    }}
                    />
                </Row>
                <Row className="stats mb-3">
                    <h3>Creación</h3>
                    <input
                    type="date"
                    name="fecha_creacion"
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
                        if (value >= 0 && value <= 100) handleInputChange(e);
                    }}
                    min="0"
                    max="100"
                    step="1"
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
                    name="destacado"
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
                <Row className="unete mb-3">
                    <button onClick={handleSave}>
                    {state === "create" ? "Crear Evento" : "Guardar Cambios"}
                    </button>
                    {state === "edit" && (
                        <button 
                            onClick={() => handleDelete(proyecto.id_proyecto, proyecto.nombre)} 
                            style={{marginLeft: 8, background:'#db3939', color:'#fff'}}
                        >
                            Eliminar
                        </button>
                    )}
                    <button onClick={handleReturn}>Cancelar</button>
                </Row>
                </Row>
            </Container>
            </div>
        )}
        </Container>
    );
};

export default EditarProyectoAdmin;