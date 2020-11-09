import React from 'react' ;
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

//<Header isAuth={this.state.isAuth} user={this.state.authUser} userLogout={this.userLogout}/>
//starting version
function Header(props){
    return <>
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand>PULSeBS</Navbar.Brand>
        <Nav className="mr-auto">
        {   props.user && props.user.type==="Student" && <Navbar.Brand>Lesson Booking</Navbar.Brand> }
        {   props.user && props.user.type==="Teacher" && <Navbar.Brand>Your Lessons</Navbar.Brand> }
        {   props.isAuth && <Nav.Link href="/login">Logout</Nav.Link> } 
        </Nav>
    </Navbar>
    </>;
}

export default Header;