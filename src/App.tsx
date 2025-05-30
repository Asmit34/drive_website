import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MuralGallery from './pages/MuralGallery';
import CanvasGallery from './pages/CanvasGallery';
import SingleCanvasGallery from './pages/SingleCanvasGallery'; // Add this import
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/murals" element={<MuralGallery />} />
          <Route path="/canvas" element={<CanvasGallery />} />
          <Route path="/canvas/single" element={<SingleCanvasGallery />} /> Add this route
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;