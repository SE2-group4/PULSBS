import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import moment from "moment";
import API from '../api/Api';
import StatsCalendar from '../components/StatsCalendar';
import CalendarEvent from "../entities/calendarEvent";
import Chart from '../components/Chart';
import ErrorMsg from '../components/ErrorMsg';
import BurgerSidebar from '../components/BurgerSidebar'
import Badge from 'react-bootstrap/Badge'
class TeacherStatsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: null, fetchError: false,
            selectedCourse: "", selectedMonths: [], selectedWeeks: [], from: undefined, to: undefined, granularity: "daily", loading: false, lectures: []
        }
    }
    fetchCourseLectures = async () => {
        this.setState({ loading: true })
        let items = []
        let lectures = []
        if (this.state.selectedCourse) {
            lectures = await API.getLecturesByCourseIdByTeacherId(this.props.user.userId, this.state.selectedCourse, null, null, true, true)
            for (let lecture of lectures)
                items.push(lecture)
        }
        this.setState({ lectures: items, loading: false })
    }
    generateGraph = async (selectedCourse, selectedWeeks, selectedMonths, from, to, granularity) => {
        this.setState({
            selectedCourse: selectedCourse, selectedWeeks: selectedWeeks,
            selectedMonths: selectedMonths, from: from, to: to, granularity: granularity
        }, this.fetchCourseLectures)
    }

    async componentDidMount() {
        API.getCoursesByTeacherId(this.props.user.userId)
            .then((courses) => {
                this.setState({ courses: courses })
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            })
    }

    render() {
        return (<>
            <BurgerSidebar courses={this.state.courses} generateGraph={this.generateGraph} />
            <Container fluid>
                <Row>
                    <Col sm="6"></Col>
                    <Col sm="6">
                        {this.state.selectedCourse &&
                            <h3><Badge variant="warning" >{courseName(this.state.selectedCourse, this.state.courses)}</Badge></h3>
                        }
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col sm="2"></Col>
                    <Col sm="10">
                        <Chart course={this.state.selectedCourse} weeks={this.state.selectedWeeks} from={this.state.from} to={this.state.to}
                            months={this.state.selectedMonths} granularity={this.state.granularity} userType={this.props.user.type} lectures={this.state.lectures} loading={this.state.loading} />
                    </Col>
                </Row>
            </Container>
        </>
        )
    }
}
function courseName(courseId, courses) {
    for (let course of courses)
        if (course.courseId == courseId)
            return course.description
}
/*
    constructor(props) {
        super(props);
        this.state = { user: props.user, courses: this.props.courses, lectures: [], loading: true, selectedLecture: null, fetchError: false };
    }

    async componentDidMount() {
        if (!this.props.fetchError)
            try {
                let lectures = [];
                let yesterday = moment().subtract("1", "day").toISOString();
                for (let c of this.state.courses)
                    lectures.push(await API.getLecturesByCourseIdByTeacherId(this.state.user.userId, c.courseId, null, yesterday, true)); //TODO add to date
                let allLectures = this.buildLectures(lectures);
                let events = this.buildEvents(allLectures, this.state.courses);
                this.setState({ lectures: [...allLectures], events: events, loading: false, showChart: false });
            } catch (error) {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            }
        else
            this.setState({ fetchError: this.props.fetchError, loading: false });
    }

    buildEvents = (all, courses) => {
        const events = []
        const colors = [
            'rgba(0, 222, 255, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(182, 255, 108, 0.6)',
            'rgba(214, 114, 77,0.6)',
            'rgba(217, 196, 76,0.6)'
        ];
        for (let lecture of all) {
            events.push(new CalendarEvent(events.length, courseName(courses, lecture.courseId), moment(lecture.startingDate).toISOString(), moment(lecture.startingDate).add(lecture.duration, "milliseconds").toISOString(), colors[getColorIndex(courses, lecture.courseId)], null, lecture.lectureId, lecture.courseId, lecture.bookingDeadline));
        }
        return events;
    }

    buildLectures = (all) => {
        let lecturesSet = [];
        for (let array of all)
            for (let lecture of array)
                if (lecture.delivery === "PRESENCE")
                    lecturesSet.push(lecture);
        return lecturesSet;
    }

    updateSelected = (lectureId) => {
        this.setState({ selectedLecture: lectureId, showChart: true });
    }

    closeError = () => {
        this.setState({ fetchError: false });
    }

    render() {
        return <>{this.state.loading && <Spinner animation="border" />}
            {!this.state.loading && <Container fluid>
                <Row>
                    <Col sm="6">
                        <StatsCalendar lessons={this.state.events} updateSelected={this.updateSelected} />
                    </Col>
                    <Col sm="6">
                        {this.state.fetchError && <Col sm="4">
                            <ErrorMsg msg={this.state.fetchError} onClose={this.closeError} />
                        </Col>}
                        {this.state.showChart && <Chart lectures={this.state.lectures} courses={this.state.courses} lecture={getLecture(this.state.lectures, this.state.selectedLecture)} />}
                    </Col>
                </Row>
            </Container>}
        </>;
    }
}

function courseName(courses, courseId) {
    for (let c of courses)
        if (c.courseId === courseId)
            return c.description;
}

function getLecture(lectures, lectureId) {
    for (let l of lectures)
        if (l.lectureId === lectureId)
            return l;
}

function getColorIndex(courses, courseId) {
    let i;
    courses.forEach(function (item, index) {
        if (courseId === item.courseId)
            i = index;

    })
    return i;
}*/

export default TeacherStatsPage;