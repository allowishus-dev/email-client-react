import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import EmailPage from './components/email/EmailPage';
import SendEmailPage from './components/email/SendEmailPage';

function App() {
  return (
    <div className="App">
        <Router basename="/">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav">

                    <li className="nav-item active">
                        <Link to="/email/send" className="nav-link">Send email</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/emails/" className="nav-link">Previous emails</Link>
                    </li>
                    
                </ul>
                <ul className="nav right">
                    <li className="nav-item">
                        <Link to="/users/logout" className="nav-link">Log out</Link>
                    </li>
                </ul>
            </nav>
            <Switch>
                <Route exact path="/emails" component={EmailPage} />
                <Route exact path="/email/send" component={SendEmailPage} />
                {/* <Route exact path="/users/login" component={LoginPage} /> */}
                {/* <Route exact path="/users/signup" component={SignupPage} /> */}
                {/* <Route exact path="/users/forgot_password" component={ForgotPasswordPage} /> */}
                <Route exact path="/users/logout" />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
