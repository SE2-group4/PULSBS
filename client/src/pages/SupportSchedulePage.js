import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import API from '../api/Api';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Schedule from '../entities/schedule';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ErrorMsg from '../components/ErrorMsg';

const scheduleForPage = 10;

class SupportSchedulePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { schedules: null, courses: null, rooms: null, filters: null, genError: null, loading: true, currPage: 1, selectedSchedule: null }
    }

    async componentDidMount() {
        try {
            let schedules = await API.getSchedulesBySupportId(this.props.user.userId);
            let courses = await API.getCoursesBySupportId(this.props.user.userId);
            let rooms = await API.getRoomsBySupportId(this.props.user.userId);
            let schedules_ = schedules.map((s) => {
                // let st = s.startingTime;
                // let et = s.endingTime;
                let roomid = s.roomId;
                s.roomId = roomid.toString();
                // s.startingTime = st.substring(0, st.length - 3);
                // s.endingTime = et.substring(0, et.length - 3);
                return s;
            })
            //console.log(schedules_);
            //console.log(rooms);
            //console.log(courses);
            let filters = courses.map((c) => c.description + "-" + c.code);
            this.setState({ schedules: schedules_, courses: courses, rooms: rooms, filters: filters, loading: false });
        } catch (err) {
            console.log(err);
            let errormsg = err.source + " : " + err.error;
            this.setState({ genError: errormsg, loading: false });
        }

    }

    changePage = (number) => {
        if (number)
            this.setState({ currPage: number });
    }

    openModal = (schedule) => {
        this.setState({ selectedSchedule: schedule });
    }

    closeModal = () => {
        this.setState({ selectedSchedule: null });
    }

    changeFilters = (desc) => {
        let filters;
        if (desc === "All")
            filters = this.state.courses.map((c) => c.description + "-" + c.code);
        else
            filters = [desc,];
        this.setState({ filters: filters });

    }

    submit = (day, room, startingTime, endingTime) => {
        let newSchedule = new Schedule();
        newSchedule.scheduleId = this.state.selectedSchedule.scheduleId;
        newSchedule.dayOfWeek = this.state.selectedSchedule.dayOfWeek === day ? null : day;
        newSchedule.roomId = this.state.selectedSchedule.roomId === room ? null : room;
        newSchedule.startingTime = this.state.selectedSchedule.startingTime === startingTime ? null : startingTime;
        newSchedule.endingTime = this.state.selectedSchedule.endingTime === endingTime ? null : endingTime;
        console.log(newSchedule);
        API.changeScheduleData(this.props.user.userId, newSchedule)
            .then(() => {
                //ok from server
                let schedules = this.state.schedules;
                let i = schedules.indexOf(this.state.selectedSchedule);
                schedules[i].dayOfWeek = day;
                schedules[i].roomId = room;
                schedules[i].startingTime = startingTime;
                schedules[i].endingTime = endingTime;
                this.setState({ schedules: schedules, selectedSchedule: null });
            })
            .catch((err) => {
                //error
                let errormsg = err.source + " : " + err.error;
                this.setState({ genError: errormsg, selectedSchedule: null });
            });
    }

    render() {
        if (this.state.genError)
            return <ErrorMsg msg={this.state.genError} />;
        if (this.state.loading)
            return <Spinner animation="border" ></Spinner>;
        let filtered = this.state.schedules.filter((s) => this.state.filters.indexOf(courseName(s.code, this.state.courses) + "-" + s.code) !== -1);
        //console.log(filtered.length);
        return <>
            {this.state.selectedSchedule &&
                <FormModal schedule={this.state.selectedSchedule} close={this.closeModal} courses={this.state.courses} rooms={this.state.rooms} submitData={this.submit} />}
            <Container fluid>
                <Row>
                    <Col sm={10}>
                        <Col sm={6}>
                            <Filters courses={this.state.courses} change={this.changeFilters} />
                        </Col>
                        <br />
                        <ScheduleTable schedules={filtered} current={this.state.currPage} edit={this.openModal} courses={this.state.courses} rooms={this.state.rooms}
                            filters={this.state.filters} onClick={this.changePage} />
                    </Col>
                </Row>
            </Container>
        </>;
    }
}

