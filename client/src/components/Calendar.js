import React from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {findDOMNode,unmountComponentAtNode} from 'react-dom';
class Calendar extends React.Component{
    constructor(props){
        super(props);
        this.state={};
    }
    calendarRef = React.createRef()
    render(){
        if(!this.props.lessons)
            return <></>
        return(
            <Container fluid>
                {
                    this.state.event && 
                    <ModalClick event = {this.state.event} handleClose={this.handleCloseModal} handleConfirm={this.handleConfirm}/>
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
        console.log("Click");
        console.log(clickInfo.event.extendedProps);
        this.setState({event : clickInfo.event});
    }
    handleCloseModal = ()=>{
        this.setState({event : null});
    }
    handleConfirm = ()=>{
        this.props.handleConfirm(this.state.event.extendedProps.status,this.state.event.extendedProps.courseId,this.state.event.extendedProps.lectureId)
        .then((n)=>{
            let calendarApi = this.calendarRef.current.getApi()
            console.log(calendarApi.getEventById(this.state.event.id))
            calendarApi.getEventById(this.state.event.id).remove()
            calendarApi.addEvent(n);
            this.setState({event:null})
            //calendarApi.forceUpdate();
            console.log(calendarApi)
            //this.forceUpdate();
        })
        //.catch();
    }
}

function ModalClick(props) {
    return (
        <Modal show={true} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Booking system</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.event.extendedProps.status=== "booked" &&
                <p>Are you sure you want to cancel your reservation for this lecture?</p>}
                {props.event.extendedProps.status==="bookable" && 
                <p>Are you sure you want to book for this lecture?</p>}
                {props.event.extendedProps.status==="past" && 
                <p>This lecture is over</p>}
                {props.event.extendedProps.status==="expired" && 
                <p>This lecture was expired</p>}
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
}

export default Calendar;