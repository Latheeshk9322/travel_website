import React from 'react';
import { getLoggedUserData } from '../utils/getLoggedUserData';

const ShowLoggedUser = () => {
  const user = getLoggedUserData();

  if (!user) {
    return <div>No user is currently logged in.</div>;
  }

  return (
    <div>
      <h2>Logged-in User Data</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default ShowLoggedUser; 