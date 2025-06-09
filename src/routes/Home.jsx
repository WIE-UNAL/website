import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Home.css';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import logo from "../resources/brand.png";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {

    

    return (
        <div className="home">
            <Container fluid className="start">
                <Row className="start-block">
                    <Col md={6} className="text">
                        <p className="title">Empowering Women in</p>
                        <p className="color">Engineering</p>

                        <p className="desc">
                            Join UNAL's premier community for women engineers. Connect, innovate, and shape the future of technology together.
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;