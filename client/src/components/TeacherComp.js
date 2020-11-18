import React from 'react';
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
const Checkbox = ({ name, checked = false, onChange, type }) => (
    <Form.Check name={name} checked={checked} onChange={onChange} data-testid={type+"-"+name}/>
);


class CoursePanel extends React.Component {

    constructor(props){
        super(props);
        this.state = { currentPage: 0};
    }

    handler = (e) =>{
        if(this.props.sCourse===e.target.name)
            this.props.reset("course");
        else
            this.props.update(e.target.name);
    }

    onClick = (e) =>{
        if(e.target.name==="prev")
            this.setState({currentPage: this.state.currentPage-1});
        else //next
            this.setState({currentPage: this.state.currentPage+1});
    }

    render(){
        return <>
                <Container fluid>
                    <strong>Course list:</strong><br/>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Course Id</th>
                                <th>Name</th>
                                <th>Choose</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.courses.map((course) => (
                            <CoursePanelRow key={course.courseId} checkedOne={this.props.sCourse} course={course} handler={this.handler} pMap={this.props.pageMap} nPages={this.props.nPages} current={this.state.currentPage}/>
                            ))
                        }
                        </tbody>
                    </Table>
                    { this.props.nPages>1 && <NavButtons currentPage={this.state.currentPage} nPages={this.props.nPages} onClick={this.onClick}/>} <br/> 
                    { this.props.sCourse &&<>Selected course: {this.props.sCourse}</>}
                    { this.props.courses.length===0 && !this.props.fetchError && "no courses available." }
                    { this.props.fetchError && <Alert variant="danger">Error during server communication</Alert>}
                </Container>
                </>;
    }
};

function CoursePanelRow(props) {
    if(props.nPages===1 || (props.nPages>1 && props.pMap.get(props.course.courseId)===props.current))
        return <tr data-testid="course-row">
            <td>{props.course.courseId}</td>
            <td>{props.course.description}</td>
            <td><Checkbox name={props.course.courseId} checked={props.checkedOne==props.course.courseId ? true : false} onChange={props.handler} type={"c"}/></td>
        </tr>
    return <></>;
}

class LecturePanel extends React.Component {

    constructor(props){
        super(props);
        this.state = { currentPage: 0};
    }

    handler = (e) =>{
        if(this.props.sLecture===e.target.name)
            this.props.reset("lecture");
        else
            this.props.update(e.target.name);
    }

    onClick = (e) =>{
        if(e.target.name=="prev")
            this.setState({currentPage: this.state.currentPage-1});
        else //next
            this.setState({currentPage: this.state.currentPage+1});
    }

    render(){
        return <>
            <Container fluid>
                <strong>Lecture list:</strong><br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Lecture Id</th>
                            <th>Date</th>
                            <th>Choose</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lectures.map((lecture) => (<LecturePanelRow key={lecture.lectureId} checkedOne={this.props.sLecture} lecture={lecture} handler={this.handler} pMap={this.props.pageMap} nPages={this.props.nPages} current={this.state.currentPage}/>))
                    }
                    </tbody>
                </Table>
                { this.props.nPages>1 && <NavButtons currentPage={this.state.currentPage} nPages={this.props.nPages} onClick={this.onClick}/>}<br/>
                { this.props.sLecture && <>Selected lecture: {this.props.sLecture}</>}
                { this.props.lectures.length===0 && !this.props.fetchError && "no lectures available." }
                { this.props.fetchError && <Alert variant="danger">Error during server communication</Alert>}
            </Container>
        </>;
    }
}

function LecturePanelRow(props) {
    let date=new Date(props.lecture.date);
    if(props.nPages===1 || (props.nPages>1 && props.pMap.get(props.lecture.lectureId)===props.current))
        return <tr data-testid="lecture-row">
            <td>{props.lecture.lectureId}</td>
            <td>{date.toLocaleDateString()}{" "+(date.toLocaleTimeString()).slice(0,5)}</td>
            <td><Checkbox name={props.lecture.lectureId} checked={props.checkedOne==props.lecture.lectureId ? true : false} onChange={props.handler} type={"l"}/></td>
        </tr>
    return <></>;
}

class StudentPanel extends React.Component {

    constructor(props){
        super(props);
        this.state={ currentPage: 0};
    }

    onClick = (e) =>{
        if(e.target.name=="prev")
            this.setState({currentPage: this.state.currentPage-1});
        else //next
            this.setState({currentPage: this.state.currentPage+1});
    }

    render(){
        return <>
                <Container fluid>
                    <strong>Student list:</strong><br/>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Last Name</th>
                                <th>First Name</th>
                                <th>Student Id</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.students.map((student) => (<StudentPanelRow key={student.studentId} student={student} pMap={this.props.pageMap} nPages={this.props.nPages} current={this.state.currentPage}/>))
                        }
                        </tbody>
                    </Table>
                    { this.props.nPages>1 && <NavButtons currentPage={this.state.currentPage} nPages={this.props.nPages} onClick={this.onClick}/>}<br/>
                    { this.props.students.length===0 && !this.props.fetchError && "no students listed." }
                    { this.props.fetchError && <Alert variant="danger">Error during server communication</Alert>}
                </Container>
                </>;
    }
};

function StudentPanelRow(props) {
    if(props.nPages===1 || (props.nPages>1 && props.pMap.get(props.student.studentId)===props.current))
        return <tr data-testid="student-row">
            <td>{props.student.lastName}</td>
            <td>{props.student.firstName}</td>
            <td>{props.student.studentId}</td>
        </tr>
    return <></>;
}

function NavButtons(props){
    return <>
        <Button name="prev" size="sm" disabled={props.currentPage===0 ? true : false} onClick={props.onClick}>Previous</Button>
        { props.currentPage+1 } / {props.nPages }
        <Button name="next" size="sm" disabled={props.currentPage===props.nPages-1 ? true : false} onClick={props.onClick}>Next</Button>
    </>;
}
export {CoursePanel,LecturePanel,StudentPanel};



