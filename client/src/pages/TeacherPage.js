import React from 'react';
import Container from "react-bootstrap/Container"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import API from "../api/Api";
import APIfake from '../tests/APIfake';
import {CoursePanel,LecturePanel,StudentPanel} from '../components/TeacherComp';
import InfoPanel from '../components/InfoPanel';

/**
 *  elementForPage is a configuration parameter to limit the number of entries of the tables showing courses/lectures/students
 *  in the same instance (min value: 2)
 */
const elementForPage=2;

class TeacherPage extends React.Component {

    /**
     * TeacherPage constructor
     * @param {User} props 
     */
    constructor(props){
        super(props);
        this.state = {user : props.user,courses : [],lectures : [],students : [],
                        selectedCourse: null,selectedLecture: null,
                        courseMap: new Map(),cPages: 1,
                        lectureMap: new Map(),lPages: 1,
                        studentMap: new Map(),sPages: 1,
                        fetchErrorC: false,fetchErrorL: false,fetchErrorS: false };
    }
    
    /**
     * componentDidMount fetch the all courses of the teacher 
     */
    componentDidMount(){
        API.getCoursesByTeacherId(this.state.user.userId)
        .then((courses)=>{
            let i=0;
            let nMap=new Map(); 
            courses.map((c)=>{
            nMap.set(c.courseId,Math.floor(i/elementForPage));
            i++;})
            let nPages=Math.ceil(i/elementForPage);
            console.log(courses);
            this.setState({courses : courses,courseMap: nMap,cPages: nPages,fetchErrorC: false});
        })
        .catch(() =>{ this.setState({fetchErrorC: true}); });
    }

    updateLectures = (courseId) =>{
        API.getLecturesByCourseIdByTeacherId(this.state.user.userId,courseId)
        .then((lectures)=>{
            let i=0;
            let nMap=new Map(); 
            lectures.map((l)=>{
            nMap.set(l.lectureId,Math.floor(i/elementForPage));
            i++;})
            let nPages=Math.ceil(i/elementForPage);
            this.setState({lectures : lectures,lectureMap: nMap,lPages: nPages,selectedCourse: courseId,selectedLecture: null,fetchErrorL: false,students: [],sPages: 1,fetchErrorS: false});
        })
        .catch(() =>{ this.setState({selectedCourse: courseId,lectures: [],selectedLecture: null,lPages: 1,fetchErrorL: true,students: [],sPages: 1,fetchErrorS: false}); });
    }

    updateStudents = (lectureId) =>{
        API.getStudentsByLecture(this.state.user.userId,this.state.selectedCourse,lectureId)
        .then((students)=>{
            let i=0;
            let nMap=new Map(); 
            students.map((s)=>{
            nMap.set(s.studentId,Math.floor(i/elementForPage));
            i++;})
            let nPages=Math.ceil(i/elementForPage);
            this.setState({students : students,studentMap: nMap,sPages: nPages,selectedLecture: lectureId,fetchErrorS: false})
        })
        .catch(() =>{ this.setState({selectedLecture: lectureId,students: [],sPages: 1,fetchErrorS: true}); });
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
                    <CoursePanel courses={this.state.courses} sCourse={this.state.selectedCourse} pageMap={this.state.courseMap} nPages={this.state.cPages} update={this.updateLectures} fetchError={this.state.fetchErrorC}/>
                </Col>
                </Row>
                <Row>
                <Col sm='6'>
                    <LecturePanel lectures={this.state.lectures} sLecture={this.state.selectedLecture} pageMap={this.state.lectureMap} nPages={this.state.lPages} update={this.updateStudents} fetchError={this.state.fetchErrorL}/>
                </Col>
                <Col sm='6'>
                    <StudentPanel students={this.state.students} pageMap={this.state.studentMap} nPages={this.state.sPages} fetchError={this.state.fetchErrorS}/>
                </Col>
                </Row>
            </Container>
            </>
        );
    }
}

export default TeacherPage;
