import React from 'react';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Select from 'react-select';
class Sidebar extends React.Component{
  constructor(props){
    super(props);
  }
  render() {
    if (!this.props.courses)
      return(<></>)
      return (
        <Container fluid id="sidebarCalendar">
          <strong>Courses:</strong>
          <Select
            options={makeSelectOptions(this.props.courses)}
            isMulti
          />
          <br></br>
          <br></br>
          <strong>Your booking lesson:</strong>
          <ListBookingLesson lessons={this.props.bookedLectures}/>
          <br></br>
        </Container>
      )

  }
}

function ListBookingLesson(props){
  return(
    <ListGroup variant="flush">
      {props.lessons.map((l)=><ListGroup.Item>{l.courseId}</ListGroup.Item>)}
    </ListGroup>
  )
}
function makeSelectOptions(courses){
  return courses.map(function(c){
    return {
      value : c.description,
      label : c.description
    }
  }
  
  )
}
export default Sidebar;