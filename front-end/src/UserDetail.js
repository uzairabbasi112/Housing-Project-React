import React from 'react';
import { useParams } from 'react-router-dom';

function UserDetail() {
    // Use useParams to get the email from the URL
    const { email } = useParams();

    return (
        <div>
            <h2>User Detail</h2>
            <p>Email: {email ? email : 'Not Available'}</p>
        </div>
    );
}

export default UserDetail;
