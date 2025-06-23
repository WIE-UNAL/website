import { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import { AutenticadoC, removeUsuarioStorage } from "../util/Auth";

import { Info } from "./Perfil/Info";

import loading from "../resources/loading.gif";
import gsap from "gsap";

export const Perfil = () => {
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [menu, setMenu] = useState(1);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const user = await AutenticadoC();
                if (user === false) {
                    navigate("/");
                } else {
                    setUsuario(user);
                }
            } catch (err) {
                console.error("Error al cargar el usuario:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsuario();
    }, [navigate]);

    // GSAP Animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            // Animación para el encabezado (menu)
            gsap.from(".menu", {
                opacity: 0,
                x: -100,
                duration: 1,
                ease: "power2.out",
            });

            // Animación para la información personal
            gsap.from(".info", {
                opacity: 0,
                x: 100,
                duration: 1,
                ease: "power2.out",
            });

            // Animación para las filas de información (bloques)
            gsap.from(".information", {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
            });
        });

        // Cleanup al desmontar el componente
        return () => ctx.revert();
    }, []);

    if (isLoading || !usuario) {
        return (
            <div className="error">
                <img src={loading} alt="Cargando..." className="loading" />
                <p className="no-projects">Cargando el Perfil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <img src={loading} alt="Cargando..." className="loading" />
                <p className="no-projects">Ocurrió un Error...</p>
            </div>
        );
    }

    return (
        <div className="profile">
            <Container fluid>
                <Row className="block justify-content-center align-items-stretch">
                    {/* Encabezado lateral */}
                    <Col md={12} lg={3} className="menu">
                        <h2>{usuario.nombre} {usuario.apellido}</h2>
                        <h3>{usuario.carrera}</h3>
                        <button onClick={() => setMenu(1)}>
                            Mi Perfil
                        </button>
                        <button onClick={() => {removeUsuarioStorage(); navigate("/");}}>
                            Cerrar Sesión
                        </button>
                    </Col>

                    {/* Información personal */}
                    <Col md={12} lg={8} className="info">
                        { menu===1 ? (
                            <Info usuario={usuario} />
                        ) : (
                            <div className="error">
                                <img src={loading} alt="Cargando..." className="loading" />
                                <p className="no-projects">Ocurrió un Error...</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Perfil;