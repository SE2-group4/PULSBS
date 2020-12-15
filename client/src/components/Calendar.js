import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import moment from 'moment'
/**
 * Calendar component
 */
class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { success: null };
    }

    calendarRef = React.createRef() /* The Calendar DOM reference  */
    render() {
        return (
            <Container fluid>
                {
                    this.state.event &&
                    <ModalClick event={this.state.event} handleClose={this.handleCloseModal} handleConfirm={this.handleConfirm} loading={this.state.loading} success={this.state.success} />
                }
                <FullCalendar
                    ref={this.calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
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
                    editable={false}
                    html={true}
                    eventDurationEditable={false}
                    eventStartEditable={false}
                    selectable={false}
                    selectMirror={false}
                    dayMaxEvents={true}
                    weekends={true}
                    events={this.props.lessons}
                    eventClick={this.handleEventClick}
                    eventContent={this.renderEventContent}
                />
            </Container>
        )
    }
    renderEventContent = (eventInfo) => {
        console.log(eventInfo.event.extendedProps.status)
        if (eventInfo.event.extendedProps.status === "bookable")
            return (

                <Container fluid>
                    <b>{eventInfo.event.title} <Badge variant="success">Bookable</Badge></b><br></br>
                    <span>Available seats : {eventInfo.event.extendedProps.availableSeats}</span><br></br>
                    <span>Booking deadline : {eventInfo.event.extendedProps.bookingDeadline}</span><br></br>
                    <span>Classroom : {eventInfo.event.extendedProps.class}</span><br></br>
                    <small>Click here to book for this lecture.</small>
                </Container>

            )
        if (eventInfo.event.extendedProps.status === "booked")
            return (

                <Container fluid>
                    <b>{eventInfo.event.title} <Badge variant="primary">Booked</Badge> </b><br></br>
                    <span>Booking deadline : {eventInfo.event.extendedProps.bookingDeadline}</span><br></br>
                    <span>Classroom : {eventInfo.event.extendedProps.class}</span><br></br>
                    <small>You are booked for this lecture.</small><br></br>
                    <small>Click here to cancel your reservation.</small>
                </Container>



            )
        if (eventInfo.event.extendedProps.status === "remote")
            return (


                <Container fluid>
                    <b>{eventInfo.event.title} <Badge variant="secondary">Remote</Badge></b><br></br>
                    <span>This lecture will be erogated remotely.</span>
                </Container>


            )
        if (eventInfo.event.extendedProps.status === "expired")
            return (


                <Container fluid>
                    <b>{eventInfo.event.title} <Badge variant="danger">Expired</Badge></b><br></br>
                    <span>This lecture is expired.</span><br></br>
                    <span>Booking deadline : {eventInfo.event.extendedProps.bookingDeadline}</span><br></br>
                    <span>Classroom : {eventInfo.event.extendedProps.class}</span>
                </Container>


            )
        if (eventInfo.event.extendedProps.status === "past")
            return (


                <Container fluid>
                    <b>{eventInfo.event.title} <Badge variant="dark">Over</Badge></b><br></br>
                    <span>This lecture is over.</span>
                </Container>


            )
        if (eventInfo.event.extendedProps.status === "full")
            return (

                <Container fluid>
                    <b>{eventInfo.event.title} <Badge variant="warning">Full</Badge></b><br></br>
                    <span>This lecture is full.</span><br></br>
                    <span>Booking deadline : {eventInfo.event.extendedProps.bookingDeadline}</span><br></br>
                    <span>Classroom : {eventInfo.event.extendedProps.class}</span><br />
                    <small>Click here to put yourself in waiting list</small>
                </Container>

            )
        if (eventInfo.event.extendedProps.status === "inWaitingList")
            return (

                <Container fluid>
                    <b>{eventInfo.event.title} <Badge variant="warning">In waiting list</Badge></b><br></br>
                    <span>You are in waiting list for this lecture.</span><br></br>
                    <span>Booking deadline : {eventInfo.event.extendedProps.bookingDeadline}</span><br></br>
                    <span>Classroom : {eventInfo.event.extendedProps.class}</span>
                </Container>

            )
    }
    /**
    * Handle the event click
* @param {CalendarEvent} clickInfo
*/
    handleEventClick = (clickInfo) => {
        this.setState({ event: clickInfo.event });
    }

    /**
     * Handle the modal close (click on hide or close button)
     */
    handleCloseModal = () => {
        this.setState({ event: null, success: null });
    }

    /**
     * Handle the user confirm after the selection of an event
     */
    handleConfirm = () => {
        this.setState({ loading: true }, this.sendConfirm)
    }

    /**
     * Send the confirmation to StudentPage component after the pressing on the confirm button
     */
    sendConfirm = () => {
        this.props.handleConfirm(this.state.event.extendedProps.status, this.state.event.extendedProps.courseId, this.state.event.extendedProps.lectureId)
            .then((event) => {
                this.setState({ loading: false, success: true });
                /*update Event */
                let calendarApi = this.calendarRef.current.getApi()
                calendarApi.getEventById(this.state.event.id).remove()
                calendarApi.addEvent(event);
                /***************** */

            })
            .catch(() => {
                this.setState({ loading: false, success: false });
            });
    }
}

/**
 * Modal component which appear after the click on an event
 * @param {*} props
 */
function ModalClick(props) {
    if (!props.loading && props.success === null)
        return (
            <Modal show={true} onHide={props.handleClose}>
                <Modal.Body>
                    {props.event.extendedProps.status === "booked" &&
                        <strong>Are you sure you want to cancel your reservation for this lecture?</strong>}
                    {props.event.extendedProps.status === "bookable" &&
                        <strong>Are you sure you want to book for this lecture?</strong>}
                    {props.event.extendedProps.status === "past" &&
                        <strong>This lecture is over</strong>}
                    {props.event.extendedProps.status === "expired" &&
                        <strong>This lecture was expired</strong>}
                    {props.event.extendedProps.status === "remote" &&
                        <strong>This lecture will be erogated remotely</strong>}
                    {props.event.extendedProps.status === "full" &&
                        <strong>Are you sure you want to add in waiting list?</strong>}
                    {props.event.extendedProps.status === "inWaitingList" &&
                        <strong>You are in waiting list for this lecture</strong>}
                </Modal.Body>
                <Modal.Footer>
                    <Button data-testid="modalClose" variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    {(props.event.extendedProps.status === "booked" || props.event.extendedProps.status === "bookable" || props.event.extendedProps.status === "full") &&
                        <Button variant="primary" onClick={props.handleConfirm}>
                            Yes
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        )
    if (props.loading)
        return (
            <Modal show={true} onHide={props.handleClose}>
                <Modal.Footer closeButton>
                    <Spinner animation="border" />
                </Modal.Footer>

            </Modal>
        )
    if (props.success === true || props.success === false)
        return (
            <Modal show={true} onHide={props.handleClose}>
                <Modal.Header >
                    {props.success === true ? "Your operation was successfull" : "Ops, an error during server communication occurs"}
                </Modal.Header>
                <Modal.Footer>
                    <Button data-testid="modalClose" variant="secondary" onClick={props.handleClose}>
                        Close
                </Button>
                </Modal.Footer>
            </Modal>
        )
}

export default Calendar;