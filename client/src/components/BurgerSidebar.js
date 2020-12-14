import React from 'react';
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
        this.handleGranChange1 = this.handleGranChange1.bind(this);
        this.handleGranChange2 = this.handleGranChange2.bind(this);
        this.handleGranChange3 = this.handleGranChange3.bind(this);
        this.state = {
            user: this.props.user,
            from: undefined, to: undefined, selectedCourses: [], selectedTypes: [],
            granularity: "daily"
        }
    }


    multiselectCoursesHandle = (selectedCourses) => {
        this.setState({ selectedCourses: selectedCourses })
        this.props.generateGraph(selectedCourses, this.state.selectedTypes, this.state.from, this.state.to, this.state.granularity)
    }

    multiselectTypesHandle = (selectedTypes) => {
        this.setState({ selectedTypes: selectedTypes })
        this.props.generateGraph(this.state.selectedCourses, selectedTypes, this.state.from, this.state.to, this.state.granularity)
    }

    handleFromChange(from) {
        this.setState({ from: from });
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, from, this.state.to, this.state.granularity)
    }

    handleToChange(to) {
        this.setState({ to: to }, this.showFromMonth);
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.from, to, this.state.granularity)
    }

    async componentDidMount() {
        if (!this.props.fetchError)
            try {

            } catch (error) {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            }
        else
            this.setState({ fetchError: this.props.fetchError, loading: false });
    }

    handleGranChange1() {
        this.setState({ granularity: "daily" })
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.from, this.state.to, "daily")
    }
    handleGranChange2() {
        this.setState({ granularity: "weekly" })
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.from, this.state.to, "weekly")
    }
    handleGranChange3() {
        this.setState({ granularity: "monthly" })
        this.props.generateGraph(this.state.selectedCourses, this.state.selectedTypes, this.state.from, this.state.to, "monthly")
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };
        const months = {}
        if (!this.props.courses)
            return (<></>)
        if (this.state.granularity == "daily") {
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
        if (this.state.granularity == "weekly") {
            return (
                <Menu isOpen={true}>
                    <a id="course" className="menu-item" >Select granularity: </a>
                    <ButtonGroup size="sm" className="mb-2">
                        <Button onClick={this.handleGranChange1}>Daily</Button>
                        <Button onClick={this.handleGranChange2}>Weekly</Button>
                        <Button onClick={this.handleGranChange3}>Monthly</Button>
                    </ButtonGroup>
                    <a id="course" className="menu-item" >Select weeks:
                <MultiselectComp handle={this.multiselectCoursesHandle} options={this.props.courses} display="description" ></MultiselectComp></a>
                    <a id="course" className="menu-item" >Courses:
                <MultiselectComp handle={this.multiselectCoursesHandle} options={this.props.courses} display="description" ></MultiselectComp></a>
                    <a id="type" className="menu-item" >Type:
                <MultiselectComp handle={this.multiselectTypesHandle} options={this.props.typeOptions} display="name"></MultiselectComp></a>
                </Menu >
            )
        }
        if (this.state.granularity == "monthly") {
            return (
                <Menu isOpen={true}>
                    <a id="course" className="menu-item" >Select granularity: </a>
                    <ButtonGroup size="sm" className="mb-2">
                        <Button onClick={this.handleGranChange1}>Daily</Button>
                        <Button onClick={this.handleGranChange2}>Weekly</Button>
                        <Button onClick={this.handleGranChange3}>Monthly</Button>
                    </ButtonGroup>
                    <a id="course" className="menu-item" >Select months:
                <MultiselectComp handle={this.multiselectCoursesHandle} options={this.props.courses} display="description" ></MultiselectComp></a>
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