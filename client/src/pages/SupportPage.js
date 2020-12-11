import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CSVReader } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { GoCheck } from 'react-icons/go';

class SupportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show: null };
    }

    //students, courses, teachers, lectures, and classes
    handleOnDrop = (data, name) => {
        this.setState({ [name]: data });
    }

    handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    }

    handleOnRemoveFile = (data, name) => {
        this.setState({ [name]: null })
    }

    showModal = () => {
        let students = this.state.studentsArray ? "students: " + this.state.studentsArray.length : "";
        let courses = this.state.coursesArray ? "courses: " + this.state.coursesArray.length : "";
        let professors = this.state.professorsArray ? "professors: " + this.state.professorsArray.length : "";
        let schedules = this.state.schedulesArray ? "schedules: " + this.state.schedulesArray.length : "";
        let enrollments = this.state.enrollmentsArray ? "enrollments: " + this.state.enrollmentsArray.length : "";
        let elems = students || courses || professors || schedules || enrollments ? [students, courses, professors, schedules, enrollments] : [];
        this.setState({ show: true, elems: elems });
    }

    closeModal = () => {
        this.setState({ show: false, elems: null });
    }

    sendFiles = () => {
        //TO_DO : in case of response ok, message then refresh
        console.log("done!");
        this.setState({ show: false, elems: null });
    }

    //la disposizione è ad uno stadio iniziale provvisorio
    render() {
        return <>
            { this.state.show &&
                <SummaryModal sumClose={this.closeModal} send={this.sendFiles} elems={this.state.elems} />}
            <Container fluid id="supportContainer">
                <Row className="justify-content-md-center">
                    <Col sm={6}>
                        <Card>
                            <Card.Body>
                                <Card.Text>Hi <b>{this.props.user.firstName}</b>, welcome to setup page. If you want to add a certain type of data, click on corresponding <i>header</i>.
                                Once you have done, click on the <i>button</i> below.</Card.Text>
                            </Card.Body>
                        </Card>
                        <br />
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col sm={6}>
                        <Accordion>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                    <b>STUDENTS</b> {this.state.studentsArray ? <GoCheck size={16} /> : ""}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="studentsArray" elem="students" />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="1">
                                    <b>COURSES</b> {this.state.coursesArray ? <GoCheck size={16} /> : ""}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="coursesArray" elem="courses" />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="2">
                                    <b>PROFESSORS</b> {this.state.professorsArray ? <GoCheck size={16} /> : ""}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="2">
                                    <Card.Body>
                                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="professorsArray" elem="professors" />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="3">
                                    <b>SCHEDULES</b> {this.state.schedulesArray ? <GoCheck size={16} /> : ""}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="3">
                                    <Card.Body>
                                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="schedulesArray" elem="schedules" />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="4">
                                    <b>ENROLLMENTS</b> {this.state.enrollmentsArray ? <GoCheck size={16} /> : ""}
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="4">
                                    <Card.Body>
                                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="enrollmentsArray" elem="enrollments" />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        <br />
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Button variant="warning" size="m" onClick={this.showModal}>Submit your data</Button>
                </Row>
            </Container>
        </>;
    }

}

function CSVPanel(props) {
    const options = {
        header: true,
    };
    return <CSVReader
        config={options}
        onDrop={(data) => props.handleOnDrop(data, props.stateName)}
        onError={props.handleOnError}
        addRemoveButton
        onRemoveFile={(data) => props.handleOnRemoveFile(data, props.stateName)}
    >
        <span>Click or drop to upload.</span>
    </CSVReader>;
}

//testo provvisorio
function SummaryModal(props) {
    return <Modal show={true} onHide={props.sumClose}>
        <Modal.Header closeButton>
            <Modal.Title>Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {props.elems.length === 0 && <>No file uploaded yet.</>}
            {props.elems.length !== 0 && <>Your entries:<br />
                <ul>
                    {props.elems.map((e) => {
                        if (e)
                            return <>
                                <li><b>{e}</b></li>
                            </>;
                        else
                            return <></>;
                    })}
                </ul><br />
                Do you want to upload them?</>}
        </Modal.Body>
        <Modal.Footer>
            {props.elems.length === 0 && <Button name="close" variant="secondary" onClick={props.sumClose}>Close</Button>}
            {props.elems.length !== 0 && <><Button name="yes" variant="secondary" onClick={props.send}>Yes</Button><Button name="no" variant="secondary" onClick={props.sumClose}>No</Button></>}
        </Modal.Footer>
    </Modal>;
}

export default SupportPage;