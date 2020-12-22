import React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import APIfake from '../api/APIfake';
import Spinner from 'react-bootstrap/Spinner';

class SupportUpdatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: true, chosenCourse: "All" }
    }
    componentDidMount() {
        this.setState({ loading: true })
        APIfake.getCoursesBySupportId(this.props.user.userId)
            .then((courses) => this.setState({ courses: courses, loading: false }))
            .catch()
    }
    changeCourse = (course) => {
        this.setState({ chosenCourse: course })
    }
    render() {
        if (this.state.loading)
            return (<Spinner animation="border" ></Spinner>)

        return (
            <>
                <Filters courses={this.state.courses} chosenCourse={this.state.chosenCourse} changeCourse={this.changeCourse} />
                <Lectures />
            </>
        )
    }
}

function Filters(props) {
    console.log(props.courses)
    return (
        <Container fluid>
            <Row>
                <Form>
                    <Col>
                        <Form.Control as="select" custom>
                            {props.courses.map((course) => { return (<option key={course.courseId}>{course.courseId + " " + course.description}</option>) })}
                        </Form.Control>
                    </Col>
                </Form>
            </Row>
        </Container>
    )
}

function Lectures(props) {
    return (
        <>
        </>
    )
}
export default SupportUpdatePage