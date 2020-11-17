import React from 'react';
import Container from "react-bootstrap/Container";
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';

function InfoPanel(props) {
    return (
        <>
        <Container fluid>
            <Jumbotron>
                <Row>
                    <label><strong>ID :</strong> {props.user.userId}</label>
                </Row>
                <Row>
                    <label><strong>Type :</strong> {props.user.type}</label>
                </Row>
                <Row>
                    <label><strong>First Name :</strong> {props.user.firstName}</label>
                </Row>
                <Row>
                    <label><strong>Last Name :</strong> {props.user.lastName}</label>
                </Row>
                <Row>
                    <label><strong>Email :</strong> {props.user.email}</label>
                </Row>
            </Jumbotron>
        </Container>
        </>
    );
}

export default InfoPanel;