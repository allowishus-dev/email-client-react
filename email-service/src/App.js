import React, { useState, useEffect } from 'react';
// import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
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
        const loggedIn = async ()=> {
            const result = await fetch(`/api/getsession`, {
            });
            const body = await result.json();
            
            if (result.ok) {
                setUser({ session_id: body.user})
                // showStatus({ code: result.status, message: (await result.json()).response });
            }
            else {
                // showStatus({ code: result.status, message: (await result.json()).response });
            }
        }
        loggedIn();
        // console.log('----------------')
    });
    // }, [user.session_id]);
    
    return (
        <div className="App">
            <Router basename="/">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    
                    { user.session_id === undefined || user.session_id === "" ? 
                        (
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
                        ) : (
                            <>
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link to="/email/send" className="nav-link">Send email</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/emails/" className="nav-link">Previous emails</Link>
                                    </li>
                                </ul>
                                <ul className="nav right">
                                    <li className="nav-item">
                                        <Link to="/users/change_password" className="nav-link">Change password</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to="/users/logout" className="nav-link">Log out</Link>
                                    </li>
                                </ul>
                            </>
                        )
                    }
                    
                </nav>
                <Switch>
                    <Route exact path="/users/signup">
                        { user.session_id === undefined || user.session_id === "" ? <SignupPage /> : <Redirect to="/emails" /> }
                    </Route>
                    <Route path="/users/activate/:username/:key" component={ActivatePage} />
                    <Route exact path="/users/login">
                        { user.session_id === undefined || user.session_id === "" ? <LoginPage /> : <Redirect to="/emails" /> }
                    </Route>
                    <Route exact path="/users/forgot_password">
                        { user.session_id === undefined || user.session_id === "" ? <ForgotPasswordPage /> : <Redirect to="/emails" /> }
                    </Route>
                    <Route exact path="/users/change_password/:username/:key" component={ChangePasswordPage} />
                    <Route exact path="/users/change_password/" component={ChangePasswordPage} />
                    <Route exact path="/emails">
                        { user.session_id === undefined || user.session_id === "" ? <Redirect to="/users/login" /> : <EmailPage /> }
                    </Route>
                    <Route exact path="/email/send">
                        { user.session_id === undefined || user.session_id === "" ? <Redirect to="/users/login" /> : <SendEmailPage /> }
                    </Route>
                    <Route exact path="/users/logout">
                        { user.session_id === undefined || user.session_id === "" ? <Redirect to="/users/login" /> : <LogoutPage /> }
                    </Route>
                    <Route exact path="/">
                        { user.session_id === undefined || user.session_id === "" ? <Redirect to="/users/login" /> : <Redirect to="/emails" /> }
                    </Route>
                </Switch>
            </Router>
        </div>
        )
}

export default App;
