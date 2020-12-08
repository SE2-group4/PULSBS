import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CSVReader } from 'react-papaparse';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

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
        this.setState({ [name]: [] })
    }

    showModal = () => {
        this.setState({ show: true });
    }

    closeModal = () => {
        this.setState({ show: false });
    }

    //la disposizione è ad uno stadio iniziale provvisorio
    render() {
        return <>
            { this.state.show &&
                <SummaryModal sumClose={this.closeModal} send={this.closeModal} />}
            <Container fluid className="csv-container">
                <Row>
                    <Col sm={4}>
                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="studentsArray" elem="students" />
                    </Col>
                    <Col sm={4}>
                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="coursesArray" elem="courses" />
                    </Col>
                    <Col sm={4}>
                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="professorsArray" elem="professors" />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="schedulesArray" elem="schedules" />
                    </Col>
                    <Col sm={4}>
                        <CSVPanel handleOnDrop={this.handleOnDrop} handleOnError={this.handleOnError} handleOnRemoveFile={this.handleOnRemoveFile} stateName="enrollmentsArray" elem="enrollments" />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Container className="csv-container">
                            <Button variant="warning" size="lg" onClick={this.showModal}>Submit your data</Button>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </>;
    }

}

function CSVPanel(props) {
    const options = {
        header: true,
    };
    return <Container className="csv-container">
        <h3>{props.elem}</h3>
        <CSVReader
            config={options}
            onDrop={(data) => props.handleOnDrop(data, props.stateName)}
            onError={props.handleOnError}
            addRemoveButton
            onRemoveFile={(data) => props.handleOnRemoveFile(data, props.stateName)}
        >
            <span>Click or drop to upload.</span>
        </CSVReader>
    </Container>;
}

function SummaryModal(props) {
    return <Modal show={true} onHide={props.sumClose}>
        <Modal.Header closeButton>
            <Modal.Title>Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>your entries: TO_DO</Modal.Body>
        <Modal.Footer>
            <Button name="yes" variant="secondary" onClick={props.send}>Yes</Button><Button name="no" variant="secondary" onClick={props.sumClose}>No</Button>
        </Modal.Footer>
    </Modal>;
}

export default SupportPage;