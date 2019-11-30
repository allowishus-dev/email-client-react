import React, { useState, useEffect } from 'react';
// import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import EmailPage from './components/email/EmailPage';
import SendEmailPage from './components/email/SendEmailPage';
import LoginPage from './components/users/LoginPage';
import SignupPage from './components/users/SignupPage';
import ActivatePage from './components/users/ActivatePage';
import ForgotPasswordPage from './components/users/ForgotPasswordPage';
import ChangePasswordPage from './components/users/ChangePasswordPage';
import LogoutPage from './components/users/LogoutPage';

function App() {
    const [user, setUser] = useState({ session_id: "" });

    useEffect(()=> {
        const activate = async ()=> {
            const result = await fetch(`/api/getsession`, {
            });
            const body = await result.json();
            setUser({ session_id: body.user})
            
            // console.log(body)
            // console.log(user)
            

            if (result.ok) {
                // showStatus({ code: result.status, message: (await result.json()).response });
            }
            else {
                // showStatus({ code: result.status, message: (await result.json()).response });
            }
        }
        activate();
    }, [user.session_id]);
    
    return user.session_id === undefined || user.session_id === "" ? (
        <div className="App">
            <Router basename="/">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    
                    <ul className="nav right">
                        <li className="nav-item">
                            <Link to="/users/login" className="nav-link">Log in</Link>
                        </li>
                        
                        <li className="nav-item">
                            <Link to="/users/signup" className="nav-link">Sign up</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/users/forgot_password" className="nav-link">Forgot password</Link>
                        </li>
                        
                    </ul>
                </nav>
                <Switch>
                    
                    <Route exact path="/users/signup" component={SignupPage} />
                    <Route path="/users/activate/:username/:key" component={ActivatePage} />
                    <Route exact path="/users/login" component={LoginPage} />
                    <Route exact path="/users/forgot_password" component={ForgotPasswordPage} />
                    <Route exact path="/users/change_password/:username/:key" component={ChangePasswordPage} />
                    <Route exact path="/users/change_password/" component={ChangePasswordPage} />
                </Switch>
            </Router>
        </div>
    ): 
    (
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
                        <li className="nav-item">
                            <Link to="/users/change_password" className="nav-link">Change password</Link>
                        </li>
                    </ul>
                </nav>
                <Switch>
                    
                    <Route exact path="/emails" component={EmailPage} />
                    <Route exact path="/email/send" component={SendEmailPage} />
                    <Route exact path="/users/change_password" component={ChangePasswordPage} />
                    <Route exact path="/users/logout" component={LogoutPage} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
