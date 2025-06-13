import { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { AutenticadoC, removeUsuarioStorage } from "../util/Auth";
import loading from "../resources/loading.gif";
import gsap from "gsap";

export const Perfil = () => {
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                        <button
                            onClick={() => {
                                removeUsuarioStorage();
                                navigate("/");
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </Col>

                    {/* Información personal */}
                    <Col md={12} lg={8} className="info">
                        <h2>Información Personal</h2>
                        <Container fluid className="box-info">
                            <Row className="personal">
                                <Col md={12} lg={6} className="information">
                                    <p className="label">Nombres</p>
                                    <p className="text">{usuario.nombre}</p>
                                </Col>
                                <Col md={12} lg={6} className="information">
                                    <p className="label">Apellidos</p>
                                    <p className="text">{usuario.apellido}</p>
                                </Col>
                                <Col md={12} lg={6} className="information">
                                    <p className="label">Correo Electrónico</p>
                                    <p className="text">{usuario.correo}</p>
                                </Col>
                                <Col md={12} lg={6} className="information">
                                    <p className="label">Número Telefónico</p>
                                    <p className="text">{usuario.telefono}</p>
                                </Col>
                                <Col md={12} lg={6} className="information">
                                    <p className="label">Carrera</p>
                                    <p className="text">{usuario.carrera}</p>
                                </Col>
                                <Col md={12} lg={6} className="information">
                                    <p className="label">Cargo en WIE</p>
                                    <p className="text">{usuario.cargo}</p>
                                </Col>
                                <Col md={12} lg={6} className="information">
                                    <p className="label">Cumpleaños</p>
                                    <p className="text">{usuario.cumple}</p>
                                </Col>
                                <Col md={12} lg={6} className="information">
                                    <p className="label">¿Suscrito?</p>
                                    <p className="text">{usuario.esta_suscrito ? "Si" : "No"}</p>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Perfil;