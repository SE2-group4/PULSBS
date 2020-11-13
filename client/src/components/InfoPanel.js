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
                    <strong>ID : </strong>
                    <p> {props.user.userId}</p>
                </Row>
                <Row>
                    <strong>Type : </strong>
                    <p> {props.user.type}</p>
                </Row>
                <Row>
                    <strong>First Name : </strong>
                    <p> {props.user.firstName}</p>
                </Row>
                <Row>
                    <strong>Last Name : </strong>
                    <p> {props.user.lastName}</p>
                </Row>
                <Row>
                    <strong>Email : </strong>
                    <p> {props.user.email}</p>
                </Row>
            </Jumbotron>
        </Container>
        </>
    );
}

export default InfoPanel;