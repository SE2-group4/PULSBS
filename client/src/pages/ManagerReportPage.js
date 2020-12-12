import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Alert from 'react-bootstrap/Alert'
import Table from 'react-bootstrap/Table'
import API from '../api/Api'
import APIfake from '../api/APIfake'
import 'react-day-picker/lib/style.css';

class ManagerReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: "", date: new Date() }
    }
    selectFilter = (type) => {
        this.setState({ filterType: type, text: "", student: null });
    }
    changeTextbox = (textBoxValue) => {
        this.setState({ text: textBoxValue })
        if (this.state.filterType === "SSN") {
            APIfake.getStudentBySSN(textBoxValue)
                .then((student) => this.setState({ student: student }))
                .catch()
        }
        if (this.state.filterType === "Student ID") {
            APIfake.getStudentBySerialNumber(textBoxValue)
                .then((student) => this.setState({ student: student }))
                .catch()
        }
    }
    selectDate = (date) => {
        this.setState({ date: date })
    }
    handleGenerateReport = () => {
        if (this.state.filterType === "SSN") {
            APIfake.generateReportBySSN(this.state.text, this.state.date)
                .then((report) => this.setState({ report: report }))
                .catch()
        }
        if (this.state.filterType === "Student ID") {
            APIfake.generateReportBySerialNumber(this.state.text, this.state.date)
                .then((report) => this.setState({ report: report }))
                .catch()
        }
    }
    render() {
        if (!this.state.report)
            return (
                <Container fluid id="containerReport">
                    <Row>
                        <Col sm="3"></Col>
                        <Alert variant="warning"><b>Select the search method:</b></Alert>
                    </Row>
                    <br></br>
                    <Row></Row>
                    <PairButtons active={this.state.filterType} selectFilter={this.selectFilter} />
                    <br></br>
                    <Row></Row>
                    {
                        this.state.filterType &&
                        <>
                            <FormBox text={this.state.text} filterType={this.state.filterType} changeTextbox={this.changeTextbox} student={this.state.student}
                                selectDate={this.selectDate} date={this.state.date} handleGenerateReport={this.handleGenerateReport} />

                        </>
                    }

                </Container >
            )
        if (this.state.report)
            return (
                <Container>
                    <TableReport report={this.state.report}></TableReport>
                </Container>
            )

    }
}
function PairButtons(props) {
    return (
        <Row>
            <Col sm="2"></Col>
            <Col sm="4">
                <Button variant="dark" size="lg" active={props.active === "SSN" ? true : false} onClick={() => props.selectFilter("SSN")}>SSN</Button>
            </Col>
            <Col>
                <Button variant="dark" size="lg" active={props.active === "Student ID" ? true : false} onClick={() => props.selectFilter("Student ID")}>Serial Number</Button>
            </Col>
        </Row>
    )
}

function FormBox(props) {
    return (
        <>
            {props.filterType === "SSN" &&
                <Form>
                    <Form.Group as={Row}>

                        <Form.Label column sm="3">Student SSN :</Form.Label>
                        <Col>
                            <Form.Control as="textarea" value={props.text} rows={1} onChange={(ev) => props.changeTextbox(ev.target.value)} />
                        </Col>

                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="3">Date :</Form.Label><br></br>
                        <Col>
                            <DayPickerInput value={props.date} onDayChange={() => props.selectDate()} />
                        </Col>
                    </Form.Group>
                    <Form.Label>Student selected:</Form.Label>
                    {props.student &&
                        <>
                            <Form.Control disabled readOnly value={props.student.studentId + " " + props.student.firstName + " " + props.student.lastName + " " + props.student.email} /><br></br><br></br>
                            <Button variant="warning" onClick={() => props.handleGenerateReport()}>Generate Report Tracing</Button>
                        </>}
                    {!props.student &&
                        <>
                            <Form.Control disabled readOnly value="No student matches" /><br></br><br></br>
                            <Button variant="warning" disabled>Generate Report Tracing</Button>
                        </>}

                </Form>
            }
            {props.filterType === "Student ID" &&
                <Form>
                    <Form.Group as={Row}>

                        <Form.Label column sm="3">Serial Number :</Form.Label>
                        <Col>
                            <Form.Control value={props.text} onChange={(ev) => props.changeTextbox(ev.target.value)} as="textarea" rows={1} />
                        </Col>

                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column sm="3">Date :</Form.Label><br></br>
                        <Col>
                            <DayPickerInput value={props.date} onDayChange={() => props.selectDate()} />
                        </Col>
                    </Form.Group>
                    <Form.Label>Student selected:</Form.Label>
                    {props.student &&
                        <>
                            <Form.Control disabled readOnly value={props.student.studentId + " " + props.student.firstName + " " + props.student.lastName + " " + props.student.email} /><br></br><br></br>
                            <Button variant="warning" onClick={() => props.handleGenerateReport()}>Generate Report Tracing</Button>
                        </>}
                    {!props.student &&
                        <>
                            <Form.Control disabled readOnly value="No student matches" /><br></br><br></br>
                            <Button variant="warning" disabled>Generate Report Tracing</Button>
                        </>}
                </Form>
            }
        </>
    )
}

function TableReport(props) {
    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {props.report.map((u) => <TableEntry user={u} />)}
                </tbody>
            </Table>
            <Button>Generate a new report</Button>
            <Button>Convert to PDF</Button>
            <Button>Convert to CSV</Button>
        </>
    )
}
function TableEntry(props) {
    return (
        <tr>
            <td>{props.user.studentId}</td>
            <td>{props.user.firstName}</td>
            <td>{props.user.lastName}</td>
            <td>{props.user.email}</td>
        </tr>
    )
}
export default ManagerReportPage;