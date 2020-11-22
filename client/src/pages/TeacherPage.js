import React from 'react';
import Container from "react-bootstrap/Container"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import API from "../api/Api";
import {CoursePanel,LecturePanel,StudentPanel,EditModal} from '../components/TeacherComp';

import APIfake from '../api/APIfake';
import Lecture from '../entities/lecture';

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
        this.state = {user : props.user,
                        courses : [],lectures : [],students : [],                       //elements
                        selectedCourse: null,selectedLecture: null,                     //selected elements
                        lectureIdToUpdate: null,deliveryToUpdate: null,                 //change modality management
                        courseMap: new Map(),cPages: 1,                                 //course pagination
                        lectureMap: new Map(),lPages: 1,                                //lecture pagination
                        studentMap: new Map(),sPages: 1,                                //student pagination
                        fetchErrorC: false,fetchErrorL: false,fetchErrorS: false };     //fetch errors
    }
    
    /**
     * componentDidMount fetches the all courses of the teacher 
     */
    componentDidMount(){
        APIfake.getCoursesByTeacherId(this.state.user.userId)
        .then((courses)=>{
            let i=0;
            let nMap=new Map(); 
            //courses.map((c)=>{
            //nMap.set(c.courseId,Math.floor(i/elementForPage));
            //i++;})
            courses.forEach(function(item){
                nMap.set(item.courseId,Math.floor(i/elementForPage));
                i++;
            });
            let nPages=Math.ceil(i/elementForPage);
            console.log(courses);
            this.setState({courses : courses,courseMap: nMap,cPages: nPages,fetchErrorC: false});
        })
        .catch(() =>{ this.setState({fetchErrorC: true}); });
    }

    /**
     * updateLectures fetches all lectures of the selected teacher's course 
     */
    updateLectures = (courseId) =>{
        APIfake.getLecturesByCourseIdT(this.state.user.userId,courseId)
        .then((lectures)=>{
            let i=0;
            let nMap=new Map(); 
            //lectures.map((l)=>{
            //nMap.set(l.lectureId,Math.floor(i/elementForPage));
            //i++;})
            lectures.forEach(function(item){
                nMap.set(item.lectureId,Math.floor(i/elementForPage));
                i++;
            });
            let nPages=Math.ceil(i/elementForPage);
            console.log(lectures);
            this.setState({lectures : lectures,lectureMap: nMap,lPages: nPages,selectedCourse: courseId,selectedLecture: null,fetchErrorL: false,students: [],sPages: 1,fetchErrorS: false});
        })
        .catch(() =>{ this.setState({selectedCourse: courseId,lectures: [],selectedLecture: null,lPages: 1,fetchErrorL: true,students: [],sPages: 1,fetchErrorS: false}); });
    }

    /**
     * updateStudents fetches all students of the selected lecture of a teacher's selected course 
     */
    updateStudents = (lectureId) =>{
        //API.getStudentsByLecture(this.state.user.userId,this.state.selectedCourse,lectureId)
        APIfake.getStudentsByLectureId(this.state.user.userId)
        .then((students)=>{
            let i=0;
            let nMap=new Map(); 
            //students.map((s)=>{
            //nMap.set(s.studentId,Math.floor(i/elementForPage));
            //i++;})
            students.forEach(function(item){
                nMap.set(item.studentId,Math.floor(i/elementForPage));
                i++;
            });
            let nPages=Math.ceil(i/elementForPage);
            this.setState({students : students,studentMap: nMap,sPages: nPages,selectedLecture: lectureId,fetchErrorS: false})
        })
        .catch(() =>{ this.setState({selectedLecture: lectureId,students: [],sPages: 1,fetchErrorS: true}); });
    }

    /**
     * resetSelected lets to reset the selected course/lecture (and related states)
     */
    resetSelected = (type) =>{
        switch(type){
            case "course":
                this.setState({selectedCourse: null,lectures: [],selectedLecture: null,lPages: 1,fetchErrorL: false,students: [],sPages: 1,fetchErrorS: false})
            break;
            case "lecture":
                this.setState({selectedLecture: null,students: [],sPages: 1,fetchErrorS: false});
            break;
            default:
            break;
        }
    }

    // EditModal handlers
    showEditModal = (lectureId,delivery) =>{
        this.setState({lectureIdToUpdate: lectureId,deliveryToUpdate: delivery});
    }

    closeEditModal = () =>{
        this.setState({lectureIdToUpdate: null,deliveryToUpdate: null});
    }

    updateDelivery = () =>{
        var deliveryToUpdate=this.state.deliveryToUpdate;
        var newDel=deliveryToUpdate==="inPresence" ? "remote" : "inPresence";
        //API.updateDeliveryByLecture(this.state.user.userId,this.state.selectedCourse,this.state.lectureIdToUpdate,newDel)
        //.then(())=>{
        //    
        //}).catch(()=>{});
        var newLectures=this.state.lectures.slice();
        var newLecture,i;
        var lectureIdToUpdate=this.state.lectureIdToUpdate;
        //console.log(lectureIdToUpdate);
        newLectures.forEach(function (item,index){
            //console.log(item.lectureId+" "+lectureIdToUpdate);
            if(item.lectureId==lectureIdToUpdate){
                newLecture=new Lecture(item.lectureId,item.courseId,item.classId,item.date,item.bookingDeadline,newDel);
                i=index;
            }
        });
        //console.log(newLecture);
        //console.log(i);
        newLectures.splice(i,1,newLecture);
        this.setState({lectures: newLectures,lectureIdToUpdate: null,deliveryToUpdate: null});
    }

    render(){
        return(
            <>
             { this.state.lectureIdToUpdate &&
            <EditModal editClose={this.closeEditModal} lectureId={this.state.lectureIdToUpdate} delivery={this.state.deliveryToUpdate} updateDelivery={this.updateDelivery}/>}
            <Container fluid>
                <Row>
                <Col sm={8}>
                <CoursePanel courses={this.state.courses} fetchError={this.state.fetchErrorC}                   //courses
                sCourse={this.state.selectedCourse} pageMap={this.state.courseMap} nPages={this.state.cPages}   //courses pagination
                update={this.updateLectures} reset={this.resetSelected}                                         //interaction with Lecture Panel
                />
                <br/>
                <br/>
                <LecturePanel lectures={this.state.lectures} fetchError={this.state.fetchErrorL}                                            //lectures
                sLecture={this.state.selectedLecture} pageMap={this.state.lectureMap} nPages={this.state.lPages}                            //lectures pagination
                update={this.updateStudents} reset={this.resetSelected}                                                                     //interaction with Student Panel                                                 
                lectureId={this.state.lectureIdToUpdate} deliveryToUpdate={this.state.deliveryToUpdate} showEditModal={this.showEditModal}  //EditModality management                                                                     
                />   
                <br/>
                <br/>
                <StudentPanel students={this.state.students} fetchError={this.state.fetchErrorS}    //students
                pageMap={this.state.studentMap} nPages={this.state.sPages}                          //students pagination
                />
                </Col>
                <Col sm={4}><> </></Col>
                </Row>
            </Container>
            </>
        );
    }
}

export default TeacherPage;
