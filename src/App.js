import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AdminPageLayoutNav from './pages/AdminPageLayoutNav';

export default function App() {
  return (
    <div>
      <Helmet>
        <title>EHT Youth Softball - Admin Area</title>
      </Helmet>
      <AdminPageLayoutNav>
        <Outlet />
      </AdminPageLayoutNav>
    </div>
  );
}

