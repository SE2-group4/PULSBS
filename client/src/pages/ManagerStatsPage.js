import React from 'react';
import Container from "react-bootstrap/Container";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import BurgerSidebar from '../components/BurgerSidebar';
import Chart from '../components/Chart';
import API from '../api/Api';
import APIfake from '../api/APIfake';

class ManagerStatsPage extends React.Component {
    constructor(props) {
        super(props);
        this.generateGraph = this.generateGraph.bind(this);
        this.state = {
            courses: null, fetchError: false,
            typeOptions: [{ name: 'bookings', id: 1 }, { name: 'cancellations', id: 2 }, { name: 'attendance', id: 3 }],
            selectedCourses: [], selectedTypes: [], from: undefined, to: undefined
        }
    }

    generateGraph = (selectedCourses, selectedTypes, from, to) => {
        this.setState({ selectedCourses: selectedCourses, selectedTypes: selectedTypes, from: from, to: to })
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
        return (
            <Container fluid>
                <Row>
                    <BurgerSidebar courses={this.state.courses} typeOptions={this.state.typeOptions} generateGraph={this.generateGraph} />

                </Row>
            </Container>
        )
    }
}

export default ManagerStatsPage;