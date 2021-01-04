import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import BurgerSidebar from '../components/BurgerSidebar';
import Chart from '../components/Chart';
import API from '../api/Api';

class ManagerStatsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: null, fetchError: false,
            typeOptions: [{ name: 'bookings', id: 1 }, { name: 'cancellations', id: 2 }, { name: 'attendance', id: 3 }],
            selectedCourses: [], selectedTypes: [], selectedMonths: [], selectedWeeks: [], from: undefined, to: undefined, granularity: "daily", loading: false, lectures: []
        }
    }
    fetchCourseLectures = () => {
        this.setState({ loading: true })
        let items = []
        if (this.state.selectedCourses.length != 0)
            for (let course of this.state.selectedCourses)
                API.getAllCourseLectures(this.props.user.userId, course.courseId)
                    .then((lectures) => {
                        for (let lecture of lectures)
                            items.push(lecture)
                    })
                    .catch()
        this.setState({ lectures: items, loading: false })
    }
    generateGraph = async (selectedCourses, selectedTypes, selectedWeeks, selectedMonths, from, to, granularity) => {
        this.setState({
            selectedCourses: selectedCourses, selectedTypes: selectedTypes, selectedWeeks: selectedWeeks,
            selectedMonths: selectedMonths, from: from, to: to, granularity: granularity
        }, this.fetchCourseLectures)
    }

    async componentDidMount() {
        API.getAllCourses(this.props.user.userId)
            .then((c) => {
                this.setState({ courses: c })
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            })
    }

    render() {
        return (<>
            <BurgerSidebar courses={this.state.courses} typeOptions={this.state.typeOptions} generateGraph={this.generateGraph} />
            <Container fluid>
                <Row>
                    <Col sm="4"><></></Col>
                    <Col sm="8">
                        <Chart courses={this.state.selectedCourses} types={this.state.selectedTypes} weeks={this.state.selectedWeeks} from={this.state.from} to={this.state.to}
                            months={this.state.selectedMonths} granularity={this.state.granularity} managerId={this.props.user.userId} lectures={this.state.lectures} loading={this.state.loading} />
                    </Col>
                </Row>
            </Container>
        </>
        )
    }
}

export default ManagerStatsPage;