function Filters(props) {
    if (props.courses.length !== 0)
        return <Jumbotron>
            <strong>Select a course : </strong>
            <Form.Control as="select" data-testid="courseSelect" custom onChange={(ev) => { props.change(ev.target.value) }} >
                <option key="All" value="All" data-testid="All" >All</option>
                {props.courses.map((course) => { return (<option key={course.courseId} data-testid={"c" + course.courseId} value={course.description + "-" + course.code} >{course.description + " - " + course.code}</option>) })}
            </Form.Control>
        </Jumbotron>;
}

function ScheduleTable(props) {
    let filtered = props.schedules;
    let nPages = Math.ceil(filtered.length / scheduleForPage);
    let items = [];
    let tableEntries = [];
    if (filtered.length !== 0) {
        for (let number = 1; number <= nPages; number++) {
            items.push(
                <Pagination.Item data-testid={"paginationItemSchedule-" + number} key={number} active={number === parseInt(props.current)} >
                    {number}
                </Pagination.Item>,
            );
        }
        for (let entry = (props.current - 1) * scheduleForPage; entry <= props.current * scheduleForPage - 1; entry++) {
            let schedule = filtered[entry];
            if (schedule)
                tableEntries.push(<ScheduleRow key={schedule.scheduleId} schedule={schedule} edit={props.edit} courses={props.courses} rooms={props.rooms} />);
        }
    }
    return <>
        <Table striped bordered hover>
            <thead style={{ whiteSpace: "nowrap" }}>
                <tr>
                    <th>Schedule Id</th>
                    <th>Course</th>
                    <th>Code</th>
                    <th>AAyear</th>
                    <th>Semester</th>
                    <th>Room</th>
                    <th>Day</th>
                    <th>Starting Time</th>
                    <th>Ending Time</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {tableEntries}
            </tbody>
        </Table>
        {nPages > 1 && <Pagination onClick={(ev) => props.onClick(ev.target.text)}>{items}</Pagination>}
        {filtered.length === 0 && <label>No schedules available.</label>}
    </>;
}

