import React from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import Container from 'react-bootstrap/Container'
import moment from 'moment'
/**
 * StatsCalendar component
 */
class StatsCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    calendarRef = React.createRef();
    render() {
        let yesterday = moment().subtract("1", "day").toISOString();
        return (
            <Container fluid>
                <FullCalendar
                    ref={this.calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,listMonth'
                    }}
                    aspectRatio="2"
                    initialView='listWeek'
                    validRange={{
                        end: yesterday
                    }}
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
                    events={this.props.lessons}
                    eventClick={this.handleEventClick}
                />
            </Container>
        )
    }

    handleEventClick = (clickInfo) => {
        this.props.updateSelected(clickInfo.event.extendedProps.lectureId);
    }

}

export default StatsCalendar;