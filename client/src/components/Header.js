import React from 'react' ;
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

//<Header isAuth={this.state.isAuth} user={this.state.authUser} userLogout={this.userLogout}/>
//starting version
function Header(props){
    return <>
    <Navbar id="navbar">
        <Navbar.Brand><strong>PULSeBS</strong></Navbar.Brand>
        <Nav className="mr-auto">
        {   props.user && props.user.type==="STUDENT" && <Nav.Link><strong>Lesson Booking</strong></Nav.Link> }
        {   props.user && props.user.type==="TEACHER" && <Nav.Link><strong>Your Lessons</strong></Nav.Link> }
        {   props.isAuth && <Nav.Link id="logout" href="/login"><strong>Logout</strong></Nav.Link> } 
        </Nav>
    </Navbar>
    </>;
}

export default Header;