function ScheduleRow(props) {
    return <tr data-testid="schedule-row">
        <td>{props.schedule.scheduleId}</td>
        <td>{courseName(props.schedule.code, props.courses)}</td>
        <td>{props.schedule.code}</td>
        <td>{props.schedule.AAyear}</td>
        <td>{props.schedule.semester}</td>
        <td>{props.schedule.roomId}</td>
        <td>{props.schedule.dayOfWeek}</td>
        <td>{props.schedule.startingTime}</td>
        <td>{props.schedule.endingTime}</td>
        <td><Button data-testid={"edit-" + props.schedule.scheduleId} onClick={() => props.edit(props.schedule)} variant="warning">Edit</Button></td>
    </tr>
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const startingTimes = ["8:30", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];
const endingTimes = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

class FormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { day: this.props.schedule.dayOfWeek, room: this.props.schedule.roomId, startingTime: this.props.schedule.startingTime, endingTime: this.props.schedule.endingTime, changed: null };
    }
    changeDay = (day) => {
        this.setState({ day: day, changed: somethingChanged(this.props.schedule, day, this.state.room, this.state.startingTime, this.state.endingTime) });
    }
    changeRoom = (roomId) => {
        this.setState({ room: roomId, changed: somethingChanged(this.props.schedule, this.state.day, roomId, this.state.startingTime, this.state.endingTime) });
    }
    changeST = (st) => {
        let et = this.state.endingTime;
        if (st >= et && st !== "8:30")
            et = updateEndingTime(st, endingTimes);
        this.setState({ startingTime: st, endingTime: et, changed: somethingChanged(this.props.schedule, this.state.day, this.state.room, st, et) });
    }
    changeET = (et) => {
        let st = this.state.startingTime;
        if (et <= st && st !== "8:30")
            st = updateStartingTime(et, startingTimes);
        this.setState({ startingTime: st, endingTime: et, changed: somethingChanged(this.props.schedule, this.state.day, this.state.room, st, et) });
    }
    handleSubmit = () => {
        this.props.submitData(this.state.day, this.state.room, this.state.startingTime, this.state.endingTime);
    }

    render() {
        return <Modal
            show={true}
            backdrop="static"
            size="lg"
            onHide={this.props.close}
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Schedule</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table bordered>
                    <thead style={{ whiteSpace: "nowrap" }}>
                        <tr>
                            <th>Course</th>
                            <th>AAyear</th>
                            <th>Semester</th>
                            <th>Room</th>
                            <th>Day</th>
                            <th>Starting Time</th>
                            <th>Ending Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{courseName(this.props.schedule.code, this.props.courses)}</td>
                            <td>{this.props.schedule.AAyear}</td>
                            <td>{this.props.schedule.semester}</td>
                            <td>{this.props.schedule.roomId}</td>
                            <td>{this.props.schedule.dayOfWeek}</td>
                            <td>{this.props.schedule.startingTime}</td>
                            <td>{this.props.schedule.endingTime}</td>
                        </tr>
                    </tbody>
                </Table><br />
                <Row>
                    <Col sm={3}>
                        <b>Day of the week:</b>
                        <Form.Control as="select" data-testid="daySelect" custom onChange={(ev) => { this.changeDay(ev.target.value) }} >
                            {daysOfWeek.map((d) => <option key={d} data-testid={"day-option"} value={d} selected={d === this.state.day ? true : false}>{d}</option>)}
                        </Form.Control>
                    </Col>
                    <Col sm={3}>
                        <b>Room:</b>
                        <Form.Control as="select" data-testid="roomSelect" custom onChange={(ev) => { this.changeRoom(ev.target.value) }} >
                            {this.props.rooms.map((r) => <option key={r.classId} data-testid={"room-option"} value={r.description} selected={r.description === this.state.room ? true : false}>{r.description}</option>)}
                        </Form.Control>
                    </Col>
                    <Col sm={3}>
                        <b>Starting Time:</b>
                        <Form.Control as="select" data-testid="stSelect" custom onChange={(ev) => { this.changeST(ev.target.value) }} >
                            {startingTimes.map((s) => <option key={s} data-testid={"st" + s} value={s} selected={s === this.state.startingTime ? true : false}>{s}</option>)}
                        </Form.Control>
                    </Col>
                    <Col sm={3}>
                        <b>Ending Time:</b>
                        <Form.Control as="select" data-testid="etSelect" custom onChange={(ev) => { this.changeET(ev.target.value) }} >
                            {endingTimes.map((e) => <option key={e} data-testid={"et" + e} value={e} selected={e === this.state.endingTime ? true : false}>{e}</option>)}
                        </Form.Control>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button name="submit" data-testid="form-submit" variant="secondary" disabled={!this.state.changed} onClick={() => this.handleSubmit()}>Submit</Button><Button name="close" data-testid="form-close" variant="secondary" onClick={this.props.close}>Close</Button>
            </Modal.Footer>
        </Modal>
    }
}

function courseName(code, courses) {
    for (let course of courses)
        if (course.code === code)
            return course.description
}

function roomDesc(id, rooms) {
    for (let room of rooms)
        if (room.classId === id)
            return room.description
}

function updateEndingTime(startingTime, endingTimes_) {
    let i = endingTimes_.indexOf(startingTime);
    i++;
    return endingTimes_[i];
}

function updateStartingTime(endingTime, startingTimes_) {
    let i = startingTimes_.indexOf(endingTime);
    i--;
    return startingTimes_[i];
}

function somethingChanged(oldSchedule, day, room, st, et) {
    if (oldSchedule.dayOfWeek !== day || oldSchedule.roomId !== room || oldSchedule.startingTime !== st || oldSchedule.endingTime !== et)
        return true;
    else
        return false;
}

export default SupportSchedulePage;