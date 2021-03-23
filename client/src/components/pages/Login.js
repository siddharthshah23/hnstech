import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },

  rootFormContent: {
    maxWidth: "400px",
  },
}));

const Login = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const { loginUser, error, isAuthenticated } = authContext;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/");
    }

    if (error === "Invalid Credentials") {
      console.log("Invalid Credentials");
    }
  }, [error, isAuthenticated, props.history]);

  //Intialize CSS
  const classes = useStyles();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      console.log("Please fill in all fields");
    } else {
      loginUser({
        email,
        password,
      });
    }
  };

  return (
    <Container fluid className={classes.root} style={{ padding: "0px" }}>
      <Card className="w-100" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Admin Log In</h2>
          <Form onSubmit={onSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                vale={email}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                vale={password}
                onChange={onChange}
              />
            </Form.Group>
            <Button className="w-100" type="submit" value="Login">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3"></div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
