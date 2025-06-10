// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // <-- No 'BrowserRouter as Router' here
import Layout from './components/Layout';
import Home from './pages/Home';
import MuralGallery from './pages/MuralGallery';
import MuralDetailPage from './pages/MuralDetailPage'; // <--- MAKE SURE THIS IS IMPORTED
import CanvasGallery from './pages/CanvasGallery';
import SingleCanvasGallery from './pages/SingleCanvasGallery';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    // <Router> tags should NOT be here anymore, only in main.tsx
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/murals" element={<MuralGallery />} />
        <Route path="/mural/:id" element={<MuralDetailPage />} /> {/* <--- MAKE SURE THIS ROUTE IS PRESENT */}
        <Route path="/canvas" element={<CanvasGallery />} />
        <Route path="/canvas/single" element={<SingleCanvasGallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;