import React from 'react';
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Pagination from 'react-bootstrap/Pagination';

const Checkbox = ({ name, checked = false, onChange, type }) => (
    <Form.Check name={name} checked={checked} onChange={onChange} data-testid={type + "-" + name} />
);

const elementForPage = 4; //both courses and lectures
const studentForPage = 4;

class CoursePanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    //triggers the selected lecture (or untrigger if already)
    handler = (e) => {
        if (this.props.sCourse === e.target.name)
            this.props.reset("course");
        else
            this.props.update(e.target.name);
    }

    //pagination handler
    onClick = (number) => {
        this.props.change("currCPage", number);
    }

    render() {
        let nPages = Math.ceil(this.props.courses.length / elementForPage);
        let items = [];
        for (let number = 1; number <= nPages; number++) {
            items.push(
                <Pagination.Item data-testid={"paginationItemCourse-" + number} key={number} active={number === parseInt(this.props.currentPage)} >
                    {number}
                </Pagination.Item>,
            );
        }
        let tableEntries = [];
        for (let entry = (this.props.currentPage - 1) * elementForPage; entry <= this.props.currentPage * elementForPage - 1; entry++) {
            let course = this.props.courses[entry];
            if (course)
                tableEntries.push(<CoursePanelRow key={course.courseId} checkedOne={this.props.sCourse} course={course} handler={this.handler} />);
        }

        return <>
            <Container fluid>
                <strong>Course list:</strong><br />
                <Table striped hover >
                    <thead style={{ whiteSpace: "nowrap" }}>
                        <tr>
                            <th>Course Id</th>
                            <th>Name</th>
                            <th>Choose</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableEntries}
                    </tbody>
                </Table>
                {nPages > 1 && <Pagination onClick={(ev) => this.onClick(ev.target.text)}>{items}</Pagination>}
                {this.props.courses.length === 0 && <label>no courses available.</label>}
                <span className="selectedText">{this.props.sCourse && <label data-testid="selected-course">Selected course: <b>{this.props.sCourse}</b></label>}</span>
            </Container>
            <br />
        </>;
    }
}

function CoursePanelRow(props) {
    return <tr data-testid="course-row">
        <td>{props.course.courseId}</td>
        <td>{props.course.description}</td>
        <td><Checkbox name={props.course.courseId} checked={parseInt(props.checkedOne) === parseInt(props.course.courseId) ? true : false} onChange={props.handler} type={"c"} /></td>
    </tr>;
}

class LecturePanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    //triggers the selected lecture (or untrigger if already)
    handler = (e) => {
        if (this.props.sLecture === e.target.name)
            this.props.reset("lecture");
        else
            this.props.update(e.target.name);
    }

    //triggers EditModal
    editOpen = (e) => {
        this.props.showEditModal(e.target.name, e.target.value);
    }

    //triggers DeleteModal
    deleteOpen = (e) => {
        this.props.showDeleteModal(e.target.name);
    }

    //pagination handler
    onClick = (number) => {
        this.props.change("currLPage", number);
    }

    render() {
        let nPages = Math.ceil(this.props.lectures.length / elementForPage);
        let items = [];
        for (let number = 1; number <= nPages; number++) {
            items.push(
                <Pagination.Item data-testid={"paginationItemLecture-" + number} key={number} active={number === parseInt(this.props.currentPage)} >
                    {number}
                </Pagination.Item>,
            );
        }
        let tableEntries = [];
        for (let entry = (this.props.currentPage - 1) * elementForPage; entry <= this.props.currentPage * elementForPage - 1; entry++) {
            let lecture = this.props.lectures[entry];
            if (lecture)
                tableEntries.push(<LecturePanelRow key={lecture.lectureId} checkedOne={this.props.sLecture} lecture={lecture} handler={this.handler} editOpen={this.editOpen} deleteOpen={this.deleteOpen} />);
        }

        return <>
            <Container fluid>
                <strong>Lecture list:</strong><br />
                <Table striped hover >
                    <thead style={{ whiteSpace: "nowrap" }}>
                        <tr>
                            <th>Lecture Id</th>
                            <th>Date</th>
                            <th>Delivery</th>
                            <th></th>
                            <th>Delete</th>
                            <th>Choose</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableEntries}
                    </tbody>
                </Table>
                {nPages > 1 && <Pagination onClick={(ev) => this.onClick(ev.target.text)}>{items}</Pagination>}
                {this.props.lectures.length === 0 && <label>no lectures available.</label>}
                <span className="selectedText" >{this.props.sLecture && <label data-testid="selected-lecture">Selected lecture: <b>{this.props.sLecture}</b></label>}</span>
            </Container>
            <br />
        </>;
    }
}

