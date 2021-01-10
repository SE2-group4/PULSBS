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

const schedulesFake = [
    new Schedule(1, 5, 1, 1, 1, 10, 'Mon', '8:30', '11:30'),
    new Schedule(2, 6, 1, 1, 1, 10, 'Wed', '14:30', '16:00'),
];
const rooms = ["r1", "r2", "r3"]; //to call

class SupportSchedulePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { schedules: null, courses: null, rooms: null, filters: null, genError: null, loading: true, currPage: 1, selectedSchedule: null }
    }

    async componentDidMount() {
        try {
            //let schedules=API.getSchedulesBySupportId(this.props.user.userId);
            let courses = await API.getCoursesBySupportId(this.props.user.userId);
            //let rooms_=API.getRoomsBySupportId(this.props.user.userId);
            let rooms_ = rooms; //actual call
            //debug only (start)
            schedulesFake.forEach((item) => {
                if (rooms_.indexOf(item.roomId) === -1)
                    rooms_.push(item.roomId)
            });
            //debug only (end)
            let filters = courses.map((c) => c.description);
            this.setState({ schedules: schedulesFake, courses: courses, rooms: rooms, filters: filters, loading: false });
        } catch (error) {
            let errormsg = error.source + " : " + error.error;
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
            filters = this.state.courses.map((c) => c.description);
        else
            filters = [desc,];
        this.setState({ filters: filters });

    }

    submit = (day, room, startingTime, endingTime) => {
        this.setState({ loading: true });
        let newSchedule = new Schedule();
        newSchedule.scheduleId = this.state.selectedSchedule.scheduleId;
        newSchedule.dayOfWeek = this.state.selectedSchedule.dayOfWeek === day ? null : day;
        newSchedule.roomId = this.state.selectedSchedule.roomId === room ? null : room;
        newSchedule.startingTime = this.state.selectedSchedule.startingTime === startingTime ? null : startingTime;
        newSchedule.endingTime = this.state.selectedSchedule.endingTime === endingTime ? null : endingTime;
        /*
        API.changeScheduleData(this.props.user.userId,scheduleId,day,room,startingTime,endingTime)
        .then(()=>{
            //all ok
        })
        .catch(()=>{
            //error
            let errormsg = err.source + " : " + err.error;
            this.setState({ genError: errormsg,loading: false });
        });
        */
        {
            //ok from server
            console.log(newSchedule);
            let schedules = this.state.schedules;
            let i = schedules.indexOf(this.state.selectedSchedule);
            schedules[i].dayOfWeek = day;
            schedules[i].roomId = room;
            schedules[i].startingTime = startingTime;
            schedules[i].endingTime = endingTime;
            this.setState({ schedules: schedules, loading: false, selectedSchedule: null });
        }

    }

    render() {
        if (this.state.loading)
            return <Spinner animation="border" ></Spinner>;
        if (this.state.genError)
            return <ErrorMsg msg={this.state.genError} />;

        return <>
            {this.state.selectedSchedule && <FormModal schedule={this.state.selectedSchedule} close={this.closeModal} courses={this.state.courses} rooms={this.state.rooms} submitData={this.submit} />}
            <Container fluid>
                <Row>
                    <Col sm={10}>
                        <Col sm={4}>
                            <Filters courses={this.state.courses} change={this.changeFilters} />
                        </Col>
                        <br />
                        <ScheduleTable schedules={this.state.schedules} current={this.state.currPage} edit={this.openModal} courses={this.state.courses} filters={this.state.filters} />
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
                {props.courses.map((course) => { return (<option key={course.courseId} data-testid={"c" + course.courseId} value={course.description} >{course.description}</option>) })}
            </Form.Control>
        </Jumbotron>;
}

function ScheduleTable(props) {
    let filtered = props.schedules.filter((s) => props.filters.indexOf(courseName(s.code, props.courses)) !== -1);
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
                tableEntries.push(<ScheduleRow key={schedule.scheduleId} schedule={schedule} edit={props.edit} courses={props.courses} />);
        }
    }

    return <>
        <Table striped hover>
            <thead style={{ whiteSpace: "nowrap" }}>
                <tr>
                    <th>Schedule Id</th>
                    <th>Course</th>
                    <th>AAyear</th>
                    <th>Semester</th>
                    <th>Room Id</th>
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
        {nPages > 1 && <Pagination onClick={(ev) => this.onClick(ev.target.text)}>{items}</Pagination>}
        {filtered.length === 0 && <label>No schedules available.</label>}
    </>;
}

function ScheduleRow(props) {
    return <tr>
        <td>{props.schedule.scheduleId}</td>
        <td>{courseName(props.schedule.code, props.courses)}</td>
        <td>{props.schedule.AAyear}</td>
        <td>{props.schedule.semester}</td>
        <td>{props.schedule.roomId}</td>
        <td>{props.schedule.dayOfWeek}</td>
        <td>{props.schedule.startingTime}</td>
        <td>{props.schedule.endingTime}</td>
        <td><Button onClick={() => props.edit(props.schedule)} variant="warning">Edit</Button></td>
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
                <Table>
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
                            {daysOfWeek.map((d) => <option key={d} data-testid={"day" + d} value={d} selected={d === this.state.day ? true : false}>{d}</option>)}
                        </Form.Control>
                    </Col>
                    <Col sm={3}>
                        <b>Room Id:</b>
                        <Form.Control as="select" data-testid="roomSelect" custom onChange={(ev) => { this.changeRoom(ev.target.value) }} >
                            {this.props.rooms.map((r) => <option key={r} data-testid={"room" + r} value={r} selected={r === this.state.room ? true : false}>{r}</option>)}
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

function courseName(id, courses) {
    for (let course of courses)
        if (course.courseId === id)
            return course.description
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
    if (oldSchedule.dayOfWeek !== day || (oldSchedule.roomId).toString() !== room || oldSchedule.startingTime !== st || oldSchedule.endingTime !== et)
        return true;
    else
        return false;
}

export default SupportSchedulePage;