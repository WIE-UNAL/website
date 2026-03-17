import React, { useEffect } from "react";
import "./Terminos.css";
import gsap from "gsap";

export const Terminos = () => {
    useEffect(() => {
        let ctx = gsap.context(() => {
            // Animación para los encabezados principales
            gsap.from("h2", {
                opacity: 0,
                y: -30,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
            });

            // Animación para los párrafos
            gsap.from("p", {
                opacity: 0,
                x: -50,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
            });

            // Animación para las listas de reglas
            gsap.from("ol li", {
                opacity: 0,
                y: 20,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
            });

            // Animación para las listas dentro de listas (<ul>)
            gsap.from("ul li", {
                opacity: 0,
                x: -20,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
            });
        });

        // Limpieza de animaciones al desmontar el componente
        return () => ctx.revert();
    }, []);

    return (
        <div className="terms">
            <section>
                <h2>Políticas de Privacidad, Términos y Aviso Legal</h2>
                <p>
                    En <strong>WIE UNAL</strong>, nos comprometemos a proteger la 
                    privacidad y los datos personales de nuestros usuarios. A continuación, 
                    describimos cómo recopilamos, usamos y protegemos tu información:
                </p>
                <ol>
                    <li>
                        <strong>Información Recopilada:</strong> Durante el registro en 
                        nuestro sitio web y actividades como talleres, eventos o mentorías, 
                        podríamos solicitar información personal, como nombre, correo 
                        electrónico, edad e intereses académicos.
                    </li>
                    <li>
                        <strong>Uso de la Información:</strong>
                        La información recopilada se utilizará para:
                        <ul>
                            <li>Mantenerte informado sobre actividades, proyectos y eventos relacionados con WIE UNAL.</li>
                            <li>Optimizar la experiencia del usuario y personalizar contenidos según tus intereses.</li>
                            <li>Realizar análisis y mediciones del alcance de nuestras iniciativas.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Compartición de Información:</strong> No compartiremos tu 
                        información personal con terceros sin tu consentimiento expreso, 
                        salvo cuando lo requiera la ley.
                    </li>
                    <li>
                        <strong>Protección de Datos:</strong> Utilizamos medidas de 
                        seguridad técnicas y organizativas para proteger tus datos frente a 
                        accesos no autorizados, alteraciones o pérdidas.
                    </li>
                    <li>
                        <strong>Tus Derechos:</strong> Tienes derecho a acceder, corregir o 
                        eliminar tu información almacenada, así como retirar tu consentimiento 
                        en cualquier momento escribiéndonos a 
                        <a href="mailto:contacto@wieunal.edu"> contacto@wieunal.edu</a>.
                    </li>
                </ol>
            </section>

            <section id="terms-and-conditions">
                <h2>Términos y Condiciones</h2>
                <ol>
                    <li>
                        <strong>Propósito del Sitio:</strong> Este sitio es una plataforma 
                        educativa e informativa diseñada para promover la inclusión en áreas 
                        STEM, divulgar actividades y conectar a la comunidad.
                    </li>
                    <li>
                        <strong>Registro y Responsabilidad del Usuario:</strong> Al registrarte, 
                        garantizas que la información proporcionada es veraz y actualizada. Te 
                        comprometes a usar el sitio de manera ética y respetando a la comunidad.
                    </li>
                    <li>
                        <strong>Propiedad Intelectual:</strong> Todo el contenido, incluidos 
                        textos, gráficos, logotipos y recursos, es propiedad de WIE UNAL y no 
                        se puede utilizar sin autorización previa.
                    </li>
                    <li>
                        <strong>Prohibiciones:</strong> Está prohibido el uso del sitio para 
                        actividades ilegales, distribución de contenido ofensivo o recolección 
                        no autorizada de datos de otros usuarios.
                    </li>
                    <li>
                        <strong>Modificaciones:</strong> Nos reservamos el derecho de cambiar 
                        estos términos en cualquier momento para adaptarnos a nuevas 
                        regulaciones o necesidades.
                    </li>
                </ol>
            </section>

            <section id="legal-notice">
                <h2>Aviso Legal</h2>
                <ol>
                    <li>
                        <strong>Exención de Responsabilidad:</strong> WIE UNAL no se hace 
                        responsable del uso indebido de los recursos educativos publicados ni 
                        de daños derivados del uso de los mismos.
                    </li>
                    <li>
                        <strong>Vinculación a Terceros:</strong> Este sitio puede incluir enlaces 
                        a páginas de terceros. No nos hacemos responsables del contenido o 
                        servicios ofrecidos en dichas plataformas.
                    </li>
                    <li>
                        <strong>Uso Educativo:</strong> Los recursos y actividades ofrecidas 
                        tienen fines educativos y se proporcionan sin garantía de resultados 
                        específicos.
                    </li>
                </ol>
            </section>
        </div>
    );
};

export default Terminos;