function LecturePanelRow(props) {
    let date = new Date(props.lecture.startingDate);
    let now = new Date();
    let canEdit = ((date.getTime() - now.getTime()) / (1000 * 60)) > 30 ? true : false; //check to time distance (more than 30 minutes)
    let canDelete = ((date.getTime() - now.getTime()) / (1000 * 60)) > 60 ? true : false; //check to time distance (more than 60 minutes)
    let deliveryText = props.lecture.delivery ? props.lecture.delivery.charAt(0) + props.lecture.delivery.substring(1).toLowerCase() : "";
    return <tr data-testid="lecture-row">
        <td>{props.lecture.lectureId}</td>
        <td>{date.toLocaleDateString()}{" " + (date.toLocaleTimeString()).slice(0, 5)}</td>
        <td>{deliveryText}</td>
        <td>{props.lecture.delivery === 'REMOTE' &&
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Can't switch delivery to Presence.</Tooltip>}>
                <span className="d-inline-block">
                    <Button disabled style={{ pointerEvents: 'none' }} variant="warning">toPresence</Button>
                </span></OverlayTrigger>}
            {!canEdit && props.lecture.delivery === 'PRESENCE' &&
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Can't switch delivery if the lecture is closer than 30 mins.</Tooltip>}>
                    <span className="d-inline-block">
                        <Button disabled style={{ pointerEvents: 'none' }} variant="warning">toRemote&nbsp;&nbsp;</Button>
                    </span></OverlayTrigger>}
            {canEdit && props.lecture.delivery !== 'REMOTE' &&
                <Button name={props.lecture.lectureId} value={props.lecture.delivery} onClick={props.editOpen}
                    variant="warning" data-testid={"m-" + props.lecture.lectureId} disabled={props.lecture.delivery === 'ERROR' ? true : false}>
                    {props.lecture.delivery !== 'PRESENCE' ? "-" : <>toRemote&nbsp;&nbsp;</>}
                </Button>}
        </td>
        <td>{!canDelete &&
            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Can't delete lecture if the lecture is closer than 60 mins.</Tooltip>}>
                <span className="d-inline-block">
                    <Button disabled style={{ pointerEvents: 'none' }} variant="warning">delete</Button>
                </span></OverlayTrigger>}
            {canDelete && <Button name={props.lecture.lectureId} onClick={props.deleteOpen} data-testid={"d-" + props.lecture.lectureId} variant="warning">delete</Button>}
        </td>
        <td><Checkbox name={props.lecture.lectureId} checked={parseInt(props.checkedOne) === parseInt(props.lecture.lectureId) ? true : false} onChange={props.handler} type={"l"} /></td>
    </tr>;
}

class StudentPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    //pagination handler
    onClick = (number) => {
        this.props.change("currSPage", number);
    }

    //switch student status (present/absent)
    updateStudent = (student) => {
        if (this.props.enable)
            this.props.updateStudent(student);
    }

    render() {
        let nPages = Math.ceil(this.props.students.length / studentForPage);
        let items = [];
        for (let number = 1; number <= nPages; number++) {
            items.push(
                <Pagination.Item data-testid={"paginationItemStudent-" + number} key={number} active={number === parseInt(this.props.currentPage)} >
                    {number}
                </Pagination.Item>,
            );
        }
        let tableEntries = [];
        for (let entry = (this.props.currentPage - 1) * elementForPage; entry <= this.props.currentPage * elementForPage - 1; entry++) {
            let student = this.props.students[entry];
            if (student)
                tableEntries.push(<StudentPanelRow key={student.studentId} student={student} updateStudent={this.updateStudent} />);
        }
        let numText = this.props.present ? <>Number of present students: <b>{this.props.students.length} / {this.props.numStudents}</b></> : <>Number of students: <b>{this.props.students.length}</b></>;
        let noStudentText = this.props.present ? "no present students." : "no students listed.";
        return <>
            <Container fluid>
                {this.props.present ? <strong>Presence list:</strong> : <strong>Student list:</strong>}<br />
                <Table striped hover>
                    <thead style={{ whiteSpace: "nowrap" }}>
                        <tr>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Student Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableEntries}
                    </tbody>
                </Table>
                {nPages > 1 && <Pagination onClick={(ev) => this.onClick(ev.target.text)}>{items}</Pagination>}
                {this.props.students.length === 0 && <label>{noStudentText}</label>}
                <span className="selectedText">{this.props.students.length !== 0 && <label data-testid={"number-students-" + this.props.students.length}>{numText}</label>}</span>
            </Container>
            <br />
        </>;
    }
}

function StudentPanelRow(props) {
    return <tr data-testid="student-row" as={Button} onClick={() => props.updateStudent(props.student)}>
        <td>{props.student.lastName}</td>
        <td>{props.student.firstName}</td>
        <td>{props.student.studentId}</td>
    </tr>;
}

function EditModal(props) {
    return <>
        <Modal show={true} onHide={props.editClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Delivery</Modal.Title>
            </Modal.Header>
            <Modal.Body>Do you want to turn lecture <b>{props.lectureId}</b> from <b>{props.delivery === 'PRESENCE' ? 'Presence' : 'Remote'}</b> to <b>{props.delivery === 'PRESENCE' ? 'Remote' : 'Presence'}</b>?</Modal.Body>
            <Modal.Footer>
                <Button name="yes" data-testid={"yes-m-" + props.lectureId} variant="secondary" onClick={props.updateDelivery}>Yes</Button><Button name="no" data-testid={"no-m-" + props.lectureId} variant="secondary" onClick={props.editClose}>No</Button>
            </Modal.Footer>
        </Modal>
    </>;
}

function DeleteModal(props) {
    return <>
        <Modal show={true} onHide={props.deleteClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Delivery</Modal.Title>
            </Modal.Header>
            <Modal.Body>Do you want to cancel lecture <b>{props.lectureId}</b> ?</Modal.Body>
            <Modal.Footer>
                <Button name="yes" data-testid={"yes-d-" + props.lectureId} variant="secondary" onClick={props.deleteLecture}>Yes</Button><Button name="no" data-testid={"no-d-" + props.lectureId} variant="secondary" onClick={props.deleteClose}>No</Button>
            </Modal.Footer>
        </Modal>
    </>;
}

function ErrorModal(props) {
    return <>
        <Modal show={true} onHide={() => props.close(props.name)}>
            <Modal.Header closeButton>
                <Modal.Title>Something went wrong!</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.error}</Modal.Body>
            <Modal.Footer>
                <Button name="close" data-testid="errorClose" variant="secondary" onClick={() => props.close(props.name)}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>;
}

export { CoursePanel, LecturePanel, StudentPanel, EditModal, DeleteModal, ErrorModal };



