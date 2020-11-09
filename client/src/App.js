import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Redirect, Route } from "react-router-dom";
import { Switch } from "react-router";
import Container from "react-bootstrap/Container";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import { withRouter } from 'react-router-dom';

class App extends React.Component {
  /**
   * App Constructor
   * @param {*} props
   * this.state.authUser represents the logged in user
   */
  constructor(props) {
    super(props);
    this.state = { authUser: null, isAuth: false };
  }

  /**
   * setLoggedInUser set on state the user which is authenticated
   */
  setLoggedInUser = (user) => {
    this.setState({ authUser: user, isAuth: true });
    //props.history.push("/")
  };

  /**
   * userLogout performs the logout
   */
  userLogout = () => {
    this.setState({ authUser: null, isAuth: false });
  };
  render() {
    return (
      <Container fluid>
        <Header
          isAuth={this.state.isAuth}
          user={this.state.authUser}
          userLogout={this.userLogout}
        />
        <Container fluid id="containerMainContent">
          <Switch>
            <Route
              path="/studentPage"
              render={() => {
                if (!this.state.isAuth) return <Redirect to="/login" />;
                else return <StudentPage user={this.state.authUser} />;
              }}
            ></Route>
            <Route
              path="/teacherPage"
              render={() => {
                if (!this.state.isAuth) return <Redirect to="/login" />;
                else return <TeacherPage user={this.state.authUser} />;
              }}
            ></Route>
            <Route
              path="/login"
              render={() => {
                if (this.state.isAuth) return <Redirect to="/" />;
                else
                  return <LoginPage setLoggedInUser={this.setLoggedInUser} />;
              }}
            >
            </Route>
            <Route
              path="/"
              render={() => {
                if (this.state.isAuth && this.state.authUser.type==="Student")
                  return <Redirect to="/studentPage" />;
                if (this.state.isAuth && this.state.authUser.type==="Teacher")
                  return <Redirect to="/teacherPage" />;
                if(!this.state.isAuth)
                  return <Redirect to="/login"/>
              }}
            ></Route>
          </Switch>
        </Container>
      </Container>
    );
  }
}

export default withRouter(App);
//export default App;
