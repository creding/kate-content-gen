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
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { PromptProvider } from "./contexts/PromptContext";
import { ToastProvider } from "./contexts/ToastContext";
import { BrandProvider } from "./contexts/BrandContext";
import { AuthProvider } from "./contexts/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrandProvider>
          <PromptProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Studio />} />
                          <Route
                            path="/copywriting"
                            element={<Copywriting />}
                          />
                          <Route path="/settings" element={<Settings />} />
                          <Route
                            path="*"
                            element={<Navigate to="/" replace />}
                          />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </PromptProvider>
        </BrandProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
