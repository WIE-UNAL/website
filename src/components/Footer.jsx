import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Footer.css';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import logo from "../resources/brand.png";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Animar las secciones del footer
            gsap.from(".footer-section", {
                y: 50, // Mover desde abajo
                opacity: 0, // Inicia transparente
                duration: 1, // Duración de la animación
                stagger: 0.3, // Retraso entre cada columna animada
                ease: "power2.out", // Suavizado de la animación
                scrollTrigger: {
                    trigger: ".custom-footer", // Elemento que activa la animación
                    start: "top bottom", // Inicia cuando la parte superior del footer toca el borde inferior del viewport
                }
            });

            // Animar los enlaces sociales con un rebote
            gsap.from(".social-links a", {
                opacity: 0, // Empieza invisible
                duration: 0.5,
                stagger: 0.2,
                ease: "back.out(1.5)", // Efecto de rebote
                scrollTrigger: {
                    trigger: ".social-links", // Elemento activador
                    start: "top 80%", // Inicia cuando el top de los iconos entra al viewport
                }
            });
        });

        // Limpiar el contexto cuando el componente se desmonte
        return () => ctx.revert();

    }, []);

    return (
        <footer className="custom-footer">
            <Container>
                <Row className="footer-content">
                    <Col md={6} className="footer-section">
                        <div className="brand-section">
                            <img src={logo} alt="Logo de WIE UNAL." className="logo-image" />
                            <div className="brand-text">
                                <span className="logo-text">WIE UNAL</span>
                                <p className="logo-text">Mujeres en Ingeniería</p>
                            </div>
                        </div>
                        <p className="footer-desc">
                            Potenciar el papel de la mujer en la ingeniería mediante la innovación, la colaboración y el impacto en la comunidad.
                        </p>
                        <hr />
                        <h3 className="footer-title">Redes Sociales</h3>
                        <div className="social-links">
                            <a href="https://www.instagram.com/wie_unal/" target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-square-instagram"></i>
                            </a>
                            <a href="https://www.facebook.com/wieunal/" target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-square-facebook"></i>
                            </a>
                            <a href="https://co.linkedin.com/company/wie-un" target="_blank" rel="noopener noreferrer">
                                <i className="fa-brands fa-linkedin"></i>
                            </a>
                            <a href="mailto:wie_fibog@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                <i className="fa-solid fa-square-envelope"></i>
                            </a>
                        </div>
                        <hr />
                    </Col>
                    <Col md={6} className="footer-section">
                        <h3 className="footer-title">Sitio Web</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Inicio</Link></li>
                            <li><Link to="/proyectos">Proyectos</Link></li>
                            <li><Link to="/miembros">Miembros</Link></li>
                            <li><Link to="/log-in">Ingresar / Registrarse</Link></li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center copyright">
                        <p>© {new Date().getFullYear()} WIE UNAL</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;