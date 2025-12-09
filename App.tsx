import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Studio from "./pages/Studio";
import Settings from "./pages/Settings";
import Copywriting from "./pages/Copywriting";
import { PromptProvider } from "./contexts/PromptContext";
import { ToastProvider } from "./contexts/ToastContext";
import { BrandProvider } from "./contexts/BrandContext";

const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrandProvider>
        <PromptProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Studio />} />
                <Route path="/copywriting" element={<Copywriting />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </Router>
        </PromptProvider>
      </BrandProvider>
    </ToastProvider>
  );
};

export default App;
