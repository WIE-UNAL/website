import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./LogIn.css";
import { signInWithGoogle } from "../util/firebase";
import { setUsuarioStorage } from "../util/Auth";
import { mostrarAlert } from "../util/Alert";
import { UsuarioNuevo, insertarUsuario } from "../ctrl/UsuarioCtrl";
import { getCarreras } from "../ctrl/CarrerasCtrl";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const LogIn = () => {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState(false);
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [telefono, setTelefono] = useState("");
    const [cumple, setCumple] = useState("");
    const [carreras, setCarreras] = useState([]);
    const [carreraSeleccionada, setCarreraSeleccionada] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verificarUsuario = async () => {
            try {
                if (user) {
                    const esNuevo = await UsuarioNuevo(user.email);
                    if (esNuevo === undefined) {
                        setCarreras(await getCarreras());
                        setForm(true);
                    } else {
                        setUsuarioStorage(esNuevo.id_usuario);
                        navigate("/perfil");
                        window.location.reload();
                    }
                }
            } catch (error) {
                console.error("Error al verificar el estado del usuario:", error);
            }
        };

        verificarUsuario();
    }, [user, navigate]);

    const handleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            setUser(result);
        } catch (error) {
            console.error("Error durante el login:", error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const newUser = {
                nombre: nombres,
                apellido: apellidos,
                correo: user.email,
                telefono: telefono,
                cumple: cumple,
                id_carrera: carreraSeleccionada
            };
            const data = await insertarUsuario(newUser);
            const usuarioInsertado = data[0];
            await mostrarAlert("success", "¡Registro exitoso! Bienvenido a WIE UNAL");
            alert("¡Registro exitoso!");
            setUsuarioStorage(usuarioInsertado.id_usuario);
            navigate("/perfil");
            window.location.reload();
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            alert("Hubo un error al registrar el usuario.");
            mostrarAlert("error", "Hubo un error al registrar el usuario. Por favor vuelve a intentarlo.");
        }
    };

    // GSAP Animations
    useEffect(() => {
        let ctx = gsap.context(() => {
            // Animaciones para el encabezado
            gsap.from(".header", {
                opacity: 0,
                y: -50,
                duration: 1,
                ease: "power2.out",
            });

            // Animación para el contenedor de autenticación
            gsap.from(".auth-container", {
                opacity: 0,
                scale: 0.9,
                duration: 1,
                ease: "power3.out",
                delay: 0.3,
            });

            // Animación para el formulario
            gsap.from(".form", {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out",
                delay: 0.5,
            });

            // Animación para los campos del formulario
            gsap.from(".form input, .form select", {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.2,
            });
        });

        return () => ctx.revert();
    }, [form]);

    return (
        <div>
            <Container fluid className="login">
                <Row className="justify-content-center align-items-stretch">
                    <Col md={12} lg={6} className="header">
                        <i className="fa-solid fa-star"></i>
                        <p className="title">Mujeres en la</p>
                        <p className="color">Ingeniería</p>
                        <p className="desc">
                            Únete a la principal comunidad de mujeres ingenieras de la UNAL. Conéctate, innova y da forma al futuro de la tecnología.
                        </p>
                    </Col>
                    <Col md={12} lg={6}>
                        <div className="auth-container">
                            {!form ? (
                                <div className="auth">
                                    <h2>Bienvenido, Únete a WIE UNAL</h2>
                                    <h3>Inicia sesión en tu cuenta para continuar</h3>
                                    <button onClick={handleLogin} className="boton">
                                        <i className="fa-brands fa-google" style={{ marginRight: "1rem" }}></i>
                                        Inicia sesión con Google
                                    </button>
                                </div>
                            ) : (
                                <div className="form">
                                    <h3>Por favor llena los siguientes datos:</h3>
                                    <form onSubmit={handleFormSubmit}>
                                        <label className="label">Nombres</label>
                                        <input
                                            type="text"
                                            placeholder="Ingresa tus nombres..."
                                            value={nombres}
                                            onChange={(e) => setNombres(e.target.value)}
                                            required
                                        />
                                        <label className="label">Apellidos</label>
                                        <input
                                            type="text"
                                            placeholder="Ingresa tus apellidos"
                                            value={apellidos}
                                            onChange={(e) => setApellidos(e.target.value)}
                                            required
                                        />
                                        <label className="label">Teléfono</label>
                                        <input
                                            type="tel"
                                            placeholder="Ingresa tu número de teléfono"
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value)}
                                            required
                                        />
                                        <label className="label">Cumpleaños</label>
                                        <input
                                            type="date"
                                            placeholder="Ingresa tu cumpleaños"
                                            value={cumple}
                                            onChange={(e) => setCumple(e.target.value)}
                                            required
                                        />
                                        <label className="label">Carrera Universitaria</label>
                                        <p className="subtitle">* Si estudias más de una carrera, elije tu carrera principal.</p>
                                        <p className="subtitle">** Si no encuentras tu carrera, elije la más similar.</p>
                                        <select
                                            className="carrera-select"
                                            value={carreraSeleccionada}
                                            onChange={(e) => setCarreraSeleccionada(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecciona una carrera</option>
                                            {carreras.map((carrera) => (
                                                <option
                                                    key={carrera.id_carrera}
                                                    value={carrera.id_carrera}
                                                >
                                                    {carrera.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        <label className="subtitle">
                                            Al crear tu cuenta, aceptas nuestros {" "}
                                            <a href="/terminos" target="_blank" rel="noopener noreferrer">
                                                términos y condiciones
                                            </a>.
                                        </label>
                                        <button type="submit" className="boton">
                                            Enviar Información
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LogIn;