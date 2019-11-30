import React, { useState, useEffect } from 'react';
import ShowAlerts from '../ShowAlerts';


export default function ChangePasswordPage({ match }) {
    const [user, setUser] = useState({ id: 0, key: "" })
    const [password, setPassword] = useState({ password: "", confirmpassword: ""})
    const [status, showStatus] = useState({ code: 0, message: "" });


    useEffect(()=> {
        const verify = async ()=> {
            const result = await fetch(`/api/users/verify_user`, {
                method: "POST",
                body: JSON.stringify({ 
                    username: match.params.username,
                    key: match.params.key
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (result.ok) {
                setUser(await result.json())
            }
            else {
                showStatus({ code: result.status, message: (await result.json()).response });
            }
        }
        verify();
    }, [match.params.key, match.params.username]);

    const changePassword = async ()=> {
        const result = await fetch(`/api/users/change_password`, {
            method: "POST",
            body: JSON.stringify({ 
                user_id: user.id,
                key: user.key,
                newpassword: password.password, 
                confirmpassword: password.confirmpassword
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
        <div className="main changepassword">
            <h3>Change password</h3>
            { user.id !== 0 ? (
                <div className="form-group">
                    <label forhtml="newpassword">Password</label>
                    <input className="form-control" type="password" id="newpassword" name="newpassword" 
                        value={ password.password }
                        onChange={ (event)=> setPassword({ ...password, password: event.target.value }) } />
                    <label forhtml="confirm_password">Confirm password</label>
                    <input className="form-control" type="password" id="confirmpassword" name="confirmpassword" 
                        value={ password.confirmpassword }
                        onChange={ (event)=> setPassword({ ...password, confirmpassword: event.target.value }) } />
                    <button className="btn btn-primary" onClick={ ()=> changePassword() }>Change</button>
                </div>
                ) : '' 
            }

            <ShowAlerts status={ status } />
        </div>
    );
}