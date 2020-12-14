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
        this.state = {
            courses: null, fetchError: false
        }
    }
    /*
    generateGraph = (coursesScelto,from,to) =>{
        this.setState(coursesScelto : coursesScelto,)
    }
    */
    async componentDidMount() {
        //let allCourses = []
        //allCourses.push(await APIfake.getAllCourses())
        APIfake.getAllCourses()
            .then((c) => {
                this.setState({ courses: c })
            })
            .catch((error) => {
                let errormsg = error.source + " : " + error.error;
                this.setState({ fetchError: errormsg, loading: false })
            })
        //console.log(allCourses)
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