import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Miembros.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import loading from "../resources/loading.gif";
import { getUsuarios, buscarUsuarios } from "../ctrl/UsuarioCtrl.js";
import { getProyectos } from "../ctrl/ProyectosCtrl.js";


gsap.registerPlugin(ScrollTrigger);

const Miembros = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [, setError] = useState(null);
    const [proyectos, setProyectos] = useState([]);
    const [texto, setTexto] = useState("");
    const [proyectosSeleccionados, setProyectosSeleccionados] = useState([]);

    useEffect(() => {
        // Fetch proyectos, tags y usuarios
        const fetchEnriquecido = async () => {
            try {
                setUsuarios(await getUsuarios());
                setProyectos(await getProyectos());
            } catch (err) {
                console.error("Error al cargar proyectos/usuarios:", err);
                setError("No se pudieron cargar los usuarios.");
            }
        };
        fetchEnriquecido();
    }, []);

    const buscarusuariosHandler = async () => {
        try {
            const usuariosRaw = await buscarUsuarios( 
                texto,
                proyectosSeleccionados
            );
            setUsuarios(usuariosRaw);
        } catch (error) {
            setError("Hubo un error al realizar la búsqueda.");
        }
    };

    const toggleProyecto = (id) => {
        setProyectosSeleccionados((prev) =>
            // eslint-disable-next-line
            prev.includes(id) ? prev.filter((id) => id !== id) : [...prev, id]
        );
    };

    return (
        <div className="members">
            <div className="header">
                <h2>Nuestros Increible Equipo</h2>
                <p className="desc">
                    Conoce a las apasionadas ingenieras y los apasiados ingenieros que impulsan la 
                    innovación, fomentan la comunidad y dan forma al futuro de la tecnología en la UNAL.
                </p>
            </div>
            <div className="search">
                <input
                    type="text"
                    placeholder="Ingresa el nombre o apellido para buscar"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
                <div className="button-group">
                    {proyectos.map((p) => (
                        <button
                            type="button"
                            key={p.id_estado}
                            className={`filter-button ${proyectosSeleccionados.includes(
                                p.id_proyecto
                            )
                                ? "selected"
                                : ""
                                }`}
                            onClick={() => toggleProyecto(p.id_proyecto)}
                        >
                            {p.nombre}
                        </button>
                    ))}
                </div>
                <button className="search-button" onClick={buscarusuariosHandler}>
                    <i className="fa-solid fa-magnifying-glass"></i> Buscar
                </button>
            </div>

            <Container fluid className="usuarios">
               <Row className="justify-content-center">
                    {usuarios.length > 0 ? (
                        usuarios.map((p, idx) => {
                            return (
                                <Col key={idx} xs={12} md={6} lg={4} xl={3} className="mb-4">
                                    <div className="members-item">
                                        <img
                                            src={p.foto} 
                                            alt={`Imagen proyecto ${p.nombre}`} 
                                            className="img" 
                                        />
                                        <h3>{p.nombre} {p.apellido}</h3>
                                        <span className="state">{p.cargo}</span>
                                        <p className="desc">Proyectos Relacionados</p>
                                        <div className="links">
                                            {p.proyectos && p.proyectos.length > 0 ? (
                                                p.proyectos.map((proyecto, idx) => (
                                                    <Link
                                                        to={`/proyecto/${proyecto.id_proyecto}`}
                                                        className="mas"
                                                        key={idx}
                                                    >
                                                        {proyecto.nombre}
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="no-projects">No hay proyectos relacionados.</p>
                                            )} 
                                        </div>
                                        <a href={`mailto:${p.correo}`} target="_blank" rel="noopener noreferrer" className="contact">
                                            Contactar
                                        </a>
                                    </div>
                                </Col>
                            );
                        })
                    ) : (
                        <div className="error">
                            <img src={loading} alt="Cargando..." className="loading" />
                            <p className="no-projects">No hay usuarios disponibles en este momento.</p>
                        </div>
                    )}
               </Row>
            </Container>

            <Container fluid className="idea d-flex justify-content-center align-items-center">
                <Col xs={10} md={8} lg={6} className="text-center">
                    <h2>Únete a Nuestra Comunidad</h2>
                    <p className="desc">
                        ¿Listo para formar parte de algo increíble? Conéctate con ingenieras e ingenieros 
                        apasionadas y ayuda a dar forma al futuro de la tecnología.
                    </p>
                    <a href="https://forms.gle/ghC6TBedHnNLfMDZ9" target="_blank" rel="noopener noreferrer">
                        Únete a Nuestro Equipo
                    </a>
                </Col>
            </Container>
        </div>
    );
};

export default Miembros;