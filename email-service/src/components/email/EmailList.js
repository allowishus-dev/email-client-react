import React from 'react';
import DateFormat from 'dateformat';


export default function EmailsList({ emails }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">To address</th>
                    <th scope="col">Content</th>
                    <th scope="col">Sent at</th>
                </tr>
            </thead>
            <tbody>
            {
                emails.map((email, key) => (
                    <tr key={ key }>
                        <td className="email-col">{ email.to_address }</td>
                        <td>{ email.content.slice(0, 44) }</td>
                        <td className="date-col">{ DateFormat(email.sent_at) }</td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    )             
}