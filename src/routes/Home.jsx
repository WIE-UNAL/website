import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Home.css';

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import img from "../resources/home/home.png";
import loading from "../resources/loading.gif"

import { getProyectosDestacados } from "../ctrl/ProyectosCtrl.js";
import { addCorreo } from "../ctrl/CorreoSuscripcionCtrl.js";
import { FotoProyecto } from "../util/Foto.jsx";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [proyectos, setProyectos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnriquecido = async () => {
      try {
        setProyectos(await getProyectosDestacados());
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

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".start-block", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".projects, .mision-vision, .suscripcion", {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power2.out",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".projects, .mision-vision, .suscripcion",
          start: "top 80%",
        },
      });
    });
    return () => ctx.revert();
  }, []);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".project-item", {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "back.out(1.5)",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".projects",
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, []);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".card-content", {
        opacity: 0,
        x: -100,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".mision-vision",
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, []);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from("form", {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "power1.out",
        scrollTrigger: {
          trigger: ".suscripcion",
          start: "top 85%",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="home">
      <Container fluid className="start">
        <Row className="start-block justify-content-center align-items-center">
          <Col xs={10} md={6} className="text">
            <p className="title">Mujeres en la</p>
            <p className="color">Ingeniería</p>
            <p className="desc">
              Desde nuestro grupo queremos que todas las personas, de todas las carreras y aún más allá impulsen y promuevan el rol de la mujer en el STEAM 
              (ciencia, tecnología, ingeniería, artes y matemáticas) teniendo un enfoque en la ingeniería, Esto buscando la equidad de genero.
            </p>
            <p className="desc">
              Esto mediante proyectos e iniciativas que faciliten la incursión de niñas, estudiantes de pregrado, posgrado y profesionales. Proyectos e 
              iniciativas que creen comunidad, ¡donde todas y todos podamos crecer juntos en nuestra vida universitaria y profesional!
            </p>
            <Link to="/proyectos" className="button">Nuestros Proyectos</Link>
            <Link to="/miembros" className="button">Conoce a Nuestros Miembros</Link>
            <hr />
          </Col>
          <Col xs={12} md={4} className="image">
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
                <Col xs={8} md={5} xl={3} key={i} className="project-item">
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
                Nuestra misión es inspirar, empoderar y acompañar a niñas, adolescentes y jóvenes universitarias en el descubrimiento y fortalecimiento de su potencial en la ingeniería 
                y la investigación científica. A través de proyectos, talleres, mentorías, charlas y espacios colaborativos, buscamos romper estereotipos, cerrar brechas de género y 
                fomentar liderazgos transformadores en la academia y en el ejercicio profesional. Creemos que la diversidad impulsa la innovación y que una comunidad inclusiva, 
                interdisciplinaria y comprometida con la equidad puede construir un futuro más justo, creativo y con oportunidades para todas y todos.
              </p>
            </div>
          </Col>
          <Col xs={10} md={5}>
            <div className="card-content">
              <i class="fa-solid fa-eye"></i>
              <h3>Visión</h3>
              <p className="desc">
                En 2026, WIE UNAL será un referente  en equidad de género en STEM, articulando ciencia, ingeniería y acción social. Desde el enfoque social, llevaremos conocimiento a 
                niñas, niños y jóvenes en contextos de vulnerabilidad en Bogotá, e impulsaremos la prevención de violencias basadas en género mediante formación e investigación. Desde 
                el enfoque de ciencia e innovación, desarrollaremos soluciones tecnológicas a problemáticas que afectan a las mujeres, integrando la ingeniería con una perspectiva de 
                género transformadora.
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