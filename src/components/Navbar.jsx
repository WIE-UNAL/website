import React, { useEffect } from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import './Navbar.css';

import gsap from "gsap";
import logo from"../resources/brand.png"

const NavigationBar = () => {

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".custom-navbar", {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power2.out",
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <Navbar expand="lg" className="custom-navbar" variant="light">
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="brand-section">
                    <img src={logo} alt="Logo de WIE UNAL." className="logo-image"/>
                    <div className="brand-text">
                        <span className="logo-text">WIE UNAL</span>
                        <p className="logo-text">Women in Engineering</p>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" as="button" className="custom-toggler">
                    <i class="fa-solid fa-bars"></i>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav" className="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {/* Sección de Páginas */}
                        <Nav.Link as={NavLink} to="/" className="nav-link-custom">Inicio</Nav.Link>
                        <Nav.Link as={NavLink} to="/proyectos" className="nav-link-custom">Proyectos</Nav.Link>
                        <Nav.Link as={NavLink} to="/miembros" className="nav-link-custom">Miembros</Nav.Link>
                        <Nav.Link as={NavLink} to="/log-in" className="nav-link-login">Ingresar</Nav.Link>

                        {/* Sección de Redes Sociales */}
                        <div className="social-links">
                            <a href="https://www.instagram.com/wie_unal/" target="_blank" rel="noopener noreferrer">
                                <i class="fa-brands fa-square-instagram"></i>
                            </a>
                            <a href="https://www.facebook.com/wieunal/" target="_blank" rel="noopener noreferrer">
                                <i class="fa-brands fa-square-facebook"></i>
                            </a>
                            <a href="https://co.linkedin.com/company/wie-un" target="_blank" rel="noopener noreferrer">
                                <i class="fa-brands fa-linkedin"></i>
                            </a>
                            <a href="mailto:wie_fibog@unal.edu.co" target="_blank" rel="noopener noreferrer">
                                <i class="fa-solid fa-square-envelope"></i>
                            </a>
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;