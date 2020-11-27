import React from 'react';
import Container from "react-bootstrap/Container"
import Chart from '../components/Chart';
import API from '../api/Api';

class TeacherStatsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            courses: this.props.courses, lectures: [], students: [],                         //elements
            selectedCourse: null, selectedLecture: null,                     //selected elements
            fetchErrorC: false, fetchErrorL: false, fetchErrorS: false       //fetch errors
        };
    }

    async componentDidMount() {
        try {
            let lectures = []
            for (let c of this.state.courses)
                lectures.push(await API.getLecturesByCourseIdByTeacherId(this.state.user.userId, c.courseId)) //TODO add to date
            let lectureSet = this.buildLecturesSet(lectures);
            this.setState({ lectures: [...lectureSet] });
        } catch (err) {
            throw new Error(err);
        }
    }

    buildLecturesSet = (all) => {
        let lecturesSet = new Set()
        for (let array of all)
            for (let lecture of array) {
                lecturesSet.add(lecture)
            }
        return lecturesSet;
    }

    render() {
        return (<><Container fluid>
            <Chart lectures={this.state.lectures} courses={this.state.courses}></Chart>

        </Container>
        </>);
    }
}

export default TeacherStatsPage;