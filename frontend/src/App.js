import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/loading';

import './App.css';
import './index.css';

const Home = React.lazy(() => import('./pages/Home'));
const LoanServices = React.lazy(() => import('./pages/LoanServices'));
const ApplyForLoan = React.lazy(() => import('./pages/ApplyForLoan'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const HowItWorks = React.lazy(() => import('./pages/HowItWorks'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'));
const Testimonials = React.lazy(() => import('./pages/Testimonials'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const LoanCalculator = React.lazy(() => import('./pages/LoanCalculator'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const Unauthorized = React.lazy(() => import('./pages/Unauthorized'));
const LoanList = React.lazy(() => import('./pages/LoanList'));
const LoanDetail = React.lazy(() => import('./pages/LoanDetail'));
const LoanForm = React.lazy(() => import('./pages/LoanForm'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Payments = React.lazy(() => import('./pages/Payments'));
const CreateLoan = React.lazy(() => import('./pages/CreateLoan'));
const NewCustomer = React.lazy(() => import('./pages/NewCustomer'));
const Blog = React.lazy(() => import('./pages/Blog'));

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<LoanServices />} />
          <Route path="/apply" element={<ApplyForLoan />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={ <ProtectedRoute roles={['admin', 'agent']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/calculator" element={<LoanCalculator />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Loan Management Routes */}
          <Route path="/loans" element={<ProtectedRoute roles={['admin', 'agent']}><LoanList /></ProtectedRoute>} />
          <Route path="/loans/:id" element={<ProtectedRoute roles={['admin', 'agent']}><LoanDetail /></ProtectedRoute>} />
          <Route path="/loans/edit/:id" element={<ProtectedRoute roles={['admin', 'agent']}><LoanForm /></ProtectedRoute>} />
          <Route path="/new-loan" element={<ProtectedRoute roles={['admin', 'agent']}><LoanForm /></ProtectedRoute>} />

          {/* Future routes for other pages will go here */}
          <Route path="/customers" element={<ProtectedRoute roles={['admin', 'agent']}><Customers /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute roles={['admin', 'agent']}><Payments /></ProtectedRoute>} />
          <Route path="/create-loan" element={<ProtectedRoute roles={['admin', 'agent']}><CreateLoan /></ProtectedRoute>} />
          <Route path="/new-customer" element={<ProtectedRoute roles={['admin', 'agent']}><NewCustomer /></ProtectedRoute>} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </Suspense>
      {/* WhatsApp Float Button - Ensure Font Awesome is linked in index.html */}
      <a href="https://wa.me/916384102623?text=Hello%20SRI%20KARUPPANASAMY%20FINANCE%20I%20want%20to%20apply%20for%20a%20loan" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
        <i className="fa fa-whatsapp"></i>
      </a>
  <Footer />
  </div>
  );
}

export default App;