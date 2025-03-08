import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import PromotionsList from './pages/PromotionsList';
import CreatePromotion from './pages/CreatePromotion';
import EditPromotion from './pages/EditPromotion';
import ViewPromotion from './pages/ViewPromotion';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <Box className="app-container">
      <Header />
      <Box className="content-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/promotions" element={<PromotionsList />} />
          <Route path="/promotions/create" element={<CreatePromotion />} />
          <Route path="/promotions/edit/:id" element={<EditPromotion />} />
          <Route path="/promotions/view/:id" element={<ViewPromotion />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App; 