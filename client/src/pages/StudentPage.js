import React from 'react';
import Container from "react-bootstrap/Container"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import API from "../api/Api";
import APIfake from '../tests/APIfake';
import InfoPanel from '../components/InfoPanel'
import BookingLectureForm from '../components/BookingLectureForm'

class StudentPage extends React.Component {

    /**
     * StudentPage constructor
     * @param {User} props 
     */
    constructor(props){
        super(props);
        this.state = {user : props.user,courses : null,booked : false,bookingError : null};
    }
    /**
     * componentDidMount fetch the all courses of the student 
     */
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
                <Row>
                <Col sm='3'>
                    <InfoPanel user={this.state.user}/>
                </Col>
                <Col sm='9'>
                    {this.state.courses && <BookingLectureForm courses={this.state.courses} bookALecture={this.bookALecture} user = {this.state.user} isBookedDone={this.state.booked} 
                    handleFinishBooking={this.handleFinishBooking} bookingError={this.state.bookingError} onClose={this.onClose}></BookingLectureForm>}
                </Col>
                </Row>
            </Container>
            </>
        );
    }
}

export default StudentPage