import * as React from 'react';
import { Outlet, Link } from 'react-router-dom';
import SoftballPageLayoutNav from './pages/SoftballPageLayoutNav';
import BoardMinutes from './pages/BoardMinutes';

export default function App() {
  return (
    <div>
      <SoftballPageLayoutNav />
    <Outlet />
    </div>
  );
}

