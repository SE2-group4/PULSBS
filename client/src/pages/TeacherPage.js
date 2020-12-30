import React from 'react';
import Container from "react-bootstrap/Container"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import API from "../api/Api";
import ErrorMsg from '../components/ErrorMsg';
import { CoursePanel, LecturePanel, StudentPanel, EditModal, DeleteModal } from '../components/TeacherComp';
import Lecture from '../entities/lecture';

/**
 *  elementForPage is a configuration parameter to limit the number of entries of the tables showing courses/lectures/students
 *  in the same instance (min value: 2)
 */
const elementForPage = 4;
const studentForPage = 10;

class TeacherPage extends React.Component {

    /**
     * TeacherPage constructor
     * @param {User} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            courses: [], lectures: [], students: [],                         //elements
            selectedCourse: null, selectedLecture: null,                     //selected elements
            lectureIdToUpdate: null, deliveryToUpdate: null,                 //change delivery management
            lectureIdToDelete: null,                                         //delete lecture
            currCPage: 1,                                                    //course pagination
            currLPage: 1,                                                    //lecture pagination
            currSPage: 1,                                                    //student pagination
            fetchErrorC: false, fetchErrorL: false, fetchErrorS: false,      //fetch errors
            lectureLoading: false, studentLoading: false                     //loadings
        };
    }

    /**
     * componentDidMount fetches the all courses of the teacher 
     */
    componentDidMount() {
        let courses = this.props.courses;
        let fetchError = this.props.fetchError;
        if (fetchError)
            this.setState({ fetchErrorC: fetchError });
        else {
            this.setState({ courses: courses });
        }
    }

