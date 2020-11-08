import React from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", submitted: false };
  }

  onChangeUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event, onLogin) => {
    event.preventDefault();
    onLogin(this.state.username, this.state.password);
    this.setState({ submitted: true });
  };

  render() {
    if (this.state.submitted) return <Redirect to="/" />;
    return (
      <AuthContext.Consumer>
        {(context) => (
          <>
            <Container fluid>
              <Row>
                <Col>
                  <h2 className="ui teal image header">
                    <svg
                      className="bi bi-people-circle"
                      width="30"
                      height="30"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 008 15a6.987 6.987 0 005.468-2.63z" />
                      <path
                        fillRule="evenodd"
                        d="M8 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M8 1a7 7 0 100 14A7 7 0 008 1zM0 8a8 8 0 1116 0A8 8 0 010 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="content">Log-in to your account</div>
                  </h2>

                  <Form
                    method="POST"
                    onSubmit={(event) =>
                      this.handleSubmit(event, context.loginUser)
                    }
                  >
                    <Form.Group controlId="username">
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={this.state.username}
                        onChange={(ev) => this.onChangeUsername(ev)}
                        required
                        autoFocus
                      />
                    </Form.Group>

                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={(ev) => this.onChangePassword(ev)}
                        required
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Login
                    </Button>
                  </Form>

                  {context.authErr && (
                    <Alert variant="danger">{context.authErr.msg}</Alert>
                  )}
                </Col>
              </Row>
            </Container>
          </>
        )}
      </AuthContext.Consumer>
    );
  }
}

export default LoginForm;
