import React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Alert from 'react-bootstrap/Alert'
import Table from 'react-bootstrap/Table'
import Pagination from 'react-bootstrap/Pagination'
import API from '../api/Api'
import APIfake from '../api/APIfake'
import moment from 'moment'
import { jsPDF } from "jspdf";
import { CSVLink } from "react-csv";
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
            APIfake.getStudentBySSN(this.props.user.userId, textBoxValue)
                .then((student) => this.setState({ student: student }))
                .catch()
        }
        if (this.state.filterType === "Student ID") {
            APIfake.getStudentBySerialNumber(this.props.user.userId, textBoxValue)
                .then((student) => this.setState({ student: student }))
                .catch()
        }
    }
    selectDate = (date) => {
        this.setState({ date: date })
    }
    handleGenerateReport = () => {
        APIfake.generateReport(this.props.user.userId, this.state.student.studentId, this.state.date)
            .then((report) => this.setState({ report: report }))
            .catch()

    }
    handleGenerateNewReport = () => {
        this.setState({ report: null, text: "", date: new Date(), student: null, filterType: null })
    }
    handleCreatePdf = () => {
        createPDF(this.state.report, this.state.student, this.state.date)
    }
    render() {
        if (!this.state.report)
            return (
                <Container fluid id="containerReport">
                    <Row>
                        <Col sm="6">
                            <Alert variant="warning"><b>Choose a student search method:</b></Alert>
                        </Col>
                        <PairButtons active={this.state.filterType} selectFilter={this.selectFilter} />
                    </Row>
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
                    <TableReport report={this.state.report} handleGenerateNewReport={this.handleGenerateNewReport} handleCreatePDF={this.handleCreatePdf}></TableReport>
                </Container>
            )

    }
}
function PairButtons(props) {
    return (
        <>
            <Col sm="2">
                <Button variant="dark" size="lg" active={props.active === "SSN" ? true : false} onClick={() => props.selectFilter("SSN")}>SSN</Button>
            </Col>
            <Col>
                <Button variant="dark" size="lg" active={props.active === "Student ID" ? true : false} onClick={() => props.selectFilter("Student ID")}>Serial Number</Button>
            </Col>
        </>
    )
}

function FormBox(props) {
    return (
        <Form>
            <Form.Group as={Row}>

                <Form.Label column sm="3"><b>{props.filterType === "SSN" ? "Student SSN :" : "Serial Number :"}</b></Form.Label>
                <Col>
                    <Form.Control as="textarea" value={props.text} rows={1} onChange={(ev) => props.changeTextbox(ev.target.value)} />
                </Col>

            </Form.Group>
            <br />
            <Form.Group as={Row}>
                <Form.Label column sm="3"><b>Swab Date :</b></Form.Label><br></br>
                <Col>
                    <DayPickerInput value={props.date} onDayChange={props.selectDate} />
                </Col>
            </Form.Group>
            <br />
            <Form.Label><b>Student selected:</b></Form.Label>
            {
                props.student &&
                <>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Serial Number</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{props.student.studentId}</td>
                                <td>{props.student.firstName}</td>
                                <td>{props.student.lastName}</td>
                                <td>{props.student.email}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <br></br><br></br>
                    <Button variant="warning" onClick={() => props.handleGenerateReport()}>Generate Tracing Report</Button>
                </>
            }
            {
                !props.student &&
                <>
                    <Form.Control disabled readOnly value="No student matches" /><br></br><br></br>
                    <Button variant="warning" disabled>Generate Tracing Report</Button>


                </>
            }

        </Form >
    )
}

class TableReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = { active: 1 }
    }
    changePage = (number) => {
        if (number)
            this.setState({ active: number })

    }
    render() {
        let nPages = Math.floor(this.props.report.length / 10) + 1;
        console.log(nPages)
        let items = [];
        for (let number = 1; number <= nPages; number++) {
            items.push(
                <Pagination.Item key={number} active={number == this.state.active} >
                    {number}
                </Pagination.Item>,
            );
        }
        let tableEntries = [];
        for (let entry = (this.state.active - 1) * 10; entry <= this.state.active * 10 - 1; entry++) {
            if (this.props.report[entry])
                tableEntries.push(<TableEntry user={this.props.report[entry]} />)
        }
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
                        {tableEntries}
                    </tbody>
                </Table>
                <Pagination onClick={(ev) => this.changePage(ev.target.text)}>{items}</Pagination>
                <Row>
                    <Col><Button variant="warning" onClick={() => this.props.handleGenerateNewReport()}>Generate a new report</Button></Col>
                    <Col><Button variant="warning" onClick={() => this.props.handleCreatePDF()} id="buttonPDF">Convert to PDF</Button></Col>
                    <Col><Button variant="warning" id="buttonCSV"><CSVLink data={this.props.report} filename="Report.csv">Convert to CSV</CSVLink></Button></Col>
                </Row>
            </>
        )
    }
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

function createPDF(report, student, date) {
    const doc = new jsPDF();

    doc.text("Report creation date :  " + moment().format("DD/MM/YYYY HH:mm"), 10, 10);
    doc.text("Positive Student to COVID-19 : " + student.studentId + " " + student.firstName + " " + student.lastName + " " + student.email, 10, 20)
    doc.text("Swab day : " + moment(date).format("DD/MM/YYYY"), 10, 30)
    doc.text("List of person who had contacts with the positive student :", 10, 40)
    let d = 50
    report.forEach(element => {
        doc.text(element.studentId + " " + element.firstName + " " + element.lastName + " " + element.email, 10, d)
        d += 10
    });

    doc.save("Report_" + student.studentId + ".pdf");
}
export default ManagerReportPage;