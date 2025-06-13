import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Projects.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import loading from "../resources/loading.gif";
import { getProyectos, buscarProyectos } from "../ctrl/ProyectosCtrl.js";
import { getEstados } from "../ctrl/EstadosCtrl.js";
import { getTags } from "../ctrl/TagsCtrl.js";
import { FotoProyecto } from "../util/Foto.jsx";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
    const [proyectos, setProyectos] = useState([]);
    const [error, setError] = useState(null);
    const [estados, setEstados] = useState([]);
    const [tags, setTags] = useState([]);
    const [texto, setTexto] = useState("");
    const [estadosSeleccionados, setEstadosSeleccionados] = useState([]);
    const [tagsSeleccionados, setTagsSeleccionados] = useState([]);

    useEffect(() => {
        // Fetch estados, tags y proyectos
        const fetchEnriquecido = async () => {
            try {
                setProyectos(await getProyectos());
                const estadosData = await getEstados();
                const tagsData = await getTags();
                setEstados(estadosData);
                setTags(tagsData);
            } catch (err) {
                console.error("Error al cargar estados/tags/proyectos:", err);
                setError("No se pudieron cargar los proyectos destacados.");
            }
        };
        fetchEnriquecido();
    }, []);

    const buscarProyectosHandler = async () => {
        try {
            const proyectosRaw = await buscarProyectos(
                texto,
                estadosSeleccionados,
                tagsSeleccionados
            );
            setProyectos(proyectosRaw);
        } catch (error) {
            setError("Hubo un error al realizar la búsqueda.");
        }
    };

    const toggleEstado = (id) => {
        setEstadosSeleccionados((prev) =>
            prev.includes(id)
                ? prev.filter((estado) => estado !== id)
                : [...prev, id]
        );
    };

    const toggleTag = (id) => {
        setTagsSeleccionados((prev) =>
            prev.includes(id)
                ? prev.filter((tag) => tag !== id)
                : [...prev, id]
        );
    };

    // GSAP animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            // Animación para el encabezado
            gsap.from(".header", {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power3.out",
            });

            // Animación para cada proyecto
            gsap.from(".project-item", {
                opacity: 0,
                y: 50,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: ".projects",
                    start: "top 80%",
                },
            });

            // Animación para la entrada de búsqueda
            gsap.from(".search", {
                opacity: 0,
                y: -30,
                duration: 1,
                ease: "power3.out",
            });

            // Animación para la sección final (propuesta de ideas)
            gsap.from(".idea", {
                opacity: 0,
                scale: 0.9,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".idea",
                    start: "top 90%",
                },
            });
        });

        // Cleanup para evitar problemas de memoria
        return () => ctx.revert();
    }, []);

    return (
        <div className="project">
            <div className="header">
                <h2>Nuestros Proyectos</h2>
                <p className="desc">
                    Descubre los proyectos innovadores en los que trabaja nuestra comunidad para tener un impacto positivo en la ingeniería y la tecnología.
                </p>
            </div>
            <div className="search">
                <input
                    type="text"
                    placeholder="Ingresa el término para buscar"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <div className="button-group">
                    {estados.map((estado) => (
                        <button
                            type="button"
                            key={estado.id_estado}
                            className={`filter-button ${estadosSeleccionados.includes(
                                estado.id_estado
                            )
                                ? "selected"
                                : ""
                                }`}
                            onClick={() => toggleEstado(estado.id_estado)}
                        >
                            {estado.nombre}
                        </button>
                    ))}
                    {tags.map((tag) => (
                        <button
                            type="button"
                            key={tag.id_tag}
                            className={`filter-button ${tagsSeleccionados.includes(tag.id_tag)
                                ? "selected"
                                : ""
                                }`}
                            onClick={() => toggleTag(tag.id_tag)}
                        >
                            {tag.nombre}
                        </button>
                    ))}
                </div>
                <button className="search-button" onClick={buscarProyectosHandler}>
                    <i className="fa-solid fa-magnifying-glass"></i> Buscar
                </button>
            </div>
            <Container fluid className="projects">
                {error && <p className="text-danger">{error}</p>}
                <Row className="justify-content-center">
                    {proyectos.length > 0 ? (
                        proyectos.map((p, i) => {
                            return (
                                <Col xs={10} md={5} xl={3} key={i} className="project-item">
                                    <FotoProyecto proyecto={p} className="img" />
                                    <div className="etiquetas">
                                        <span className="state">{p.estado_nombre}</span>
                                        {p.tags?.map((t) => (
                                            <span className="tag" key={t}>{t}</span>
                                        ))}
                                    </div>
                                    <h3>{p.nombre}</h3>
                                    <p className="desc">{p.descripcion_c}</p>
                                    <Link to={`/proyecto/${p.id_proyecto}`} className="mas">
                                        Ver Más...
                                    </Link>
                                </Col>
                            );
                        })
                    ) : !error ? (
                        <div className="error">
                            <img src={loading} alt="Cargando..." className="loading" />
                            <p className="no-projects">No hay proyectos disponibles en este momento.</p>
                        </div>
                    ) : null}
                </Row>
            </Container>
            <Container fluid className="idea d-flex justify-content-center align-items-center">
                <Col xs={10} md={8} lg={6} className="text-center">
                    <h2>¿Tienes una Idea para un Proyecto?</h2>
                    <p className="desc">
                        Únete a nuestra comunidad y da vida a tus ideas innovadoras.
                    </p>
                    <a
                        href="mailto:wie_fibog@unal.edu.co?subject=Nueva Propuesta para Proyecto WIE&body=..."
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Envia Tu Propuesta
                    </a>
                    <a href="https://forms.gle/ghC6TBedHnNLfMDZ9" target="_blank" rel="noopener noreferrer">
                        Únete a Nuestro Equipo
                    </a>
                </Col>
            </Container>
        </div>
    );
};

export default Projects;