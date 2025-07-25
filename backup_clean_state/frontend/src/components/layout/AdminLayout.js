import React from 'react';

const AdminLayout = ({ children }) => (
  <div>
    <header style={{ background: '#222', color: '#fff', padding: '1rem' }}>
      <h1>Admin Dashboard</h1>
    </header>
    <main>{children}</main>
  </div>
);

export default AdminLayout; 