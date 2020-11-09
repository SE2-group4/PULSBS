import React from 'react';
import Container from "react-bootstrap/Container"
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import API from "../api/Api";
import APIfake from '../tests/APIfake';
import {CoursePanel} from '../components/TeacherComp';
import InfoPanel from '../components/InfoPanel';

class TeacherPage extends React.Component {

    /**
     * TeacherPage constructor
     * @param {User} props 
     */
    constructor(props){
        super(props);
        this.state = {user : props.user,courses : [],lessons : [],students : []};
    }
    /**
     * componentDidMount fetch the all courses of the teacher 
     */
    componentDidMount(){
        //to_do
    }
    
    render(){
        return(
            <>
            <Container fluid>
                <Row>
                <Col sm='4'>
                    <InfoPanel user={this.state.user}/>
                </Col>
                <Col sm='8'>
                    <CoursePanel courses={this.state.courses}/>
                </Col>
                </Row>
                <Row>
                <Col sm='6'>
                    
                </Col>
                <Col sm='6'>
                    
                </Col>
                </Row>
            </Container>
            </>
        );
    }
}

//<LessonPanel lessons={this.state.lessons}/>
//<StudentPanel students={this.state.students}/>

export default TeacherPage;