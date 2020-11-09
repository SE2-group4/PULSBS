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
        this.state = {user : props.user,courses : [],lectures : [],students : [],
                        selectedCourse: null,selectedLecture: null};
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
            this.setState({selectedCourse: courseId,selectedLecture: null,students: [],lectures : lectures})
        })
        .catch();
    }

    updateStudents = (lectureId) =>{
        APIfake.getStudentsByLectureId(lectureId)
        .then((students)=>{
            this.setState({selectedLecture: lectureId,students : students})
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
                    <CoursePanel courses={this.state.courses} sCourse={this.state.selectedCourse} update={this.updateLectures}/>
                </Col>
                </Row>
                <Row>
                <Col sm='6'>
                    <LecturePanel lectures={this.state.lectures} sLecture={this.state.selectedLecture} update={this.updateStudents}/>
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