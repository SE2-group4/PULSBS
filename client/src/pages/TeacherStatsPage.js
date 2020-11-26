import React from 'react';
import Container from "react-bootstrap/Container"
import Chart from '../components/Chart';

class TeacherStatsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            courses: [], lectures: [], students: [],                         //elements
            selectedCourse: null, selectedLecture: null,                     //selected elements
            fetchErrorC: false, fetchErrorL: false, fetchErrorS: false       //fetch errors
        };
    }

    render() {
        return (<><Container fluid>

            <Chart></Chart>

        </Container>
        </>);
    }
}

export default TeacherStatsPage;