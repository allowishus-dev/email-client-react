import React, { useState, useEffect } from 'react';
import ShowAlerts from '../ShowAlerts';


export default function LogoutPage() {
    const [status, showStatus] = useState({ code: 0, message: "" });

    useEffect(()=> {
        const activate = async ()=> {
            const result = await fetch(`/api/destroysession`, {
            });
            // console.log(result)
            // console.log("destroy")

            if (result.ok) {
                showStatus({ code: result.status, message: (await result.json()).response });
            }
            else {
                showStatus({ code: result.status, message: (await result.json()).response });
            }
        }
        activate();
        
    }, []);

    return (
        <div className="main activate">
            <ShowAlerts status={ status } />
        </div>
    );
}