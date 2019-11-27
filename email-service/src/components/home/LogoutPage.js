// import React, { useState, useEffect } from 'react';
import React from 'react';

export default function LoginPage() {
    return (
        <div className="LoginPage">
            <h1>Login</h1>
            <form action="http://localhost:9000/api/users/login" method="POST">
                <div className="form-group">
                    <label for="username">Username</label>
                    <input className="form-control" type="text" id="username" name="username" />
                    <label for="password">Password</label>
                    <input className="form-control" type="text" id="password" name="password" />
                    <button type="submit" class="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    );
}