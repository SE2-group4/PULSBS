import React from 'react';
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
//import API from '../api/Api';

const Checkbox = ({ name, checked = false, onChange }) => (
    <Form.Check name={name} checked={checked} onChange={onChange} />
);

class CoursePanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    handler = (e) =>{
            this.props.update(e.target.name);
    }

    render(){
        return <>
                <Container fluid>
                    <strong>Course list:</strong><br/>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>CourseId</th>
                                <th>Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.courses.map((course) => (<CoursePanelRow key={course.courseId} checkedOne={this.props.sCourse} course={course} handler={this.handler}/>))
                        }
                        </tbody>
                    </Table>
                    selected course: {this.props.sCourse}
                </Container>
                </>;
    }
};

function CoursePanelRow(props) {
    return <tr>
        <td>{props.course.courseId}</td>
        <td>{props.course.description}</td>
        <td><Checkbox name={props.course.courseId} checked={props.checkedOne==props.course.courseId ? true : false} onChange={props.handler}/></td>
    </tr>
}

class LecturePanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {};
    }

    handler = (e) =>{
        this.props.update(e.target.name);
    }

    render(){
        return <>
            <Container fluid>
                <strong>Lecture list:</strong><br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>LectureId</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lectures.map((lecture) => (<LecturePanelRow key={lecture.lectureId} checkedOne={this.props.sLecture} lecture={lecture} handler={this.handler}/>))
                    }
                    </tbody>
                </Table>
                selected lecture: {this.props.sLecture}
            </Container>
        </>;
    }
}

function LecturePanelRow(props) {
    return <tr>
        <td>{props.lecture.lectureId}</td>
        <td>{props.lecture.date}</td>
        <td><Checkbox name={props.lecture.lectureId} checked={props.checkedOne==props.lecture.lectureId ? true : false} onChange={props.handler}/></td>
    </tr>
}

class StudentPanel extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return <>
                <Container fluid>
                    <strong>Student list:</strong><br/>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>LastName</th>
                                <th>FirstName</th>
                                <th>StudentId</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.students.map((student) => (<StudentPanelRow key={student.userId} student={student}/>))
                        }
                        </tbody>
                    </Table>
                </Container>
                </>;
    }
};

function StudentPanelRow(props) {
    return <tr>
        <td>{props.student.lastName}</td>
        <td>{props.student.firstName}</td>
        <td>{props.student.userId}</td>
    </tr>
}

export {CoursePanel,LecturePanel,StudentPanel};



