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
import ErrorMsg from '../components/ErrorMsg'
import moment from "moment";

/**
 * Student Page component
 */
class StudentPage extends React.Component {
    constructor(props){
        super(props);
        this.state={user : props.user};
    }
    /**
     * At the creation of the page this component fetches all the courses, all the lectures and all the booking lectures
     */
    async componentDidMount(){
        try{
        const courses = await APIfake.getCoursesByStudentId(this.state.user.userId);
        const bookedLectures = await APIfake.getBookedLectures(this.state.user.userId);
        const allLectures = await this.getAllLectures(courses);
        const events = buildEvents(bookedLectures,allLectures,courses); //build the events for the calendar
        this.setState({courses: courses, events : events});
        } catch(err){
            this.setState({fetchError : err})
        }
    }
    /**
     * Fetch all lectures of all courses
     * @param {*} courses 
     */
    async getAllLectures(courses){
        let lectures = []
        try{
        for (let c of courses)
            lectures.push(await APIfake.getLecturesByCourseId(this.state.user.userId,c.courseId))
        return lectures;
        }catch (err){
            throw new Error(err);
        }

    }

     handleConfirm = async (status,courseId,lectureId)=>{
        return new Promise ((resolve,reject)=>{
        if (status==="booked"){
            APIfake.cancelLectureReservation(this.state.user.userID,courseId,lectureId)
            .then(async()=>{
                console.log("ok cancellato");
                let n = await this.changeEvent(lectureId,"green","bookable")
                resolve(n)
            })
            .catch()
        }
        if (status==="bookable"){
            APIfake.bookALecture(this.state.user.userID,courseId,lectureId)
            .then(async ()=>{
                console.log("ok prenotato");
                let n = await this.changeEvent(lectureId,"blue","booked")
                console.log(n)
                resolve(n)
            })
            .catch()
            }
        })
        
    }   
    changeEvent = async (lectureId,color,status) =>{
        return new Promise((resolve,reject)=>{
        const events = this.state.events;
        for (let i=0;i<events.length;i++)
            if(events[i].lectureId===lectureId){
                events[i].color=color;
                events[i].status=status;
                this.setState({events : events})
                resolve(events[i]);
            }
        });
    }
    render(){
        if (this.state.fetchError)
            return <ErrorMsg msg={this.state.fetchError}/>
        return(
        <>
            <Container fluid>
            <Row>
            <Col sm="1">
                <Sidebar courses={this.state.courses} setFilters={this.setFilters}/>
            </Col>
            <Col sm="11">
                <Calendar lessons={this.state.events} handleConfirm={this.handleConfirm}/>
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
                events.push(new CalendarEvent(events.length,courseName(courses,lecture.courseId),moment(lecture.date).toISOString(),moment(lecture.date).add("1","hour").toISOString(),"blue","booked",lecture.lectureId,lecture.courseId,lecture.bookingDeadline))
            else if(moment(lecture.date).isBefore(moment()))
                events.push(new CalendarEvent(events.length,courseName(courses,lecture.courseId),moment(lecture.date).toISOString(),moment(lecture.date).add("1","hour").toISOString(),"black","past",lecture.lectureId,lecture.courseId,lecture.bookingDeadline))
            else if (moment(lecture.bookingDeadline).isBefore(moment()))
                events.push(new CalendarEvent(events.length,courseName(courses,lecture.courseId),moment(lecture.date).toISOString(),moment(lecture.date).add("1","hour").toISOString(),"red","expired",lecture.lectureId,lecture.courseId,lecture.bookingDeadline))
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