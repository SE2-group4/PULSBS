import React from 'react';
import moment from 'moment'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { slide as Menu } from 'react-burger-menu'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MultiselectComp from '../components/MultiselectComp';

import { formatDate, parseDate } from 'react-day-picker/moment';

class BurgerSidebar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.multiselectCoursesHandle = this.multiselectCoursesHandle.bind(this);
        this.multiselectTypesHandle = this.multiselectTypesHandle.bind(this);
        this.multiselectWeeksHandle = this.multiselectWeeksHandle.bind(this);
        this.multiselectMonthsHandle = this.multiselectMonthsHandle.bind(this);
        this.handleGranChange1 = this.handleGranChange1.bind(this);
        this.handleGranChange2 = this.handleGranChange2.bind(this);
        this.handleGranChange3 = this.handleGranChange3.bind(this);
        this.state = {
            user: this.props.user,
            from: undefined, to: undefined, selectedCourses: [], selectedTypes: [], selectedWeeks: [], selectedMonths: [],
            granularity: "daily",
            months: [{ name: "September 2020" }, { name: "October 2020" }, { name: "November 2020" }, { name: "December 2020" }, { name: "January 2021" }, { name: "February 2021" }],
            weeks: []
        }
    }

    multiselectCoursesHandle = (selectedCourses) => {
        this.setState({ selectedCourses: selectedCourses })
        this.props.generateGraph(selectedCourses, this.state.selectedTypes, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, this.state.granularity)
    }
    multiselectTypesHandle = (selectedTypes) => {
        this.setState({ selectedTypes: selectedTypes })
        this.props.generateGraph(this.state.selectedCourses, selectedTypes, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, this.state.granularity)
    }
    multiselectWeeksHandle = (selectedWeeks) => {
        this.setState({ selectedWeeks: selectedWeeks })
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, this.state.granularity)
    }
    multiselectMonthsHandle = (selectedMonths) => {
        this.setState({ selectedMonths: selectedMonths })
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.selectedWeeks, selectedMonths, this.state.from, this.state.to, this.state.granularity)
    }

    handleFromChange(from) {
        this.setState({ from: from });
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.selectedWeeks, this.state.selectedMonths, from, this.state.to, this.state.granularity)
    }

    handleToChange(to) {
        this.setState({ to: to }, this.showFromMonth);
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, to, this.state.granularity)
    }

    async componentDidMount() {
        if (!this.props.fetchError)
            try {
                var weeks = [];
                //var wMap = new Map();
                var startDate = moment(new Date(2020, 8, 1)).isoWeekday(8);
                var endDate = moment(new Date(2021, 2, 1)).isoWeekday(8);
                if (startDate.date() == 8) {
                    startDate = startDate.isoWeekday(-6)
                }
                //var today = moment().isoWeekday('Sunday');
                while (startDate.isBefore(endDate)) {
                    let startDateWeek = startDate.isoWeekday('Monday').format('DD-MM-YYYY');
                    let endDateWeek = startDate.isoWeekday('Sunday').format('DD-MM-YYYY');
                    startDate.add(7, 'days');
                    weeks.push([startDateWeek, endDateWeek]);
                }
                let allweeks = weeks.map((w) => {
                    return { "name": w[0] + " " + w[1] }
                })
                //console.log(allweeks)
                this.setState({ weeks: allweeks })

            } catch (error) {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            }
        else
            this.setState({ fetchError: this.props.fetchError, loading: false });
    }

    handleGranChange1() {
        this.setState({ granularity: "daily" })
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, "daily")
    }
    handleGranChange2() {
        this.setState({ granularity: "weekly" })
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, "weekly")
    }
    handleGranChange3() {
        this.setState({ granularity: "monthly" })
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.selectedWeeks, this.state.selectedMonths, this.state.from, this.state.to, "monthly")
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        if (!this.props.courses)
            return (<></>)
        if (this.state.granularity == "daily") { //DAILY
            return (
                <Menu isOpen={true}>
                    <a id="course" className="menu-item" >Select granularity: </a>
                    <ButtonGroup size="sm" className="mb-2">
                        <Button onClick={this.handleGranChange1}>Daily</Button>
                        <Button onClick={this.handleGranChange2}>Weekly</Button>
                        <Button onClick={this.handleGranChange3}>Monthly</Button>
                    </ButtonGroup>
                    <a id="from" className="menu-item" >From: <div className="InputFromTo">
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
                        />{' '}
            To:{' '}
                        <span className="InputFromTo-to">
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
                        </span> </div></a>
                    <a id="course" className="menu-item" >Courses:
                    <MultiselectComp handle={this.multiselectCoursesHandle} options={this.props.courses} display="description" ></MultiselectComp></a>
                    <a id="type" className="menu-item" >Type:
                    <MultiselectComp handle={this.multiselectTypesHandle} options={this.props.typeOptions} display="name"></MultiselectComp></a>
                </Menu >
            )
        }
        if (this.state.granularity == "weekly") { // WEEKLY
            return (
                <Menu isOpen={true}>
                    <a id="gran" className="menu-item" >Select granularity: </a>
                    <ButtonGroup size="sm" className="mb-2">
                        <Button onClick={this.handleGranChange1}>Daily</Button>
                        <Button onClick={this.handleGranChange2}>Weekly</Button>
                        <Button onClick={this.handleGranChange3}>Monthly</Button>
                    </ButtonGroup>
                    <a id="weekly" className="menu-item" >Select weeks:
                <MultiselectComp handle={this.multiselectWeeksHandle} options={this.state.weeks} display="name" selectedValues={this.state.selectedWeeks} ></MultiselectComp></a>
                    <a id="course" className="menu-item" >Courses:
                <MultiselectComp handle={this.multiselectCoursesHandle} options={this.props.courses} display="description" ></MultiselectComp></a>
                    <a id="type" className="menu-item" >Type:
                <MultiselectComp handle={this.multiselectTypesHandle} options={this.props.typeOptions} display="name"></MultiselectComp></a>
                </Menu >
            )
        }
        if (this.state.granularity == "monthly") { //MONTHLY
            return (
                <Menu isOpen={true}>
                    <a id="gran" className="menu-item" >Select granularity: </a>
                    <ButtonGroup size="sm" className="mb-2">
                        <Button onClick={this.handleGranChange1}>Daily</Button>
                        <Button onClick={this.handleGranChange2}>Weekly</Button>
                        <Button onClick={this.handleGranChange3}>Monthly</Button>
                    </ButtonGroup>
                    <a id="monthly" className="menu-item" >Select months:
                <MultiselectComp handle={this.multiselectMonthsHandle} options={this.state.months} display="name" selectedValues={this.state.selectedMonths}></MultiselectComp></a>
                    <a id="course" className="menu-item" >Courses:
                <MultiselectComp handle={this.multiselectCoursesHandle} options={this.props.courses} display="description" ></MultiselectComp></a>
                    <a id="type" className="menu-item" >Type:
                <MultiselectComp handle={this.multiselectTypesHandle} options={this.props.typeOptions} display="name"></MultiselectComp></a>
                </Menu >
            )
        }
    }
}

export default BurgerSidebar;