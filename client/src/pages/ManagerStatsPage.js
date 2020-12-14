import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import BurgerSidebar from '../components/BurgerSidebar';
import API from '../api/Api';
import APIfake from '../api/APIfake';

class ManagerStatsPage extends React.Component {
    constructor(props) {
        super(props);
        this.generateGraph = this.generateGraph.bind(this);
        this.state = {
            courses: null, fetchError: false,
            selectedCourses: [], from: undefined, to: undefined
        }
    }

    generateGraph = (selectedCourses, from, to) => {
        this.setState({ selectedCourses: selectedCourses, from: from, to: to })
    }

    async componentDidMount() {
        APIfake.getAllCourses()
            .then((c) => {
                this.setState({ courses: c })
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            })
    }

    render() {
        return (
            <Container fluid>
                <Row>

                    <BurgerSidebar courses={this.state.courses} generateGraph={this.generateGraph} />

                </Row>
            </Container>
        )
    }
}

export default ManagerStatsPage;