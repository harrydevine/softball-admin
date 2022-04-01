import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import './App.css';

import Admin from './pages/Admin';
import AdminPlayersTable from './pages/AdminPlayersTable';
import AdminTeams from './pages/AdminTeams';

const rootElement = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter>
      <Routes>
	<Route element={<App />}>
          <Route path="/" element={<Admin />}>
            <Route path="/admin-players" element={<AdminPlayersTable />} />
            <Route path="/admin-teams" element={<AdminTeams />} />
            <Route
              path="*"
              element={
                <main style={{ padding: '1rem' }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>,
  rootElement
);

