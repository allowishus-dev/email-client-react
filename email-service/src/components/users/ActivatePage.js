import React, { useState, useEffect } from 'react';
import ShowAlerts from '../ShowAlerts';


export default function ActivatePage({ match }) {
    const [status, showStatus] = useState({ code: 0, message: "" });

    useEffect(()=> {
        const activate = async ()=> {
            const result = await fetch(`/api/users/activate`, {
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
                showStatus({ code: result.status, message: (await result.json()).response });
            }
            else {
                showStatus({ code: result.status, message: (await result.json()).response });
            }
        }
        activate();
    }, [match.params.key, match.params.username]);

    return (
        <div className="main activate">
            <ShowAlerts status={ status } />
        </div>
    );
}