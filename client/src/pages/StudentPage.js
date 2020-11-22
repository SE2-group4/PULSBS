import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import API from "../api/Api";
import InfoPanel from '../components/InfoPanel';
import BookingLectureForm from '../components/BookingLectureForm';
import Sidebar from '../components/Sidebar';
import Calendar from '../components/Calendar';
import Lecture from '../entities/lecture';
import moment from "moment";
const bookedLectures=[new Lecture(1,1,1,"20/20/2020 15:00","eeeee")]
const lessons = [{
        id:1,
        title:"Prova",
        start: moment().toISOString(),
        end: moment().add("1","hour").toISOString(),
        color : "red"
        },{
            id:2,
        title:"Prova2",
        start: moment().add("2","hour").toISOString(),
        end: moment().add("3","hour").toISOString(),
        color : "green"
        }]
class StudentPage extends React.Component {
    constructor(props){
        super(props);
        this.state={user : props.user};
    }

    async componentDidMount(){
        const courses = await API.getCoursesByStudentId(this.state.user.userId);
        //const bookedLectures = await API.getBookedLectures(this.state.user.userId);
        //const allLectures = await API.getAllLectures(this.state.user.userId);
        console.log(courses);
        this.setState({courses: courses, bookedLectures : bookedLectures});
    }
    
    
    render(){
        return(
        <>
            <Container fluid>
            <Row>
            <Col sm="4">
                <Sidebar courses={this.state.courses} bookedLectures={this.state.bookedLectures}/>
            </Col>
            <Col sm="8">
                <Calendar lessons={lessons}/>
            </Col>
            </Row>
            </Container>
        </>);
    }
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