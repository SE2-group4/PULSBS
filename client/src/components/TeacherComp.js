import React from 'react';
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Checkbox = ({ name, checked = false, onChange }) => (
    <Form.Check name={name} checked={checked} onChange={onChange} />
);


class CoursePanel extends React.Component {

    constructor(props){
        super(props);
        this.state = { currentPage: 0};
    }

    handler = (e) =>{
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
                            this.props.courses.map((course) => (
                            <CoursePanelRow key={course.courseId} checkedOne={this.props.sCourse} course={course} handler={this.handler} pMap={this.props.pageMap} nPages={this.props.nPages} current={this.state.currentPage}/>
                            ))
                        }
                        </tbody>
                    </Table>
                    { this.props.nPages>1 && <NavButtons currentPage={this.state.currentPage} nPages={this.props.nPages} onClick={this.onClick}/>}<br/>
                    { this.props.sCourse && <>selected course: {this.props.sCourse}</>}
                    { this.props.courses.length==0 && "no courses available." }
                </Container>
                </>;
    }
};

function CoursePanelRow(props) {
    if(props.nPages==1 || (props.nPages>1 && props.pMap.get(props.course.courseId)==props.current))
        return <tr>
            <td>{props.course.courseId}</td>
            <td>{props.course.description}</td>
            <td><Checkbox name={props.course.courseId} checked={props.checkedOne==props.course.courseId ? true : false} onChange={props.handler}/></td>
        </tr>
    return <></>;
}

class LecturePanel extends React.Component {

    constructor(props){
        super(props);
        this.state = { currentPage: 0};
    }

    handler = (e) =>{
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
                            <th>LectureId</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lectures.map((lecture) => (<LecturePanelRow key={lecture.lectureId} checkedOne={this.props.sLecture} lecture={lecture} handler={this.handler} pMap={this.props.pageMap} nPages={this.props.nPages} current={this.state.currentPage}/>))
                    }
                    </tbody>
                </Table>
                { this.props.nPages>1 && <NavButtons currentPage={this.state.currentPage} nPages={this.props.nPages} onClick={this.onClick}/>}<br/>
                { this.props.sLecture && <>selected lecture: {this.props.sLecture}</>}
                { this.props.lectures.length==0 && "no lectures available." }
            </Container>
        </>;
    }
}

function LecturePanelRow(props) {
    if(props.nPages==1 || (props.nPages>1 && props.pMap.get(props.lecture.lectureId)==props.current))
        return <tr>
            <td>{props.lecture.lectureId}</td>
            <td>{props.lecture.date}</td>
            <td><Checkbox name={props.lecture.lectureId} checked={props.checkedOne==props.lecture.lectureId ? true : false} onChange={props.handler}/></td>
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
                                <th>LastName</th>
                                <th>FirstName</th>
                                <th>StudentId</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.students.map((student) => (<StudentPanelRow key={student.userId} student={student} pMap={this.props.pageMap} nPages={this.props.nPages} current={this.state.currentPage}/>))
                        }
                        </tbody>
                    </Table>
                    { this.props.nPages>1 && <NavButtons currentPage={this.state.currentPage} nPages={this.props.nPages} onClick={this.onClick}/>}<br/>
                    { this.props.students.length==0 && "no students listed." }
                </Container>
                </>;
    }
};

function StudentPanelRow(props) {
    if(props.nPages==1 || (props.nPages>1 && props.pMap.get(props.student.userId)==props.current))
        return <tr>
            <td>{props.student.lastName}</td>
            <td>{props.student.firstName}</td>
            <td>{props.student.userId}</td>
        </tr>
    return <></>;
}

function NavButtons(props){
    return <>
        <Button name="prev" size="sm" disabled={props.currentPage==0 ? true : false} onClick={props.onClick}>Previous</Button>
        { props.currentPage+1 } / {props.nPages }
        <Button name="next" size="sm" disabled={props.currentPage==props.nPages-1 ? true : false} onClick={props.onClick}>Next</Button>
    </>;
}
export {CoursePanel,LecturePanel,StudentPanel};



