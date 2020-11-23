import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import API from "../api/Api";
import APIfake from "../api/APIfake";
import InfoPanel from '../components/InfoPanel';
import BookingLectureForm from '../components/BookingLectureForm';
import Sidebar from '../components/Sidebar';
import Calendar from '../components/Calendar';
import Lecture from '../entities/lecture';
import CalendarEvent from "../entities/calendarEvent";
import moment from "moment";
const bookedLectures=[new Lecture(1,1,1,"20/20/2020 15:00","eeeee")]
const lessons = [{
        id:1,
        title:"Prova",
        start: moment().toISOString(),
        end: moment().add("1","hour").toISOString(),
        color : "red",
        status : "booked"
        },{
            id:2,
        title:"Prova2",
        start: moment().add("2","hour").toISOString(),
        end: moment().add("3","hour").toISOString(),
        color : "green",
        status : "bookable"
        }]
class StudentPage extends React.Component {
    constructor(props){
        super(props);
        this.state={user : props.user};
    }

    async componentDidMount(){
        const courses = await APIfake.getCoursesByStudentId(this.state.user.userId);
        const bookedLectures = await APIfake.getBookedLectures(this.state.user.userId);
        const allLectures = await this.getAllLectures(courses);
        console.log(courses);
        const events = buildEvents(bookedLectures,allLectures,courses);
        this.setState({courses: courses, events : events});
    }
    
    async getAllLectures(courses){
        let lectures = []
        for (let c of courses)
            lectures.push(await APIfake.getLecturesByCourseId(this.state.user.userId,c.courseId))
        return lectures;
    }

    render(){
        return(
        <>
            <Container fluid>
            <Row>
            <Col sm="4">
                <Sidebar courses={this.state.courses}/>
            </Col>
            <Col sm="8">
                <Calendar lessons={this.state.events}/>
            </Col>
            </Row>
            </Container>
        </>);
    }
}

function buildEvents(booked,all,courses){
    const events =[]
    for (let array of all)
        for (let lecture of array){
            if(booked.includes(lecture))
                events.push(new CalendarEvent(events.length,courseName(courses,lecture.courseId),moment(lecture.date).toISOString(),moment(lecture.date).add("1","hour").toISOString(),"red","booked",lecture.lectureId,lecture.courseId,lecture.bookingDeadline))
            else if(moment(lecture.date).isBefore(moment()))
                events.push(new CalendarEvent(events.length,courseName(courses,lecture.courseId),moment(lecture.date).toISOString(),moment(lecture.date).add("1","hour").toISOString(),"black","",lecture.lectureId,lecture.courseId,lecture.bookingDeadline))
            else if (moment(lecture.bookingDeadline).isBefore(moment()))
                events.push(new CalendarEvent(events.length,courseName(courses,lecture.courseId),moment(lecture.date).toISOString(),moment(lecture.date).add("1","hour").toISOString(),"grey","",lecture.lectureId,lecture.courseId,lecture.bookingDeadline))
            else events.push(new CalendarEvent(events.length,courseName(courses,lecture.courseId),moment(lecture.date).toISOString(),moment(lecture.date).add("1","hour").toISOString(),"green","bookable",lecture.lectureId,lecture.courseId,lecture.bookingDeadline))
        }
    return events;
}

function courseName(courses,courseId){
    for (let c of courses)
        if(c.courseId===courseId)
            return c.description;
}





/*
class StudentPage extends React.Component {
    /**
     * StudentPage constructor
     * @param {User} props 
     
    constructor(props){
        super(props);
        this.state = {user : props.user,courses : null,booked : false,bookingError : null};
    }
    /**
     * componentDidMount fetch the all courses of the student 
     
    componentDidMount(){
        API.getCoursesByStudentId(this.state.user.userId)
        .then((courses) =>{
            console.log(courses);
            this.setState ({courses : courses});
        })
        .catch()
    }
    bookALecture = (course,lecture) =>{
        API.bookALecture(this.state.user.userId,course.courseId,lecture.lectureId)
        .then(()=>this.setState({booked : true}))
        .catch((err)=>this.setState({bookingError : err}));
    }
    handleFinishBooking = ()=>{
        this.setState({booked : false});
    }
    onClose = () => {
        this.setState({bookingError : null});
    }
    render(){
        return(
            <>
            <Container fluid>
                    {this.state.courses && <BookingLectureForm courses={this.state.courses} bookALecture={this.bookALecture} user = {this.state.user} isBookedDone={this.state.booked} 
                    handleFinishBooking={this.handleFinishBooking} bookingError={this.state.bookingError} onClose={this.onClose}></BookingLectureForm>}
            </Container>
            </>
        );
    }
}*/

export default StudentPage