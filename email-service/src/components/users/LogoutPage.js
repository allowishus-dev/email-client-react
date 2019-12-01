import React, { useState, useEffect } from 'react';
import ShowAlerts from '../ShowAlerts';


export default function LogoutPage(props) {
    const [status, showStatus] = useState({ code: 0, message: "" });
    const {
        update: [user, setUser]
    } = {
        count: useState(""),
        ...(props.state || {})
    };

    useEffect(()=> {
        const activate = async ()=> {
            const result = await fetch(`/api/destroysession`, {
            });
            // console.log(result)
            // console.log("destroy")

            if (result.ok) {
                showStatus({ code: result.status, message: (await result.json()).response });
                setUser("-------");
            }
            else {
                showStatus({ code: result.status, message: (await result.json()).response });
            }
        }
        activate();
        
    }, [setUser]);

    return (
        <div className="main activate">
            <ShowAlerts status={ status } />
        </div>
    );
}