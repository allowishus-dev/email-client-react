import React, { useState } from 'react';
import ShowAlerts from '../ShowAlerts';


export default function ForgotPasswordPage() {
    const [user, setUser] = useState({ username: "" })
    const [status, showStatus] = useState({ code: 0, message: "" });

    const resetPassword = async ()=> {
        const result = await fetch(`/api/users/forgot_password`, {
            method: "POST",
            body: JSON.stringify({ 
                username: user.username,
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
        <div className="main forgotpassword">
            <h3>Forgot password</h3>
            <div className="form-group">
                <label forhtml="username">Username</label>
                <input className="form-control" type="text" id="username" name="username"
                    value={ user.username }
                    onChange={ (event)=> setUser({ username: event.target.value  }) } />
                <button className="btn btn-primary" onClick={ ()=> resetPassword() }>Send</button>
            </div>
            <ShowAlerts status={ status } />
        </div>
    );
}