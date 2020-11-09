import React from 'react';
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import API from '../api/Api';
import APIfake from '../tests/APIfake';

class CoursePanel extends React.Component {

    render(){
        return <>
                <Container fluid>
                    Courses list:
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>CourseId</th>
                                <th>Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            
                        }
                        </tbody>
                    </Table>
                </Container>
                </>;
    }
};

export {CoursePanel};



