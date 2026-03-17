import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import "./Proyecto.css";

import { getProyectoById } from "../ctrl/ProyectosCtrl";
import { buscarUsuariosProyecto } from "../ctrl/UsuarioCtrl";
import { getEventTitle } from "../ctrl/vTools";

import { formatearFecha } from "../util/Fecha";

import loading from "../resources/loading.gif";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Proyecto = () => {
    const { id_proyecto } = useParams();
    const [proyecto, setProyecto] = useState(null);
    const [miembros, setMiembros] = useState(null);
    const [, setError] = useState(null);

    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                const fetchedEvento = await getProyectoById(id_proyecto)
                if (fetchedEvento.vtools && fetchedEvento.vtools.length > 0) {
                    const vtoolsConNombres = await Promise.all(
                        fetchedEvento.vtools.map(async (vtoolId) => {
                            const titulo = await getEventTitle(vtoolId);
                            return {
                                id: vtoolId,
                                title: titulo || `Event ${vtoolId}`
                            };
                        })
                    );
                    
                    fetchedEvento.vtools = vtoolsConNombres;
                }
                setProyecto(fetchedEvento);
                setMiembros(await buscarUsuariosProyecto(id_proyecto));
            } catch (err) {
                console.error("Error al cargar el proyecto:", err);
                setError("Hubo un problema al cargar el proyecto.");
            }
        };

        fetchProyecto();
    }, [id_proyecto]);

    // GSAP Animations (igual que el original)
    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".header", { opacity: 0, y: -100, duration: 1, ease: "power2.out" });
            gsap.from(".etiquetas span", { opacity: 0, y: 20, duration: 0.6, stagger: 0.2, ease: "power3.out" });
            gsap.from(".text", { opacity: 0, x: -50, duration: 1, ease: "power2.out" });
            gsap.from(".image", {
                opacity: 0,
                scale: 0.8,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: ".image", start: "top 80%" },
            });
            gsap.from(".information .start-block", {
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.3,
                ease: "power2.out",
                scrollTrigger: { trigger: ".information", start: "top 85%" },
            });
            gsap.from(".progress-bar", {
                width: 0,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: { trigger: ".avance", start: "top 90%" },
            });
        });
        return () => ctx.revert();
    }, []);

    if (!proyecto || !miembros) {
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
                        <Link to="/proyectos" className="back">
                            <i className="fa-solid fa-angles-left"></i> Regresar a Proyectos
                        </Link>
                        <div className="etiquetas">
                            <span className="state">{proyecto.estado_nombre}</span>
                            {proyecto.tags?.map((t) => (
                                <span className="tag" key={t}>{t}</span>
                            ))}
                        </div>
                        <h2>{proyecto.nombre}</h2>
                        <p className="desc">{proyecto.descripcion_c}</p>
                        <a
                            href="https://forms.gle/ghC6TBedHnNLfMDZ9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link"
                        >
                            Únete a Nuestro Equipo
                        </a>
                        <hr />
                    </Col>
                    <Col xs={8} md={3} className="image">
                            <img
                                src={proyecto.foto} 
                                alt={`Imagen proyecto ${proyecto.nombre}`} 
                                className="logo-image" 
                            />
                    </Col>
                </Row>
            </Container>

            <Container fluid className="information">
                <Row className="d-flex justify-content-center align-items-stretch">
                    <Col sm={12} md={7} lg={8} xl={8} className="start-block">
                        <Row className="descripcion mb-3">
                            <h3>Descripción</h3>
                            <p className="desc">{proyecto.descripcion}</p>
                        </Row>
                        <Row className="impacto mb-3">
                            <h3>Impacto y Metas</h3>
                            <p className="desc">{proyecto.impacto}</p>
                        </Row>
                        <Row className="miembros mb-3">
                            <h3>Miembros</h3>
                                {miembros.length > 0 ? (
                                    miembros.map((p, idx) => {
                                        return (
                                            <Row className="members-item mt-2">
                                                <Col sm={3} md={3} lg={2} xl={2} className="start-block">
                                                    <img
                                                        src={p.foto} 
                                                        alt={`Imagen proyecto ${p.nombre}`} 
                                                        className="img" 
                                                    />
                                                </Col>
                                                <Col sm={9} md={9} lg={10} xl={10} className="start-block">
                                                <h4>{p.nombre} {p.apellido}</h4>
                                                <p className="cargo">{p.cargo} de {proyecto.nombre}</p>
                                                <p className="desc">{p.carrera}</p>
                                                <a href={`mailto:${p.correo}`} target="_blank" rel="noopener noreferrer">
                                                    Contactar
                                                </a>
                                                </Col>
                                            </Row>
                                        );
                                    })
                                ) : (
                                    <div className="error">
                                        <p className="no-projects">No hay usuarios disponibles en este momento.</p>
                                    </div>
                                )}
                        </Row>
                    </Col>
                    <Col sm={12} md={5} lg={4} xl={3} className="start-block">
                        <Row className="avance mb-3">
                            <h3>Registros vTools</h3>
                            <ul className="links">
                                {proyecto.vtools && proyecto.vtools.length > 0 ? (
                                    proyecto.vtools.map((vtool) => (
                                        <li className="link" key={vtool.id}>
                                            <a
                                                href={`https://events.vtools.ieee.org/m/${vtool.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {vtool.title}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <p className="desc">No hay registros de vTools disponibles.</p>
                                )}
                            </ul>
                        </Row>
                        <Row className="stats mb-3">
                            <h3>Stats</h3>
                            <p className="desc">Cantidad de Integrantes: {miembros.length}</p>
                            <p className="desc">Creación: {formatearFecha(proyecto.fecha_creacion)}</p>
                            <p className="desc">Avance del Proyecto: </p>
                            <div className="progress-container">
                                <div className="progress-bar" style={{ width: `${proyecto.avance}%` }}>
                                    <span className="progress-text">{proyecto.avance}%</span>
                                </div>
                            </div>
                        </Row>
                        <Row className="unete mb-3">
                            <h3>Únete</h3>
                            <p className="desc">{proyecto.nuevos}</p>
                            <a href="https://forms.gle/ghC6TBedHnNLfMDZ9" target="_blank" rel="noopener noreferrer">
                                Únete a Nuestro Equipo
                            </a>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Proyecto;