import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import APIfake from '../api/APIfake';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment';
import Helmet from 'react-helmet';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';

class SupportUpdatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, chosenCourse: "All", from: undefined, to: undefined }
    }
    componentDidMount() {
        this.setState({ loading: true })
        APIfake.getCoursesBySupportId(this.props.user.userId)
            .then((courses) => this.setState({ courses: courses, loading: false }))
            .catch()
    }
    changeCourse = (course) => {
        console.log(course)
        this.setState({ chosenCourse: course })
    }
    changeFrom = (from) => {
        this.setState({ from: from })
    }
    changeTo = (to) => {
        this.setState({ to: to })
    }
    render() {
        if (this.state.loading)
            return (<Spinner animation="border" ></Spinner>)

        return (
            <>
                <Filters courses={this.state.courses} chosenCourse={this.state.chosenCourse} changeCourse={this.changeCourse}
                    from={this.state.from} to={this.state.to} changeFrom={this.changeFrom} changeTo={this.changeTo} />
                <Lectures />
            </>
        )
    }
}

function Filters(props) {
    return (
        <Container fluid>
            <Form>
                <Row>
                    <Col>
                        <Form.Control as="select" custom onChange={(ev) => { props.changeCourse(ev.target.value) }} defaultValue={props.chosenCourse}>
                            <option key="All">All</option>
                            {props.courses.map((course) => { return (<option key={course.courseId}>{course.description}</option>) })}
                        </Form.Control>
                    </Col>
                    <Col>
                        <FromToDayPicker from={props.from} to={props.to} changeFrom={props.changeFrom} changeTo={props.changeTo} />
                    </Col>
                </Row>
            </Form>
        </Container>
    )
}
class FromToDayPicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        /*this.state = {
            from: undefined,
            to: undefined,
        };*/
    }

    showFromMonth() {
        const { from, to } = this./*state*/props;
        if (!from) {
            return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
            this.to.getDayPicker().showMonth(from);
        }
    }

    handleFromChange(from) {
        // Change the from date and focus the "to" input field
        //this.setState({ from });
        this.props.changeFrom(from)
    }

    handleToChange(to) {
        //this.setState({ to }, this.showFromMonth);
        this.props.changeTo(to)
    }

    render() {
        const { from, to } = this.props;
        const modifiers = { start: from, end: to };
        return (
            <div className="InputFromTo">
                <DayPickerInput
                    value={from}
                    placeholder="From"
                    format="LL"
                    formatDate={formatDate}
                    parseDate={parseDate}
                    dayPickerProps={{
                        selectedDays: [from, { from, to }],
                        disabledDays: { after: to },
                        toMonth: to,
                        modifiers,
                        numberOfMonths: 2,
                        onDayClick: () => this.to.getInput().focus(),
                    }}
                    onDayChange={this.handleFromChange}
                />{' '}—{' '}
                <span className="InputFromTo-to">
                    <DayPickerInput
                        ref={el => (this.to = el)}
                        value={to}
                        placeholder="To"
                        format="LL"
                        formatDate={formatDate}
                        parseDate={parseDate}
                        dayPickerProps={{
                            selectedDays: [from, { from, to }],
                            disabledDays: { before: from },
                            modifiers,
                            month: from,
                            fromMonth: from,
                            numberOfMonths: 2,
                        }}
                        onDayChange={this.handleToChange}
                    />
                </span>
                <Helmet>
                    <style>{`
                            .InputFromTo .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                            background-color: #f0f8ff !important;
                            color: #4a90e2;
                            }
                            .InputFromTo .DayPicker-Day {
                            border-radius: 0 !important;
                            }
                            .InputFromTo .DayPicker-Day--start {
                            border-top-left-radius: 50% !important;
                            border-bottom-left-radius: 50% !important;
                            }
                            .InputFromTo .DayPicker-Day--end {
                            border-top-right-radius: 50% !important;
                            border-bottom-right-radius: 50% !important;
                            }
                            .InputFromTo .DayPickerInput-Overlay {
                            width: 550px;
                            }
                            .InputFromTo-to .DayPickerInput-Overlay {
                            margin-left: -198px;
                            }
                    `}</style>
                </Helmet>
            </div>
        );
    }
}
function Lectures(props) {
    return (
        <>
        </>
    )
}
export default SupportUpdatePage