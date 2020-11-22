import React from 'react';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Container from 'react-bootstrap/Container'

class Calendar extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Container fluid>
                <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            slotMinTime="08:00:00"
            slotMaxTime="19:00:00"
            allDaySlot={false}
            editable={true}
            selectable={false}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            initialEvents = {this.props.lessons}
            />
            </Container>
        )
    }
}

export default Calendar;