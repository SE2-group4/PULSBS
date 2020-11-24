import React from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Spinner from 'react-bootstrap/Spinner'

class Calendar extends React.Component{
    constructor(props){
        super(props);
        this.state={success : null};
    }
    calendarRef = React.createRef()
    render(){
        if(!this.props.lessons)
            return <></>
        return(
            <Container fluid>
                {
                    this.state.event && 
                    <ModalClick event = {this.state.event} handleClose={this.handleCloseModal} handleConfirm={this.handleConfirm} loading = {this.state.loading} success={this.state.success}/>
                }
                <FullCalendar
                    ref={this.calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin,listPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        }}
                    aspectRatio="2"
                    initialView='listWeek'
                    slotMinTime="08:00:00"
                    slotMaxTime="19:00:00"
                    allDaySlot={false}
                    editable={true}
                    eventDurationEditable={false}
                    eventStartEditable={false}
                    selectable={false}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events = {this.props.lessons}
                    eventClick={this.handleEventClick}
                    
                />
            </Container>
        )
    }
    handleEventClick = (clickInfo)=>{
        this.setState({event : clickInfo.event});
    }
    handleCloseModal = ()=>{
        this.setState({event : null,success : null});
    }
    handleConfirm = ()=>{
        this.setState({loading : true},this.sendConfirm)
    }
    sendConfirm = ()=>{
        this.props.handleConfirm(this.state.event.extendedProps.status,this.state.event.extendedProps.courseId,this.state.event.extendedProps.lectureId)
        .then((n)=>{
            this.setState({loading : false,success : true});
            /*update Event */
            let calendarApi = this.calendarRef.current.getApi()
            calendarApi.getEventById(this.state.event.id).remove()
            calendarApi.addEvent(n);
            /***************** */
            
        })
        .catch(()=>{
            this.setState({loading : false,success : false});
        });
    }
}

function ModalClick(props) {
    if (!props.loading && props.success===null)
    return (
        <Modal show={true} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><InfoLecture lecture = {props.event}/></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.event.extendedProps.status=== "booked" &&
                <strong>Are you sure you want to cancel your reservation for this lecture?</strong>}
                {props.event.extendedProps.status==="bookable" && 
                <strong>Are you sure you want to book for this lecture?</strong>}
                {props.event.extendedProps.status==="past" && 
                <strong>This lecture is over</strong>}
                {props.event.extendedProps.status==="expired" && 
                <strong>This lecture was expired</strong>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                {(props.event.extendedProps.status==="booked" || props.event.extendedProps.status==="bookable") && 
                <Button variant="primary" onClick={props.handleConfirm}>
                    Yes
                </Button>
                }
            </Modal.Footer>
        </Modal>
    )
    if(props.loading)
        return (
            <Modal show={true} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Spinner animation="border"/>
            </Modal.Header>

        </Modal>
    )
    if (props.success === true || props.success === false)
        return (
            <Modal show={true} onHide={props.handleClose}>
                <Modal.Header >
                {props.success===true ? "Your operation was successfull" : "Ops, an error during server communication occurs"}
                </Modal.Header>
                <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        )
}

function InfoLecture(props) {
    console.log(props.lecture.start)
    return (
        <ListGroup variant="flush">
            <ListGroup.Item>Lecture ID : {props.lecture.extendedProps.lectureId}</ListGroup.Item>
            <ListGroup.Item>Course name : {props.lecture.title}</ListGroup.Item>
            <ListGroup.Item>Start Date : {formatDate(props.lecture.start)}</ListGroup.Item>
            <ListGroup.Item>Booking deadline : {props.lecture.extendedProps.bookingDeadline}</ListGroup.Item>
        </ListGroup>
    )
}

export default Calendar;