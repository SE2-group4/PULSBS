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
import Modal from 'react-bootstrap/Modal'
class BookingLectureForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {courses : props.courses, lectures : null,course : null,lecture : null,user : props.user};
    }
    
    getLecturesByCourseId = (course) =>{
        API.getLecturesByCourseId(this.state.user.userId,course.courseId)
        .then((lectures)=>{
            console.log(lectures);
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
    handleClose = ()=> {
        this.props.handleFinishBooking();
        this.setState({lectures:null,course: null,lecture : null})
    }
    render(){
        return (
            <>
                {this.props.isBookedDone &&
                <Modal show={true}>
                    <Modal.Dialog>
                        <Modal.Body>
                        <p>Lecture (Id : {this.state.lecture.lectureId}, Course : {this.state.course.description}) at {this.state.lecture.date} was booked correctly. </p>
                        <p>You will receive the confirmation email very soon</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="primary" onClick={()=>this.handleClose()}>Ok</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal>
                }
            <Row>
            <Col><DropdownMenu mode="courses" courses={this.props.courses} getLectures={this.getLecturesByCourseId}/></Col>
            <Col><DropdownMenu mode="lectures" lectures={this.state.lectures} chooseLecture = {this.chooseLecture}/></Col>
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
            {props.mode==="courses" &&
            <>
            <Dropdown.Toggle variant="info">
                Choose a course
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {props.courses.map((course)=><Dropdown.Item onClick={()=>props.getLectures(course)}>{course.description}</Dropdown.Item>)}
            </Dropdown.Menu>
            </>
            }
            {props.mode==="lectures" && props.lectures &&
            <>
            <Dropdown.Toggle variant="info">
                Choose a lecture
            </Dropdown.Toggle>
            <Dropdown.Menu>
            {props.lectures.map((lecture)=><Dropdown.Item onClick={()=>props.chooseLecture(lecture)}>{lecture.lectureId}</Dropdown.Item>)}
            </Dropdown.Menu>
            </>
            }
            {props.mode==="lectures" && !props.lectures &&
            <OverlayTrigger overlay={<Tooltip>Firstly choose a course!</Tooltip>}>
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