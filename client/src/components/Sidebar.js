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
          <h3><strong>FILTERS</strong></h3>
          <br></br>
          <strong>Courses:</strong>
          <Select
            options={makeSelectOptions(this.props.courses)}
            isMulti
          />
          <br></br>
          <br></br>
          <small>Ricordati di inserire la legenda!</small>
          <br></br>
        </Container>
      )

  }
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