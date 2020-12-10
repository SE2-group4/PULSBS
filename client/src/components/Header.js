import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import InfoPanel from './InfoPanel';
import { Link } from "react-router-dom";

function Header(props) {
  return <>
    <Navbar id="navbar">
      <Navbar.Brand><strong>PULSeBS</strong></Navbar.Brand>
      {props.user && props.user.type === "STUDENT" &&
        <Nav className="mr-auto">
          <Nav.Link><strong>Home</strong></Nav.Link>
        </Nav>
      }
      {props.user && props.user.type === "TEACHER" &&
        <Nav className="mr-auto">
          <Nav.Link as={Link} to={"/teacherPage/main"}><strong>Your Lessons</strong></Nav.Link>
          <Nav.Link as={Link} to={"/teacherPage/stats"}><strong>Your Stats</strong></Nav.Link>
        </Nav>
      }
      {props.user && props.user.type === "MANAGER" &&
        <Nav className="mr-auto">
          <Nav.Link as={Link} to={"/bookingManagerPage/stats"}><strong>Stats</strong></Nav.Link>
          <Nav.Link as={Link} to={"/bookingManagerPage/reportTracing"}><strong>Generate a report tracing</strong></Nav.Link>
        </Nav>
      }
      {props.user && props.user.type === "SUPPORT" &&
        <Nav className="mr-auto">
          <Nav.Link><strong>Setup</strong></Nav.Link>
        </Nav>
      }
      {props.isAuth &&
        <Nav className="mr-sm-2">
          <PopoverInfo user={props.user} />
        </Nav>
      }
      {props.isAuth &&
        <Nav className="mr-sm-2">
          <Nav.Link to="/login" onClick={() => props.userLogout()}><Button variant="light">Logout</Button></Nav.Link>
        </Nav>
      }
    </Navbar>
  </>;
}

function PopoverInfo(props) {

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Your info</Popover.Title>
      <Popover.Content>
        <InfoPanel user={props.user} />
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
      <Button variant="warning" className="dropdown-toggle">{props.user.firstName}</Button>
    </OverlayTrigger>
  );

}


export default Header;