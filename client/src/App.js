import React from "react";
import { Redirect, Route } from "react-router-dom";
import { Switch } from "react-router";
import Container from "react-bootstrap/Container";
import StudentPage from "./pages/StudentPage";
import TeacherRoute from './pages/TeacherRoute';
import ManagerRoute from './pages/ManagerRoute';
import SupportPage from './pages/SupportPage';
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import { withRouter } from 'react-router-dom';
import API from './api/Api';

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
  };

  /**
   * userLogout performs the logout
   */
  userLogout = () => {
    API.userLogout()
      .then(() => {
        this.setState({ authUser: null, isAuth: false });
      })
      .catch(() => {
        this.setState({ authUser: null, isAuth: false });
      })
  };

  render() {
    return (
      <Container fluid id="containerExt">
        <Header
          isAuth={this.state.isAuth}
          user={this.state.authUser}
          userLogout={this.userLogout}
        />
        <Container fluid id="containerMainContent">
          <Switch>
            <Route
              exact path="/studentPage"
              render={() => {
                if (!this.state.isAuth) return <Redirect to="/login" />;
                else return <StudentPage user={this.state.authUser} />;
              }}
            ></Route>
            <Route
              path="/teacherPage"
              render={() => {
                if (!this.state.isAuth) return <Redirect to="/login" />;
                else return <TeacherRoute user={this.state.authUser} />;
              }}
            ></Route>
            <Route
              path="/bookingManagerPage"
              render={() => {
                if (!this.state.isAuth) return <Redirect to="/login" />;
                else return <ManagerRoute user={this.state.authUser} />;
              }}
            ></Route>
            <Route
              path="/supportPage"
              render={() => {
                if (!this.state.isAuth) return <Redirect to="/login" />;
                else return <SupportPage user={this.state.authUser} />;
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
                if (this.state.isAuth && this.state.authUser.type === "STUDENT")
                  return <Redirect to="/studentPage" />;
                else if (this.state.isAuth && this.state.authUser.type === "TEACHER")
                  return <Redirect to="/teacherPage/main" />;
                else if (this.state.isAuth && this.state.authUser.type === "SUPPORT")
                  return <Redirect to="/supportPage" />;
                else if (this.state.isAuth && this.state.authUser.type === "MANAGER")
                  return <Redirect to="/bookingManagerPage/stats" />;
                else if (!this.state.isAuth)
                  return <Redirect to="/login" />
              }}
            ></Route>
          </Switch>
        </Container>
      </Container>
    );
  }
}

export default withRouter(App);
