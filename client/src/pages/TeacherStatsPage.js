import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import API from '../api/Api';
import Chart from '../components/Chart';
import BurgerSidebar from '../components/BurgerSidebar'
import Badge from 'react-bootstrap/Badge'
import ErrorMsg from '../components/ErrorMsg';
class TeacherStatsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: null, fetchError: false,
            selectedCourse: "", selectedMonths: [], selectedWeeks: [], from: undefined, to: undefined, granularity: "daily", loading: false, lectures: []
        }
    }
    fetchCourseLectures = async () => {
        this.setState({ loading: true })
        let items = []
        let lectures = []
        try {
            if (this.state.selectedCourse) {
                lectures = await API.getLecturesByCourseIdByTeacherId(this.props.user.userId, this.state.selectedCourse, null, null, true, true)
                for (let lecture of lectures)
                    items.push(lecture)
            }
            this.setState({ lectures: items, loading: false })
        } catch (err) {
            this.setState({ loading: false, fetchError: true })
        }
    }
    generateGraph = async (selectedCourse, selectedWeeks, selectedMonths, from, to, granularity) => {
        this.setState({
            selectedCourse: selectedCourse, selectedWeeks: selectedWeeks,
            selectedMonths: selectedMonths, from: from, to: to, granularity: granularity
        }, this.fetchCourseLectures)
    }

    async componentDidMount() {
        API.getCoursesByTeacherId(this.props.user.userId)
            .then((courses) => {
                this.setState({ courses: courses })
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            })
    }

    render() {
        if (this.state.fetchError) {
            return <ErrorMsg msg="Ops,an error occured during server communication" onClose={() => { }} />
        }
        return (<>
            <BurgerSidebar courses={this.state.courses} generateGraph={this.generateGraph} />
            <Container fluid>
                <Row>
                    <Col sm="6"></Col>
                    <Col sm="6">
                        {this.state.selectedCourse &&
                            <h3><Badge data-testid={courseName(this.state.selectedCourse, this.state.courses)} variant="warning" >{courseName(this.state.selectedCourse, this.state.courses)}</Badge></h3>
                        }
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col sm="2"></Col>
                    <Col sm="10">
                        <Chart course={this.state.selectedCourse} weeks={this.state.selectedWeeks} from={this.state.from} to={this.state.to}
                            months={this.state.selectedMonths} granularity={this.state.granularity} userType={this.props.user.type} lectures={this.state.lectures} loading={this.state.loading} />
                    </Col>
                </Row>
            </Container>
        </>
        )
    }
}
function courseName(courseId, courses) {
    for (let course of courses)
        if (course.courseId == courseId)
            return course.description
}
export default TeacherStatsPage;