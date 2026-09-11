import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import Dashboard from '../pages/Dashboard';
import Predict from '../pages/Predict';
import Results from '../pages/Results';
import Explainability from '../pages/Explainability';
import Model from '../pages/Model';
import History from '../pages/History';
import About from '../pages/About';
import Settings from '../pages/Settings';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/results/:id" element={<Results />} />
        <Route path="/explainability/:id" element={<Explainability />} />
        <Route path="/model" element={<Model />} />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
