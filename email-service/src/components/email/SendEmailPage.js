import React, { useState } from 'react';
import ShowAlerts from '../ShowAlerts';


export default function EmailPage() {
    const [email, setEmailData] = useState({ to_address: "", content: ""})
    const [status, showStatus] = useState({ code: 0, message: "" });


    const sendEmail = async ()=> {
        const result = await fetch(`/api/email/send`, {
            method: "POST",
            body: JSON.stringify({ 
                to_address: email.to_address, 
                content: email.content }),
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
        <div className="main sendemail">
            <h3>Send email</h3>
            <div className="form-group">
                <label htmlFor="address">Receiving email address</label>
                <input className="form-control" type="email" name="address" id="address" 
                    value={ email.to_address } 
                    onChange={ (event)=> setEmailData({ to_address: event.target.value, content: email.content }) }></input>
                <label htmlFor="content">Content</label>
                <textarea className="form-control" name="content" id="content" cols="40" rows="6" 
                    value={ email.content } 
                    onChange={ (event)=> setEmailData({ to_address: email.to_address, content: event.target.value }) }></textarea>
                <button className="btn btn-primary" onClick={ ()=> sendEmail() }>Send email</button>
            </div>
            <ShowAlerts status={ status } />
        </div>
    );
}