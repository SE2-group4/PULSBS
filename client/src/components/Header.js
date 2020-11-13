import React from 'react' ;
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

//<Header isAuth={this.state.isAuth} user={this.state.authUser} userLogout={this.userLogout}/>
//starting version
function Header(props){
    return <>
    <Navbar id="navbar">
        <Navbar.Brand>PULSeBS</Navbar.Brand>
        <Nav className="mr-auto">
        {   props.user && props.user.type==="Student" && <Nav.Link>Lesson Booking</Nav.Link> }
        {   props.user && props.user.type==="Teacher" && <Navbar.Brand>Your Lessons</Navbar.Brand> }
        {   props.isAuth && <Nav.Link id="logout" href="/login">Logout</Nav.Link> } 
        </Nav>
    </Navbar>
    </>;
}

export default Header;