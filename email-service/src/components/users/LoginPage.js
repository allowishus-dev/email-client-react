import React, { useState } from 'react';
import ShowAlerts from '../ShowAlerts';


export default function LoginPage() {
    const [auth, setAuth] = useState({ username: "", password: ""})
    const [status, showStatus] = useState({ code: 0, message: "" });

    const login = async ()=> {
        const result = await fetch(`/api/users/login`, {
            method: "POST",
            body: JSON.stringify({ 
                username: auth.username,
                password: auth.password
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
        <div className="main login">
            <h3>Login</h3>
            <div className="form-group">
                <label forhtml="username">Username</label>
                <input className="form-control" type="text" id="username" name="username"
                    value={ auth.username }
                    onChange={ (event)=> setAuth({ ...auth, username: event.target.value  }) } />
                <label forhtml="password">Password</label>
                <input className="form-control" type="password" id="password" name="password" 
                    value={ auth.password }
                    onChange={ (event)=> setAuth({ ...auth, password: event.target.value }) } />
                <button className="btn btn-primary" onClick={ ()=> login() }>Login</button>
            </div>
            <ShowAlerts status={ status } />
        </div>
    );
}