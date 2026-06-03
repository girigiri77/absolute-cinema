import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MoviesProvider } from "./context/MoviesContext";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import StudioPage from "./pages/StudioPage";
import LoginPage from "./pages/LoginPage";
import MovieDetail from "./pages/MovieDetail";
import Sitemap from "./pages/Sitemap";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { initializeOneSignal } from "./lib/onesignal";
import { validateSeriesSchema } from "./utils/schemaValidation";

const PageWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    initializeOneSignal();
    validateSeriesSchema();
  }, []);

  return (
    <AuthProvider>
      <MoviesProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrap><HomePage /></PageWrap>} />
            <Route path="/about" element={<PageWrap><AboutPage /></PageWrap>} />
            <Route path="/contact" element={<PageWrap><ContactPage /></PageWrap>} />
            <Route path="/movie/:slug" element={<PageWrap><MovieDetail /></PageWrap>} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/login" element={<PageWrap><LoginPage /></PageWrap>} />
            <Route path="/studio" element={
              <ProtectedRoute>
                <PageWrap><StudioPage /></PageWrap>
              </ProtectedRoute>
            } />
            <Route path="*" element={<PageWrap><HomePage /></PageWrap>} />
          </Routes>
        </AnimatePresence>
      </MoviesProvider>
    </AuthProvider>
  );
};

export default App;
