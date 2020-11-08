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
        this.state = {user : props.user,courses : null};
    }
    /**
     * componentDidMount fetch the all courses of the student 
     */
    componentDidMount(){
        APIfake.getCoursesByStudentId(this.state.user.userId)
        .then((courses) =>{
            this.setState ({courses : courses});
        })
        .catch()
    }
    bookALecture = (course,lecture) =>{
        APIfake.bookALecture(course.courseId,lecture.lectureId)
        .then()
        .catch()
    }
    render(){
        return(
            <>
            <Container fluid>
                <Row>
                <Col sm='4'>
                    {console.log(this.state.user)}
                    <InfoPanel user={this.state.user}/>
                </Col>
                <Col sm='8'>
                    <BookingLectureForm courses={this.state.courses} bookALecture={this.bookALecture} user = {this.state.user}/>
                </Col>
                </Row>
            </Container>
            </>
        );
    }
}

export default StudentPage