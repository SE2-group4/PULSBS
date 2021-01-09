import React from 'react';
import moment from 'moment'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { slide as Menu } from 'react-burger-menu'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MultiselectComp from '../components/MultiselectComp';
import Form from 'react-bootstrap/Form'
import { formatDate, parseDate } from 'react-day-picker/moment';

class BurgerSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            from: undefined, to: undefined, selectedCourse: "", selectedWeeks: [], selectedMonths: [],
            granularity: "daily",
            months: [],
            weeks: [],
            checked1: true, checked2: false, checked3: false
        }
    }

    selectCourseHandle = (selectedCourse) => {
        this.setState({ selectedCourse: selectedCourse })
        this.props.generateGraph(selectedCourse, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, this.state.granularity)
    }
    multiselectWeeksHandle = (selectedWeeks) => {
        this.setState({ selectedWeeks: selectedWeeks })
        this.props.generateGraph(this.state.selectedCourse, selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, this.state.granularity)
    }
    multiselectMonthsHandle = (selectedMonths) => {
        this.setState({ selectedMonths: selectedMonths })
        this.props.generateGraph(this.state.selectedCourse, this.state.selectedWeeks, selectedMonths, this.state.from, this.state.to, this.state.granularity)
    }

    handleFromChange = (from) => {
        this.setState({ from: from });
        this.props.generateGraph(this.state.selectedCourse, this.state.selectedWeeks, this.state.selectedMonths, from, this.state.to, this.state.granularity)
    }

    handleToChange = (to) => {
        this.setState({ to: to }, this.showFromMonth);
        this.props.generateGraph(this.state.selectedCourse, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, to, this.state.granularity)
    }

    async componentDidMount() {
        if (!this.props.fetchError)
            try {
                var weeks = [];
                var startDate = moment('2020-9-1');
                var endDate = moment('2021-3-30');
                //var startDate = moment(new Date(2020, 8, 1)).isoWeekday(8);
                //var endDate = moment(new Date(2021, 2, 1)).isoWeekday(8);
                if (startDate.date() == 8) {
                    startDate = startDate.isoWeekday(-6)
                }
                while (startDate.isBefore(endDate)) {
                    let startDateWeek = startDate.isoWeekday('Monday').format('DD MMM YYYY');
                    let endDateWeek = startDate.isoWeekday('Sunday').format('DD MMM YYYY');
                    startDate.add(7, 'days');
                    weeks.push([startDateWeek, endDateWeek]);
                }
                let allweeks = weeks.map((w) => {
                    return { "name": w[0] + "-" + w[1] }
                })
                var months = [];
                startDate = moment('2020-9-1');
                endDate = moment('2021-3-30');
                while (startDate.isBefore(endDate) || startDate.format('M') === endDate.format('M')) {
                    months.push(startDate.format('MMM YY'));
                    startDate.add(1, 'month');
                }
                let allmonths = months.map((m) => {
                    return { "name": m }
                })
                this.setState({ weeks: allweeks, months: allmonths })



            } catch (error) {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            }
        else
            this.setState({ fetchError: this.props.fetchError, loading: false });
    }

    handleGranChange1 = () => {
        this.setState({ granularity: "daily", checked1: true, checked2: false, checked3: false })
        this.props.generateGraph(this.state.selectedCourse, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, "daily")
    }
    handleGranChange2 = () => {
        this.setState({ granularity: "weekly", checked1: false, checked2: true, checked3: false })
        this.props.generateGraph(this.state.selectedCourse, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, "weekly")
    }
    handleGranChange3 = () => {
        this.setState({ granularity: "monthly", checked1: false, checked2: false, checked3: true })
        this.props.generateGraph(this.state.selectedCourse, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, "monthly")
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        if (!this.props.courses)
            return (<></>)
        return (
            <Menu isOpen={true}>
                <Form>
                    <Form.Group>
                        <Form.Label>Select granularity:</Form.Label>
                        <ButtonGroup toggle size="sm" className="mb-2">
                            <ToggleButton type="checkbox" variant="warning" checked={this.state.checked1} onClick={this.handleGranChange1}>Daily</ToggleButton>
                            <ToggleButton type="checkbox" variant="warning" checked={this.state.checked2} onClick={this.handleGranChange2}>Weekly</ToggleButton>
                            <ToggleButton type="checkbox" variant="warning" checked={this.state.checked3} onClick={this.handleGranChange3}>Monthly</ToggleButton>
                        </ButtonGroup>
                    </Form.Group>
                    <Form.Group>
                        {this.state.granularity == "daily" &&
                            <>
                                <Form.Label>From:</Form.Label>
                                <DayPickerInput
                                    value={from}
                                    placeholder="From (day)"
                                    format="LL"
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    dayPickerProps={{
                                        selectedDays: [from, { from, to }],
                                        disabledDays: { after: to },
                                        toMonth: to,
                                        modifiers,
                                        numberOfMonths: 1,
                                        onDayClick: () => this.to.getInput().focus(),
                                    }}
                                    onDayChange={this.handleFromChange}
                                />

                                <Form.Label>To:</Form.Label>
                                <DayPickerInput
                                    ref={el => (this.to = el)}
                                    value={to}
                                    placeholder="To (day)"
                                    format="LL"
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    dayPickerProps={{
                                        selectedDays: [from, { from, to }],
                                        disabledDays: { before: from },
                                        modifiers,
                                        month: from,
                                        fromMonth: from,
                                        numberOfMonths: 1,
                                    }}
                                    onDayChange={this.handleToChange}
                                />

                            </>
                        }
                        {
                            this.state.granularity == "weekly" &&
                            <>
                                <Form.Label>Select weeks:</Form.Label>
                                <MultiselectComp handle={this.multiselectWeeksHandle} options={this.state.weeks} display="name" selectedValues={this.state.selectedWeeks} ></MultiselectComp>
                            </>
                        }
                        {
                            this.state.granularity == "monthly" &&
                            <a id="monthly" className="menu-item" >Select months:
                <MultiselectComp handle={this.multiselectMonthsHandle} options={this.state.months} display="name" selectedValues={this.state.selectedMonths}></MultiselectComp></a>
                        }
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Select course:</Form.Label>
                        <Form.Control as="select" custom onChange={(ev) => { this.selectCourseHandle(ev.target.value) }} data-testid="courseSelect">
                            <option></option>
                            {this.props.courses.map((course) => { return (<option key={course.courseId} value={course.courseId} data-testid="course-option">{course.description}</option>) })}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Menu >
        )
    }
}


export default BurgerSidebar;