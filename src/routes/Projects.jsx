import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Projects.css';

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
    const [estados, setEstados] = useState([]); // Lista de estados
    const [tags, setTags] = useState([]); // Lista de tags
    const [texto, setTexto] = useState(""); // Texto para buscar
    const [estadosSeleccionados, setEstadosSeleccionados] = useState([]); // Estados seleccionados
    const [tagsSeleccionados, setTagsSeleccionados] = useState([]); // Tags seleccionados

    useEffect(() => {
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
            prev.includes(id) ? prev.filter((estado) => estado !== id) : [...prev, id]
        );
    };

    const toggleTag = (id) => {
        setTagsSeleccionados((prev) =>
            prev.includes(id) ? prev.filter((tag) => tag !== id) : [...prev, id]
        );
    };

    return (
        <div className="project">
            <div className="header">
                <h2>Nuestros Proyectos</h2>
                <p className="desc">
                    Descubre los proyectos innovadores en los que trabaja nuestra comunidad para tener un impacto positivo en la ingeniería y la tecnología. 
                    Desde la investigación hasta apoyo en fundaciones, estamos construyendo juntos el futuro.
                </p>
            </div>

            <div className="search">
                <input type="text" placeholder="Ingresa el término para buscar" value={texto} onChange={(e) => setTexto(e.target.value)}/>

                <div className="button-group">
                {estados.map((estado) => (
                    <button
                        type="button"
                        key={estado.id_estado}
                        className={`filter-button ${estadosSeleccionados.includes(estado.id_estado) ? "selected" : ""}`}
                        onClick={() => toggleEstado(estado.id_estado)}
                    >
                        {estado.nombre}
                    </button>
                ))}
                {tags.map((tag) => (
                    <button
                        type="button"
                        key={tag.id_tag}
                        className={`filter-button ${tagsSeleccionados.includes(tag.id_tag) ? "selected" : ""}`}
                        onClick={() => toggleTag(tag.id_tag)}
                    >
                    {tag.nombre}
                    </button>
                ))}
                </div>

                <button className="search-button" onClick={buscarProyectosHandler}>
                <i class="fa-solid fa-magnifying-glass"></i> Buscar
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
                                        <span className="tag">{t}</span>
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
                    ) : ( null )}
                </Row>
            </Container>

            <div className="idea">
                <h2>¿Tienes una Idea para un Proyecto?</h2>
                <p className="desc">
                    Únete a nuestra comunidad y da vida a tus ideas innovadoras. Siempre 
                    estamos buscando ingenieras apasionadas que lideren nuevas iniciativas.
                </p>
                <a href="mailto:wie_fibog@unal.edu.co?subject=Nueva Propuesta para Proyecto WIE&body=Hola equipo WIE,%0D%0A%0D%0AQuisiera compartir con ustedes esta idea que tengo para un proyecto. %0D%0AMi propuesta se enfoca en [Explica tu idea aquí].%0D%0A%0D%0AEstoy emocionado(a) por discutir los detalles y colaborar con ustedes.%0D%0A%0D%0A¡Espero su respuesta!%0D%0A%0D%0AAtentamente,%0D%0A[Tu Nombre Aquí]" target="_blank" rel="noopener noreferrer">
                    Envia Tu Propuesta
                </a>
                <a href="https://forms.gle/ghC6TBedHnNLfMDZ9" target="_blank" rel="noopener noreferrer">
                    Únete a Nuestro Equipo
                </a>

            </div>
        </div>
    );
};

export default Projects;