    /**
     * updateLectures fetches all lectures of the selected teacher's course 
     */
    updateLectures = (courseId) => {
        this.setState({ lectureLoading: true });
        let now = new Date().toISOString();
        API.getLecturesByCourseIdByTeacherId(this.state.user.userId, courseId, now)
            .then((lectures) => {
                this.setState({ lectures: lectures, selectedCourse: courseId, selectedLecture: null, fetchErrorL: false, students: [], fetchErrorS: false, lectureLoading: false, currLPage: 1 });
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ selectedCourse: courseId, lectures: [], selectedLecture: null, fetchErrorL: errormsg, students: [], fetchErrorS: false, lectureLoading: false, currLPage: 1 });
            });
    }

    /**
     * updateStudents fetches all students of the selected lecture of a teacher's selected course 
     */
    updateStudents = (lectureId) => {
        this.setState({ studentLoading: true });
        API.getStudentsByLecture(this.state.user.userId, this.state.selectedCourse, lectureId)
            .then((students) => {
                this.setState({ students: students, selectedLecture: lectureId, fetchErrorS: false, studentLoading: false, currSPage: 1 })
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ selectedLecture: lectureId, students: [], fetchErrorS: errormsg, studentLoading: false, currSPage: 1 });
            });
    }

    /**
     * resetSelected lets to reset the selected course/lecture (and related states)
     */
    resetSelected = (type) => {
        switch (type) {
            case "course":
                this.setState({ selectedCourse: null, lectures: [], selectedLecture: null, lPages: 1, fetchErrorL: false, students: [], sPages: 1, fetchErrorS: false })
                break;
            case "lecture":
                this.setState({ selectedLecture: null, students: [], sPages: 1, fetchErrorS: false });
                break;
        }
    }

    changePage = (name, number) => {
        if (name === "currCPage")
            this.setState({ currCPage: number });
        else if (name === "currLPage")
            this.setState({ currLPage: number });
        else
            this.setState({ currSPage: number });
    }

    //Error handler
    closeError = (errorName) => {
        this.setState({ [errorName]: false });
    }

    // EditModal handlers
    showEditModal = (lectureId, delivery) => {
        this.setState({ lectureIdToUpdate: lectureId, deliveryToUpdate: delivery });
    }

    // EditModal handlers
    showDeleteModal = (lectureId) => {
        this.setState({ lectureIdToDelete: lectureId });
    }

    closeEditModal = () => {
        this.setState({ lectureIdToUpdate: null, deliveryToUpdate: null });
    }

    closeDeleteModal = () => {
        this.setState({ lectureIdToDelete: null });
    }

    updateDelivery = () => {
        var deliveryToUpdate = this.state.deliveryToUpdate;
        var newDel = deliveryToUpdate == 'PRESENCE' ? 'REMOTE' : 'PRESENCE';
        API.updateDeliveryByLecture(this.state.user.userId, this.state.selectedCourse, this.state.lectureIdToUpdate, newDel)
            .then(() => {
                //ok from server
                var newLectures = this.state.lectures.slice();
                var newLecture, i;
                var lectureIdToUpdate = this.state.lectureIdToUpdate;
                newLectures.forEach(function (item, index) {
                    if (item.lectureId == lectureIdToUpdate) {
                        newLecture = new Lecture(item.lectureId, item.courseId, item.classId, item.startingDate, item.duration, item.bookingDeadline, newDel);
                        i = index;
                    }
                });
                newLectures.splice(i, 1, newLecture);
                this.setState({ lectures: newLectures, lectureIdToUpdate: null, deliveryToUpdate: null });
            }).catch((error) => {
                //!ok from server
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchErrorL: errormsg, lectureIdToUpdate: null, deliveryToUpdate: null });
            });
    }

    deleteLecture = () => {
        API.deleteLecture(this.state.user.userId, this.state.selectedCourse, this.state.lectureIdToDelete)
            .then(() => {
                //ok from server
                var newLectures = this.state.lectures.slice();
                var i;
                var lectureIdToDelete = this.state.lectureIdToDelete;
                newLectures.forEach(function (item, index) {
                    if (item.lectureId == lectureIdToDelete) {
                        i = index;
                    }
                });
                newLectures.splice(i, 1);
                if (lectureIdToDelete === this.state.selectedLecture) {
                    this.setState({ lectures: newLectures, lectureIdToDelete: null, selectedLecture: null, students: [], sPages: 1 });
                }
                else {
                    this.setState({ lectures: newLectures, lectureIdToDelete: null });
                }
            }).catch((error) => {
                //!ok from server
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchErrorL: errormsg, lectureIdToDelete: null });
            });

    }

    render() {
        return (
            <>
                { this.state.lectureIdToUpdate &&
                    <EditModal editClose={this.closeEditModal} lectureId={this.state.lectureIdToUpdate} delivery={this.state.deliveryToUpdate} updateDelivery={this.updateDelivery} />}
                { this.state.lectureIdToDelete &&
                    <DeleteModal deleteClose={this.closeDeleteModal} lectureId={this.state.lectureIdToDelete} deleteLecture={this.deleteLecture} />}

                <Container fluid>
                    <Row>
                        <Col sm={6}>
                            <CoursePanel
                                courses={this.state.courses} sCourse={this.state.selectedCourse}                                //courses
                                currentPage={this.state.currCPage} change={this.changePage}                                     //pagination
                                update={this.updateLectures} reset={this.resetSelected}                                         //interaction with Lecture Panel
                            />
                            <br />
                            <br />
                            <LecturePanel
                                lectures={this.state.lectures} sLecture={this.state.selectedLecture}                                //lectures
                                currentPage={this.state.currLPage} change={this.changePage}                                         //pagination
                                update={this.updateStudents} reset={this.resetSelected}                                             //interaction with StudentPanel                                                 
                                showEditModal={this.showEditModal}                                                                  //EditDelivery management                                                                     
                                showDeleteModal={this.showDeleteModal}                                                              //Delete
                            />
                        </Col>
                        <Col sm={6}>
                            <StudentPanel
                                students={this.state.students}                                                      //students
                                currentPage={this.state.currSPage} change={this.changePage}                         //pagination
                            />
                            <Col sm={4}>
                                {this.state.fetchErrorC && <ErrorMsg name="fetchErrorC" msg={this.state.fetchErrorC} onClose={this.closeError} />}
                                {this.state.fetchErrorS && <ErrorMsg name="fetchErrorS" msg={this.state.fetchErrorS} onClose={this.closeError} />}
                                {this.state.fetchErrorL && <ErrorMsg name="fetchErrorL" msg={this.state.fetchErrorL} onClose={this.closeError} />}
                                {(this.state.studentLoading || this.state.lectureLoading) && <label>Loading...&emsp;&emsp;<Spinner animation="border" /></label>}
                            </Col>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default TeacherPage;
