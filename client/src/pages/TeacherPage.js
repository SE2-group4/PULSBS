import React from 'react';
import Container from "react-bootstrap/Container"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import API from "../api/Api";
import APIfake from '../tests/APIfake';
import {CoursePanel,LecturePanel,StudentPanel} from '../components/TeacherComp';
import InfoPanel from '../components/InfoPanel';

class TeacherPage extends React.Component {

    /**
     * TeacherPage constructor
     * @param {User} props 
     */
    constructor(props){
        super(props);
        this.state = {user : props.user,courses : [],lectures : [],students : []};
    }
    /**
     * componentDidMount fetch the all courses of the teacher 
     */
    componentDidMount(){
        //to_do
        this.getCoursesByTeacherId(this.state.user.userId);
    }
    
    getCoursesByTeacherId = (teacher) =>{
        APIfake.getCoursesByTeacherId(teacher)
        .then((courses)=>{
            this.setState({courses : courses})
        })
        .catch();
    }

    updateLectures = (courseId) =>{
        APIfake.getLecturesByCourseIdT(this.state.user.userId,courseId)
        .then((lectures)=>{
            this.setState({lectures : lectures})
        })
        .catch();
    }

    updateStudents = (lectureId) =>{
        APIfake.getStudentsByLectureId(lectureId)
        .then((students)=>{
            this.setState({students : students})
        })
        .catch();
    }

    render(){
        return(
            <>
            <Container fluid>
                <Row>
                <Col sm='4'>
                    <InfoPanel user={this.state.user}/>
                </Col>
                <Col sm='8'>
                    <CoursePanel courses={this.state.courses} update={this.updateLectures}/>
                </Col>
                </Row>
                <Row>
                <Col sm='6'>
                    <LecturePanel lectures={this.state.lectures} update={this.updateStudents}/>
                </Col>
                <Col sm='6'>
                    <StudentPanel students={this.state.students}/>
                </Col>
                </Row>
            </Container>
            </>
        );
    }
}

export default TeacherPage;