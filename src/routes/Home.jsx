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

        <Row className="g-4 justify-content-center">
          {proyectos.length > 0 ? (
            proyectos.map((p, i) => {
              return (
                <Col md={4} key={i} className="project-item">
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
    </div>
  );
};

export default Home;