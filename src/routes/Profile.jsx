import { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import { AutenticadoC, removeUsuarioStorage } from "../util/Auth";

import { Info } from "./Perfil/Info";
import { EditarUsuarioAdmin } from "./Perfil/EditUser"
import { EditarProyectoAdmin } from "./Perfil/EditProyecto"

import loading from "../resources/loading.gif";
import gsap from "gsap";

export const Perfil = () => {
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [menu, setMenu] = useState(3);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const user = await AutenticadoC();
                if (user === false) {
                    navigate("/");
                } else {
                    setUsuario(user);
                    setAdmin(user.es_admin);
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

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.from(".menu", {
                opacity: 0,
                x: -100,
                duration: 1,
                ease: "power2.out",
            });

            gsap.from(".info", {
                opacity: 0,
                x: 100,
                duration: 1,
                ease: "power2.out",
            });

            gsap.from(".information", {
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.2,
                ease: "power2.out",
            });
        });

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
                    <Col md={12} lg={3} className="menu">
                        <h2>{usuario.nombre} {usuario.apellido}</h2>
                        <h3>{usuario.carrera}</h3>
                        {admin ? (
                            <p className="state">WIE Admin</p>
                        ): (<hr/>)}
                        <button onClick={() => setMenu(1)}>
                            Mi Perfil
                        </button>
                        {admin ? (
                            <div>
                                <button onClick={() => setMenu(2)}>
                                    Editar Usuarios
                                </button>
                                <button onClick={() => setMenu(3)}>
                                    Editar Proyectos
                                </button>
                            </div>
                        ): (<hr/>)}
                        <button onClick={() => {removeUsuarioStorage(); navigate("/");}}>
                            Cerrar Sesión
                        </button>
                    </Col>

                    <Col md={12} lg={8} className="info">
                        { menu===1 ? (
                            <Info usuario={usuario} />
                        ) : menu===2 ? (
                            <EditarUsuarioAdmin/>
                        ) : menu===3 ? (
                            <EditarProyectoAdmin idUsuario={usuario.id_usuario} />
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