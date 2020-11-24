import React from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function Sidebar(props){
    if (!props.courses)
      return(<></>)
  return (
    <Container fluid id="sidebarCalendar">
      <strong>Legend:</strong>
      <Badge variant="primary">Booked</Badge>
      <br></br>
      <Badge variant="success">Bookable</Badge>
      <br></br>
      <Badge variant="dark">Over</Badge>
      <br></br>
      <Badge variant="danger">Expired</Badge>
      <br></br>
    </Container>
  )

}
export default Sidebar;