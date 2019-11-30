import React, { useState } from 'react';
import ShowAlerts from '../ShowAlerts';


export default function SignupPage() {
    const [user, updateUserData] = useState({ 
        username: "", 
        password: "",
        confirmpassword: "",
        email: "",
        firstname: "",
        lastname: ""
    });
    const [status, showStatus] = useState({ code: 0, message: "" });

    const signup = async ()=> {
        const result = await fetch(`/api/users/signup`, {
            method: "POST",
            body: JSON.stringify({ 
                username: user.username,
                password: user.password,
                confirmpassword: user.confirmpassword,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (result.ok) {
            showStatus({ code: result.status, message: (await result.json()).response });
        }
        else {
            showStatus({ code: result.status, message: (await result.json()).response });
        }
    }
    
    return (
        <div className="main signup">
            <h3>Sign up</h3>
            <div className="form-group">
                <div className="form-row">
                    <div className="col-md-6">
                        <label forhtml="username">Username</label>
                        <input className="form-control" type="text" id="username" name="username"
                            value={ user.username }
                            onChange={ (event)=> updateUserData({ ...user, username: event.target.value }) } />
                    </div>
                    <div className="col-md-6">
                        <label forhtml="email">Email address</label>
                        <input className="form-control" type="email" id="email" name="email" 
                            value={ user.email }
                            onChange={ (event)=> updateUserData({ ...user, email: event.target.value }) } />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-md-6">
                        <label forhtml="firstname">First name</label>
                        <input className="form-control" type="text" id="firstname" name="firstname" 
                            value={ user.firstname }
                            onChange={ (event)=> updateUserData({ ...user, firstname: event.target.value }) } />
                    </div>
                    <div className="col-md-6">
                        <label forhtml="lastname">Last name</label>
                        <input className="form-control" type="text" id="lastname" name="lastname" 
                            value={ user.lastname }
                            onChange={ (event)=> updateUserData({ ...user, lastname: event.target.value }) } />
                    </div>
                </div>
                <div className="form-row">
                    <div className="col-md-6">
                        <label forhtml="password">Password</label>
                        <input className="form-control" type="password" id="password" name="password" 
                            value={ user.password }
                            onChange={ (event)=> updateUserData({ ...user, password: event.target.value }) } />
                    </div>
                    <div className="col-md-6">
                        <label forhtml="confirm_password">Confirm password</label>
                        <input className="form-control" type="password" id="confirmpassword" name="confirmpassword" 
                            value={ user.confirmpassword }
                            onChange={ (event)=> updateUserData({ ...user, confirmpassword: event.target.value }) } />
                    </div>
                </div>
                <button className="btn btn-primary" onClick={ ()=> signup() }>Sign up</button>
            </div>
            
            <ShowAlerts status={ status } />
        </div>
    );
}