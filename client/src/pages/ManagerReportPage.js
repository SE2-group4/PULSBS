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
import Spinner from 'react-bootstrap/Spinner'
import ErrorMsg from '../components/ErrorMsg'
import API from '../api/Api'
import APIfake from '../api/APIfake'
import moment from 'moment'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { CSVLink, CSVDownload } from "react-csv";
import 'react-day-picker/lib/style.css';

class ManagerReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: "", date: moment().toISOString() }
    }
    /**
     * Change the filter (SSn, Serial Number)
     * @param {String} type 
     */
    selectFilter = (type) => {
        this.setState({ filterType: type, text: "", student: null });
    }

    /**
     * Change every time a new letter is inserted in the textbox
     * @param {String} textBoxValue  (this value can be an ssn or a serial number)
     */
    changeTextbox = (textBoxValue) => {
        this.setState({ text: textBoxValue, loading: true, fetchError: false })
        if (!textBoxValue)
            this.setState({ student: null, loading: false, fetchError: false })
        else if (this.state.filterType === "SSN") {
            API.getStudentBySSN(this.props.user.userId, textBoxValue)
                .then((student) => this.setState({ student: student, loading: false }))
                .catch((err) => {
                    if (err === "err")
                        this.setState({ loading: false, fetchError: true, student: null })
                    else this.setState({ student: null, loading: false, })
                })
        }
        else if (this.state.filterType === "Student ID") {
            API.getStudentBySerialNumber(this.props.user.userId, textBoxValue)
                .then((student) => { this.setState({ student: student, loading: false }) })
                .catch((err) => {
                    if (err === "err")
                        this.setState({ loading: false, fetchError: true, student: null })
                    else this.setState({ student: null, loading: false })
                })
        }
    }

    /**
     * Change the swab date
     * @param {String} date 
     */
    selectDate = (date) => {
        this.setState({ date: moment(date).toISOString() })
    }

    /**
     * Handle the click on generate report button
     */
    handleGenerateReport = () => {
        API.generateReport(this.props.user.userId, this.state.student.studentId, this.state.date)
            .then((report) => this.setState({ report: report }))
            .catch()

    }

    /**
     * Handle the click on generate new report button
     */
    handleGenerateNewReport = () => {
        this.setState({ report: null, text: "", date: moment().toISOString(), student: null, filterType: null })
    }

    /**
     * Handle the click on download PDF button
     */
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
                                selectDate={this.selectDate} date={this.state.date} handleGenerateReport={this.handleGenerateReport} loading={this.state.loading} fetchError={this.state.fetchError} />

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
/**
 * Display the two filter buttons
 * @param {*} props 
 */
function PairButtons(props) {
    return (
        <>
            <Col sm="2">
                <Button variant="secondary" size="lg" active={props.active === "SSN" ? true : false} onClick={() => props.selectFilter("SSN")}>SSN</Button>
            </Col>
            <Col>
                <Button variant="secondary" size="lg" active={props.active === "Student ID" ? true : false} onClick={() => props.selectFilter("Student ID")}>Serial Number</Button>
            </Col>
        </>
    )
}
/**
 * Display the form
 * @param {*} props 
 */
function FormBox(props) {
    return (
        <Form>
            <Form.Group as={Row}>

                <Form.Label column sm="3"><b>{props.filterType === "SSN" ? "Student SSN :" : "Serial Number :"}</b></Form.Label>
                <Col>
                    <Form.Control data-testid="textBox" type="text" value={props.text} onChange={(ev) => props.changeTextbox(ev.target.value)} />
                </Col>

            </Form.Group>
            <br />
            <Form.Group as={Row}>
                <Form.Label column sm="3"><b>Swab Date :</b></Form.Label><br></br>
                <Col>
                    <DayPickerInput value={moment(props.date).format("DD-MM-YYYY")} placeholder={moment(props.date).format("DD-MM-YYYY")} onDayChange={props.selectDate} />
                </Col>
            </Form.Group>
            <br />
            <Form.Label><b>Student selected:</b></Form.Label>
            {props.loading &&
                <Spinner size="sm" animation="border" />
            }
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
                                <td>{props.student.userId}</td>
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
                !props.student && !props.fetchError &&
                <>
                    <Form.Control data-testid="fd" disabled readOnly value="No student matches" /><br></br><br></br>
                    <Button variant="warning" disabled>Generate Tracing Report</Button>


                </>
            }
            {
                props.fetchError &&
                <>
                    <ErrorMsg msg="Error during server communication" />
                    <Button variant="warning" disabled>Generate Tracing Report</Button>
                </>

            }
        </Form >
    )
}
/**
 * Display the report table
 */
class TableReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = { active: 1 }
    }
    /**
     * Handle the click on other page in pagination mechanism
     * @param {Number} number 
     */
    changePage = (number) => {
        if (number)
            this.setState({ active: number })

    }
    render() {
        if (this.props.report.length === 0)
            return (
                <>
                    <Alert variant="dark"><b>The selected student had not contacts with other people</b></Alert><br />
                    <Button variant="warning" onClick={() => this.props.handleGenerateNewReport()}>Generate a new report</Button>
                </>
            )
        if (this.state.downloadCSV === true) {
            this.setState({ downloadCSV: false })
            return (
                <CSVDownload data={this.props.report} filename="Report_CSV.csv" />
            )
        }
        let nPages = Math.floor(this.props.report.length / 11) + 1;
        let items = [];
        for (let number = 1; number <= nPages; number++) {
            items.push(
                <Pagination.Item data-testid={"paginationItem-" + number} className="paginationItemReport" key={number} active={number == this.state.active} >
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
                <Table striped bordered hover id="tableReport">
                    <thead>
                        <tr>
                            <th>Serial Number</th>
                            <th>Type</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>SSN</th>
                            <th>City</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableEntries}
                    </tbody>
                </Table>
                {nPages > 1 && <Pagination onClick={(ev) => this.changePage(ev.target.text)}>{items}</Pagination>}
                <Row>
                    <Col sm="6"><Button variant="warning" onClick={() => this.props.handleGenerateNewReport()}>Generate a new report</Button></Col>
                    <Col sm="6">
                        <Button variant="warning" onClick={() => this.props.handleCreatePDF()} id="buttonPDF">Download PDF</Button><br /><br />
                        <CSVLink data={this.props.report.map((e) => { delete e.password; return e })} filename={"Report.csv"}><Button variant="warning" id="buttonCSV">Download CSV</Button></CSVLink>
                    </Col>

                </Row>
            </>
        )
    }
}
/**
 * Display an entry of report table
 * @param {*} props 
 */
function TableEntry(props) {
    return (
        <tr>
            <td>{props.user.userId}</td>
            <td>{props.user.type}</td>
            <td>{props.user.firstName}</td>
            <td>{props.user.lastName}</td>
            <td>{props.user.email}</td>
            <td>{props.user.ssn}</td>
            <td>{props.user.city}</td>
        </tr>
    )
}
/**
 * Create and download the report pdf
 * @param {*} report 
 * @param {*} student 
 * @param {*} date 
 */
function createPDF(report, student, date) {
    const doc = new jsPDF();

    doc.text("Report creation date :  " + moment().format("DD/MM/YYYY HH:mm"), 10, 10);
    doc.text("Positive Student to COVID-19 : " + student.studentId + " " + student.firstName + " " + student.lastName + " " + student.email, 10, 20)
    doc.text("Swab day : " + moment(date).format("DD/MM/YYYY"), 10, 30)
    doc.text("List of person who had contacts with the positive student :", 10, 40)
    let d = 50
    /*report.forEach(element => {
        doc.text(element.userId + " " + element.firstName + " " + element.lastName + " " + element.email, 10, d)
        d += 10
    });*/

    doc.setLineWidth(50)
    autoTable(doc, { html: '#tableReport', startY: d }, 50)

    doc.save("Report_" + student.studentId + ".pdf");
}


export default ManagerReportPage;