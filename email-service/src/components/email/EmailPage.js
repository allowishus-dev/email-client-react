import React, { useState, useEffect } from 'react';
import EmailList from './EmailList';
import ShowAlerts from './../ShowAlerts';

export default function EmailPage() {

    const [emails, setEmailData] = useState([]);
    const [status, showStatus] = useState({ code: 0, message: "" });
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(`/api/emails`)

            if (result.ok) {
                const body = await result.json();
                setEmailData(body);
            }
            else {
                showStatus({ code: result.status, message: (await result.json()).response });
            }
        }
        fetchData();
    }, [])
    
    // console.log(emails)
    return (
        <div className="main">
            <EmailList emails={ emails } />
            <ShowAlerts status={ status } />
        </div>
    );
}