import React from 'react';
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const Checkbox = ({ name, checked = false, onChange, type }) => (
    <Form.Check name={name} checked={checked} onChange={onChange} data-testid={type+"-"+name}/>
);
  
class CoursePanel extends React.Component {

    constructor(props){
        super(props);
        this.state = { currentPage: 0};
    }

    //triggers the selected lecture (or untrigger if already)
    handler = (e) =>{
        if(this.props.sCourse===e.target.name)
            this.props.reset("course");
        else
            this.props.update(e.target.name);
    }

    //NavButtons handler
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
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Course Id</th>
                                <th>Name</th>
                                <th>Choose a course</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.courses.map((course) => (
                            <CoursePanelRow key={course.courseId} checkedOne={this.props.sCourse} course={course} handler={this.handler} pMap={this.props.pageMap} 
                            nPages={this.props.nPages} current={this.state.currentPage}/>
                            ))
                        }
                    <tr style={{backgroundColor: "white"}}>
                    <td>
                    { this.props.nPages>1 && <NavButtons currentPage={this.state.currentPage} nPages={this.props.nPages} onClick={this.onClick}/>}
                    { this.props.courses.length===0 && !this.props.fetchError && "no courses available." }
                    </td>
                    <td></td>
                    <td>{ this.props.sCourse && <label>Selected course: {this.props.sCourse}</label>}</td>
                    </tr>
                    </tbody>
                    </Table><br/> 
                    { this.props.fetchError && <Alert variant="danger">Error during server communication</Alert>}
                </Container>
                </>;
    }
}

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
        this.state = { currentPage: 0 };
    }

    //triggers the selected lecture (or untrigger if already)
    handler = (e) =>{
        if(this.props.sLecture===e.target.name)
            this.props.reset("lecture");
        else
            this.props.update(e.target.name);
    }

    //triggers EditModal
    editOpen = (e) =>{
        console.log(e.target.name+" "+e.target.value);
        this.props.showEditModal(e.target.name,e.target.value);
    }

    //NavButtons handler
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
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>Lecture Id</th>
                            <th>Date</th>
                            <th>Delivery</th>
                            <th>Modify</th>
                            <th>Choose a lecture</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lectures.map((lecture) => (<LecturePanelRow key={lecture.lectureId} checkedOne={this.props.sLecture} lecture={lecture} handler={this.handler} 
                            pMap={this.props.pageMap} nPages={this.props.nPages} current={this.state.currentPage} editOpen={this.editOpen}/>))
                    }
                <tr style={{backgroundColor: "white"}}>
                <td>
                { this.props.nPages>1 && <NavButtons currentPage={this.state.currentPage} nPages={this.props.nPages} onClick={this.onClick}/>}
                { this.props.lectures.length===0 && !this.props.fetchError && "no lectures available." }
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td>{ this.props.sLecture && <>Selected lecture: {this.props.sLecture}</>}</td>
                </tr>
                </tbody>
                </Table><br/>
                { this.props.fetchError && <Alert variant="danger">Error during server communication</Alert>}
            </Container>
        </>;
    }
}

function LecturePanelRow(props) {
    let date=new Date(props.lecture.date);
    let now=new Date();
    let canEdit=((date.getTime()-now.getTime())/(1000*60)) > 30 ? true : false; //check to time distance (more than 30 minutes)
    if(props.nPages===1 || (props.nPages>1 && props.pMap.get(props.lecture.lectureId)===props.current))
        return <tr data-testid="lecture-row">
            <td>{props.lecture.lectureId}</td>
            <td>{date.toLocaleDateString()}{" "+(date.toLocaleTimeString()).slice(0,5)}</td>    
            <td>{props.lecture.delivery}</td>
            <td>{!canEdit && 
                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Can't switch delivery if the lecture is closer than 30 mins.</Tooltip>}>
                <span className="d-inline-block">
                <Button disabled style={{ pointerEvents: 'none' }}>modify</Button>
                </span></OverlayTrigger>} 
                { canEdit && <Button name={props.lecture.lectureId} value={props.lecture.delivery} onClick={props.editOpen}>modify</Button>}
                </td>
            <td><Checkbox name={props.lecture.lectureId} checked={props.checkedOne==props.lecture.lectureId ? true : false} onChange={props.handler} type={"l"}/></td>
        </tr>
    return <></>;
}

class StudentPanel extends React.Component {

    constructor(props){
        super(props);
        this.state={ currentPage: 0};
    }

    //NavButtons handler
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
                    <Table striped hover>
                        <thead>
                            <tr>
                                <th>Last Name</th>
                                <th>First Name</th>
                                <th>Student Id</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            this.props.students.map((student) => (<StudentPanelRow key={student.studentId} student={student} pMap={this.props.pageMap} 
                                nPages={this.props.nPages} current={this.state.currentPage}/>))
                        }
                    <tr style={{backgroundColor: "white"}}>
                    <td>
                    { this.props.nPages>1 && <NavButtons currentPage={this.state.currentPage} nPages={this.props.nPages} onClick={this.onClick}/>}
                    { this.props.students.length===0 && !this.props.fetchError && "no students listed." }
                    </td>
                    <td></td>
                    <td>{ this.props.students.length!==0 && <label>Number of students: {this.props.students.length}</label>}</td>
                    </tr>
                    </tbody>
                    </Table><br/>
                    { this.props.fetchError && <Alert variant="danger">Error during server communication</Alert>}
                </Container>
                </>;
    }
}

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
        &nbsp;<label>{props.currentPage+1} / {props.nPages}</label>&nbsp;
        <Button name="next" size="sm" disabled={props.currentPage===props.nPages-1 ? true : false} onClick={props.onClick}>Next</Button>
    </>;
}

function EditModal(props){
    return <>
        <Modal show={true} onHide={props.editClose}>
                <Modal.Header closeButton> 
                <Modal.Title>Edit Delivery</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to turn lecture <b>{props.lectureId}</b> from <b>{props.delivery}</b> to <b>{props.delivery=="inPresence" ? "remote" : "inPresence"}</b>?</Modal.Body>
                <Modal.Footer>
                <Button name="yes" variant="secondary" onClick={props.updateDelivery}>Yes</Button><Button name="no" variant="secondary" onClick={props.editClose}>No</Button>
                </Modal.Footer>
         </Modal>
    </>;
}

export {CoursePanel,LecturePanel,StudentPanel,EditModal};



