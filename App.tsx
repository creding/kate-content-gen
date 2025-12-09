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
import { PromptProvider } from "./contexts/PromptContext";
import { ToastProvider } from "./contexts/ToastContext";

const App: React.FC = () => {
  return (
    <ToastProvider>
      <PromptProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Studio />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </PromptProvider>
    </ToastProvider>
  );
};

export default App;
