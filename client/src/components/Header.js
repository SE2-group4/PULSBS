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
        {   props.user.type==="STUDENT" ? <Navbar.Brand>Lesson Booking</Navbar.Brand> : <></>}
        {   props.user.type==="TEACHER" ? <Navbar.Brand>Your Lessons</Navbar.Brand> : <></>}
        {   props.isAuth ? <Nav.Link href="/login">Logout</Nav.Link> : <></>} 
        </Nav>
    </Navbar>
    </>;
}

export default Header;