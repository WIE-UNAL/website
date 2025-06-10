import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Home.css';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import img from "../resources/home/home.png";

import { getProyectosDestacados } from "../ctrl/ProyectosCtrl.js";
import { getNombreById_Estado } from "../ctrl/EstadosCtrl.js";
import { getTagsByIdEvent } from "../ctrl/Proyectos_TagsCtrl.js";
import { getNombreById_Tag } from "../ctrl/TagsCtrl.js";
import { getFotoProyecto } from "../ctrl/StorageCtrl.js";
import { addCorreo } from "../ctrl/CorreoSuscripcionCtrl.js";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [proyectos, setProyectos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnriquecido = async () => {
      try {
        const proyectosRaw = await getProyectosDestacados();
        
        const proyectosConDatos = await Promise.all(
          proyectosRaw.map(async proyecto => {
            const nombreEstado = await getNombreById_Estado(proyecto.estado);

            const tagRelations = await getTagsByIdEvent(proyecto.id_proyecto);
            const tags = await Promise.all(
              tagRelations.map(async rel => {
                const nombreTag = await getNombreById_Tag(rel.id_tag);
                return nombreTag;
              })
            );

            const fotoURL = await getFotoProyecto(proyecto.id_proyecto);

            return {
              ...proyecto,
              estado: nombreEstado,
              tags,
              foto: fotoURL, 
            };
          })
        );

        setProyectos(proyectosConDatos);
      } catch (err) {
        console.error("Error al cargar y enriquecer proyectos:", err);
        setError("No se pudieron cargar los proyectos destacados.");
      }
    };

    fetchEnriquecido();
  }, []);

  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addCorreo(correo);
      if (response.exists) {
        setMensaje("Este correo ya está registrado en nuestra base de datos.");
      } else {
        setMensaje("¡Gracias por suscribirte! Te hemos añadido a nuestra comunidad.");
      }
      setCorreo(""); 
    } catch (error) {
      setMensaje("Hubo un error al procesar tu suscripción. Inténtalo más tarde.");
      console.error("Error en la suscripción:", error);
    }
  };

  return (
    <div className="home">
      <Container fluid className="start">
        <Row className="start-block">
          <Col md={8} className="text">
            <p className="title">Mujeres en la</p>
            <p className="color">Ingeniería</p>
            <p className="desc">
              Únete a la principal comunidad de mujeres ingenieras de la UNAL. Conéctate, innova y da forma al futuro de la tecnología.
            </p>
            <Link to="/proyectos" className="button">Nuestros Proyectos</Link>
            <Link to="/miembros" className="button">Conoce a Nuestros Miembros</Link>
            <hr />
          </Col>
          <Col md={4} className="image">
            <img src={img} alt="Logo de WIE UNAL." className="logo-image" />
          </Col>
        </Row>
      </Container>

      <Container fluid className="projects">
        <h2>Proyectos Destacados</h2>
        <p className="desc">
          Descubra los proyectos innovadores en los que trabaja nuestra comunidad para influir positivamente en la ingeniería y la tecnología.
        </p>
        <hr />

        {error && <p className="text-danger">{error}</p>}

        <Row className="justify-content-center">
          {proyectos.length > 0 ? (
            proyectos.map((p, i) => {
              return (
                <Col xs={10} md={3} key={i} className="project-item">
                  <img
                    src={p.foto} // Usar el campo 'foto'
                    alt={`Imagen del proyecto ${p.nombre}`}
                    className="img"
                  />
                  <div className="etiquetas">
                    <span className="state">{p.estado}</span>
                    {p.tags?.map((t) => (
                      <span className="tag">{t}</span>
                    ))}
                  </div>
                  <h3>{p.nombre}</h3>
                  <p className="desc">{p.descripcion_c}</p>
                  <Link to="/proyectos" className="mas">Ver Más...</Link>
                </Col>
              );
            })
          ) : !error ? (
            <p>No hay proyectos destacados disponibles.</p>
          ) : null}
        </Row>
      </Container>

      <Container fluid className="mision-vision">
        <h2>Nuestra Misión y Visión</h2>
        <p className="descripcion">
          WIE UNAL se dedica al avance de las mujeres en la ingeniería a través de la educación, la tutoría y proyectos innovadores que crean un cambio positivo en nuestras comunidades.
        </p>
        <hr />
        <Row className="justify-content-center align-items-stretch"> 
          <Col xs={10} md={5}>
            <div className="card-content">
              <i class="fa-solid fa-bullseye"></i>
              <h3>Misión</h3>
              <p className="desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sodales lacinia ipsum a venenatis. Etiam leo est, pretium eget aliquet sed, lobortis sit amet dolor.
              </p>
            </div>
          </Col>
          <Col xs={10} md={5}>
            <div className="card-content">
              <i class="fa-solid fa-eye"></i>
              <h3>Visión</h3>
              <p className="desc">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sodales lacinia ipsum a venenatis. Etiam leo est, pretium eget aliquet sed, lobortis sit amet dolor.
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      <Container fluid className="suscripcion">
        <h2>Mantente Conectado</h2>
        <p className="desc">
          Suscríbete a nuestro boletín y sé el primero en enterarte de nuevos proyectos, eventos y oportunidades en nuestra comunidad.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <button type="submit">Suscríbete</button>
        </form>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </Container>
    </div>
  );
};

export default Home;