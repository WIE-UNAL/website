import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 

import './LogIn.css';

import { signInWithGoogle } from "../util/firebase";
import { UsuarioNuevo, insertarUsuario } from "../ctrl/UsuarioCtrl";
import { setUsuarioStorage } from "../util/Auth";

export const LogIn = () => {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState(false); // Muestra u oculta el formulario
    const [nombres, setNombres] = useState(""); // Estado para nombres
    const [apellidos, setApellidos] = useState(""); // Estado para apellidos
    const [telefono, setTelefono] = useState(""); // Estado para teléfono
    const [cumple, setCumple] = useState(""); // Estado para cumpleaños

    const navigate = useNavigate();

    useEffect(() => {
        const verificarUsuario = async () => {
            try {
                if (user) {
                    const esNuevo = await UsuarioNuevo(user.email);
                    if (esNuevo === undefined) {
                        setForm(true);
                    } else {
                        setUsuarioStorage(esNuevo.id_usuario);
                        navigate("/perfil");
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
        e.preventDefault(); // Previene la recarga de la página
        try {
            const newUser = {
                nombre: nombres,
                apellido: apellidos,
                correo: user.email,
                telefono: telefono,
                cumple: cumple,
            };
            const id = await insertarUsuario(newUser);
            alert("¡Registro exitoso!");
            setUsuarioStorage(id.id_usuario);
            navigate("/perfil");
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            alert("Hubo un error al registrar el usuario.");
        }
    };

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