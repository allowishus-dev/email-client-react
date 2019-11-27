import React from 'react';


export default function ShowAlerts({ status }) {
    let alertColor = {
        200: "success",
        400: "warning",
        401: "warning",
        500: "danger",
        503: "danger"
    }
    let classRef = "alert alert-dismissible alert-"+alertColor[status.code];
    console.log(status.code)
    return (
        status.code !== 0 ? 
        <div className={ classRef }>
            
            <button type="button" className="close" data-dismiss="alert">&times;</button>
            <h5>{ status.message }</h5>
        </div>
        :''
    )
}