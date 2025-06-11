import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import './Proyecto.css';

import loading from "../resources/loading.gif";

import { getProyectoById } from "../ctrl/ProyectosCtrl";
import { procesarProyecto } from "../util/Proyectos";


const Proyecto = () => {
    const { id_proyecto } = useParams(); 
    const [proyecto, setProyecto] = useState(null); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                const proyectosRaw = await getProyectoById(id_proyecto); 
                if (proyectosRaw.length > 0) {
                    const proyectosConDatos = await procesarProyecto(proyectosRaw[0]);
                    setProyecto(proyectosConDatos); 
                } else {
                setError("No se encontró el proyecto solicitado."); 
                }
            } catch (err) {
                console.error("Error al cargar el proyecto:", err);
                setError("Hubo un problema al cargar el proyecto.");
            }
        };

        fetchProyecto();
    }, [id_proyecto]);

    if (error) {
        <div className="error">
            <img src={loading} alt="Cargando..." className="loading" /> 
            <p className="no-projects">Ocurrió un error...</p> 
        </div>
    }

    if (!proyecto) {
        return (
        <div className="error">
            <img src={loading} alt="Cargando..." className="loading" /> 
            <p className="no-projects">Cargando el Proyecto...</p> 
        </div>

    );
    }

    return (
        <div className="proyecto">
            <Container fluid className="header">
                <Row className="start-block justify-content-center align-items-center">
                    <Col xs={10} md={6} className="text">
                        <div className="etiquetas">
                            <span className="state">{proyecto.estado}</span>
                            {proyecto.tags?.map((t) => (
                                <span className="tag">{t}</span>
                            ))}
                        </div>
                        <h2>{proyecto.nombre}</h2>
                        <p className="desc">{proyecto.descripcion_c}</p>
                        <a href="https://forms.gle/ghC6TBedHnNLfMDZ9" target="_blank" rel="noopener noreferrer">
                            Únete a Nuestro Equipo
                        </a>
                        <hr />
                    </Col>
                    <Col xs={8} md={3} className="image">
                        <img src={proyecto.foto} alt={`Imagen del proyecto ${proyecto.nombre}`} className="logo-image" />
                    </Col>
                </Row>
            </Container>


            <Container fluid className="information">
                <Row className="d-flex justify-content-center align-items-stretch"> {/* Asegura diseño horizontal */}
                    <Col xs={12} md={8} className="start-block">
                    <Row className="text mb-3">
                        <h3>Descripción</h3>
                        <p className="desc">{proyecto.descripcion}</p>
                    </Row>
                    <Row className="text mb-3">
                        <h3>Impacto y Metas</h3>
                        <p className="desc">{proyecto.impacto}</p>
                    </Row>
                    <Row className="text mb-3">
                        <h3>Miembros</h3>
                        <p className="desc">{proyecto.miembros}</p>
                    </Row>
                    </Col>

                    <Col xs={12} md={3} className="start-block">
                    <Row className="text mb-3">
                        <h3>Avance</h3>
                        <p className='desc'> {proyecto.avance} </p>
                    </Row>
                    <Row className="text mb-3">
                        <h3>Stats</h3>
                        <div className="desc">
                        <span>Cantidad de Miembros</span>
                        <span>15</span>
                        </div>
                        <div className="desc">
                        <span>Duración</span>
                        <span>15</span>
                        </div>
                    </Row>
                    <Row className="text mb-3">
                        <h3>Únete</h3>
                        <p className="desc">{proyecto.nuevos}</p>
                        <p className="desc">{proyecto.habilidades}</p>
                    </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Proyecto;