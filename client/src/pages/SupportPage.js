import React from "react";
import { Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CSVReader } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { GoCheck } from 'react-icons/go';
import API from '../api/Api';

class SupportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { show: null, success: false, refresh: false };
    }

    /**
     * Sets the states 'name' to the value 'data'
     * @param {*} data 
     * @param {*} name 
     */
    handleOnDrop = (data, name) => {
        this.setState({ [name]: data });
    }

    /**
     * CSVReader component error handler
     * @param {*} err 
     * @param {*} file 
     * @param {*} inputElem 
     * @param {*} reason 
     */
    handleOnError = (err, file, inputElem, reason) => {
        console.log(err);
    }

    /**
     * Clears the state corresponding to 'name' param
     * @param {*} data 
     * @param {*} name 
     */
    handleOnRemoveFile = (data, name) => {
        this.setState({ [name]: null })
    }

    /**
     * Calculates the length of each loaded array, then opens the SummaryModal component
     */
    showModal = () => {
        let students = this.state.studentsArray ? "students: " + this.state.studentsArray.length : "";
        let courses = this.state.coursesArray ? "courses: " + this.state.coursesArray.length : "";
        let professors = this.state.professorsArray ? "professors: " + this.state.professorsArray.length : "";
        let schedules = this.state.schedulesArray ? "schedules: " + this.state.schedulesArray.length : "";
        let enrollments = this.state.enrollmentsArray ? "enrollments: " + this.state.enrollmentsArray.length : "";
        let elems = students || courses || professors || schedules || enrollments ? [students, courses, professors, schedules, enrollments] : [];
        this.setState({ show: true, elems: elems });
    }

    /**
     * Closes the SummaryModal component
     */
    closeModal = () => {
        this.setState({ show: false, elems: null });
    }

    /**
     * Manages the API calls for each of the type of entry loaded
     */
    sendFiles = async () => {

        let promises = [];
        if (this.state.studentsArray)
            promises.push(API.uploadList(this.props.user.userId, "students", this.state.studentsArray));
        if (this.state.coursesArray)
            promises.push(API.uploadList(this.props.user.userId, "courses", this.state.coursesArray));
        if (this.state.professorsArray)
            promises.push(API.uploadList(this.props.user.userId, "teachers", this.state.professorsArray));
        if (this.state.schedulesArray)
            promises.push(API.uploadList(this.props.user.userId, "lectures", this.state.schedulesArray));
        if (this.state.enrollmentsArray)
            promises.push(API.uploadList(this.props.user.userId, "classes", this.state.enrollmentsArray));
        Promise.all(promises)
            .then(() => this.setState({ show: false, elems: null, success: true }))
            .catch((err) => this.setState({ show: false, elems: null, fetchError: err.errorMsg }))

    }

    /**
    * Sets the state refresh to 'true', forcing the page to refresh (in the render function) 
    */
    refreshPage = () => {
        this.setState({ refresh: true });
    }

    /**
     * Renders the SupportPage component
     */
    render() {
        if (this.state.refresh)
            return <Redirect to="/" />; //since the user props is still available, the user will be redirected back to this page
        else
            return <>
                { this.state.show &&
                    <SummaryModal sumClose={this.closeModal} send={this.sendFiles} elems={this.state.elems} />}
                { this.state.success &&
                    <SuccessModal successClose={this.refreshPage} />}
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
                        <Button variant="warning" size="m" data-testid="submit-button" onClick={this.showModal}>Submit your data</Button>
                    </Row>
                </Container>
            </>;
    }

}

/**
 * Returns the component to let csv files to be loaded and converted in JSON arrays
 * @param {*} props 
 */
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

/**
 * Returns the Modal component to summarize all data that will be uploaded
 * @param {*} props 
 */
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
                            return <li key={e}><b>{e}</b></li>;
                    })}
                </ul><br />
                Do you want to upload them?</>}
        </Modal.Body>
        <Modal.Footer>
            {props.elems.length === 0 && <Button name="close" data-testid="sum-close" variant="secondary" onClick={props.sumClose}>Close</Button>}
            {props.elems.length !== 0 && <><Button name="yes" data-testid="sum-yes" variant="secondary" onClick={props.send}>Yes</Button><Button name="no" data-testid="sum-no" variant="secondary" onClick={props.sumClose}>No</Button></>}
        </Modal.Footer>
    </Modal>;
}

/**
 * Returns the Modal component to notify the user of the opersation success
 * @param {*} props 
 */
function SuccessModal(props) {
    return <Modal show={true} onHide={props.successClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
            Operation successful!
        </Modal.Body>
        <Modal.Footer>
            <Button name="close" data-testid="success-close" variant="secondary" onClick={props.successClose}>Close</Button>
        </Modal.Footer>
    </Modal>;
}


export default SupportPage;