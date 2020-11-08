import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Redirect, Route } from "react-router-dom";
import { Switch } from "react-router";
import Container from "react-bootstrap/Container";
import StudentPage from "./pages/StudentPage";
import TeacherPage from "./pages/TeacherPage";
import LoginPage from "./pages/LoginPage";
import API from "./api/API";
import Header from "./components/Header";
import { withRouter } from "react-router-dom";
import LoginForm from "./components/LoginForm";

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
          <Row className="vheight-100">
            <Col sm={4}></Col>
            <Col sm={4} className="below-nav">
              <LoginForm />
            </Col>
          </Row>
          <Switch>
            <Route
              path="/studentPage"
              render={() => {
                if (!this.state.isAuth) return <Redirect to="/login" />;
                else return <StudentPage user={this.state.user} />;
              }}
            ></Route>
            <Route
              path="/teacherPage"
              render={() => {
                if (!this.state.isAuth) return <Redirect to="/login" />;
                else return <TeacherPage user={this.state.user} />;
              }}
            ></Route>
            <Route
              path="/login"
              render={() => {
                if (this.state.isAuth) return <Redirect to="/login" />;
                else
                  return <LoginPage setLoggedInUser={this.setLoggedInUser} />;
              }}
            ></Route>
            <Route
              path="/"
              render={() => {
                return <Redirect to="/login" />;
              }}
            ></Route>
          </Switch>
        </Container>
      </Container>
    );
  }
}

//export default withRouter(App);
export default App;
