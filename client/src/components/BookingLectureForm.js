import React from 'react';
import Container from "react-bootstrap/Container";
import Dropdown from 'react-bootstrap/Dropdown';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import API from '../api/Api';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import APIfake from '../tests/APIfake';

class BookingLectureForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {courses : props.courses, lectures : null,course : null,lecture : null,user : props.user};
    }
    
    getLecturesByCourseId = (course) =>{
        APIfake.getLecturesByCourseId(this.state.user.userId,course.courseId)
        .then((lectures)=>{
            this.setState({lectures : lectures,course : course})
        })
        .catch()
    }
    chooseLecture = (lecture) =>{
        this.setState({lecture : lecture});
    }
    bookALecture = () =>{
        this.props.bookALecture(this.state.course,this.state.lecture);
    }
    render(){
        return (
            <>
            <Row>
            <Col><DropdownMenu courses={this.props.courses} getLectures={this.props.getLecturesByCourseId}/></Col>
            <Col><DropdownMenu lectures={this.props.lectures}/></Col>
            </Row>
            <Row>
                <ListGroup>
                {this.state.course && <Col><ListGroup.Item>Course : {this.state.course.description}</ListGroup.Item></Col>}
                {this.state.lecture && <Col><ListGroup.Item>Lecture : {this.state.lecture.lectureId}</ListGroup.Item></Col>}
                </ListGroup>
            </Row>
            <br/>
            {this.state.course && this.state.lecture &&
                <Button variant="success" onClick={()=>this.bookALecture()}>Book now!</Button>
            }
            </>
        );
    }
}
function DropdownMenu(props) {
    return (
        <Dropdown>
            {props.courses &&
            <>
            <Dropdown.Toggle variant="info">
                Choose a course
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {props.courses.map((course)=><Dropdown.Item onClick={()=>props.getLectures(course)}>{course.desription}</Dropdown.Item>)}
            </Dropdown.Menu>
            </>
            }
            {props.lectures &&
            <>
            <Dropdown.Toggle variant="info">
                Choose a lecture
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {props.lectures.map((lecture)=><Dropdown.Item onClick={()=>props.getLectures(lecture)}>{lecture.lectureId}</Dropdown.Item>)}
            </Dropdown.Menu>
            </>
            }
            {!props.lectures &&
            <OverlayTrigger overlay={<Tooltip>Choose a course!</Tooltip>}>
            <span className="d-inline-block">
              <Button disabled style={{ pointerEvents: 'none' }}>
                Choose a lecture
              </Button>
            </span>
            </OverlayTrigger>

            }
        </Dropdown>
    );
}
export default BookingLectureForm;