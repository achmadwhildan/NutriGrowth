import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import ParentDashboard from './pages/parent/ParentDashboard.tsx';
import MainLayout from './components/layouts/MainLayout.tsx';
import ProtectedRoute from './components/ProtectedRouter.tsx';
import Tracker from './pages/parent/Tracker.tsx';
import ChildGrowth from './pages/parent/ChildGrowth.tsx';
import SetupChildProfile from './pages/parent/SetupChildProfile.tsx';
import ConsultMarketplace from './pages/parent/ConsultMarketplace.tsx';
import DoctorProfile from './pages/parent/DoctorProfile.tsx';
import ProductDetail from './pages/parent/ProductDetail.tsx';
import Checkout from './pages/parent/Checkout.tsx';
import OrderHistory from './pages/parent/OrderHistory.tsx';
import ChatInterface from './pages/shared/ChatInterface.tsx';
import DoctorLayout from './components/layouts/DoctorLayout.tsx';
import DoctorDashboard from './pages/doctor/DoctorDashboard.tsx';
import DoctorSchedule from './pages/doctor/DoctorSchedule.tsx';
import DoctorConsultRoom from './pages/doctor/DoctorConsultRoom.tsx';
import SellerLayout from './components/layouts/SellerLayout.tsx';
import SellerDashboard from './pages/seller/SellerDashboard.tsx';
import SellerProducts from './pages/seller/SellerProducts.tsx';
import SellerOrders from './pages/seller/SellerOrders.tsx';
import AdminLayout from './components/layouts/AdminLayout.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.tsx';
import DoctorVerification from './pages/admin/DoctorVerification.tsx';
import SellerVerification from './pages/admin/SellerVerification.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup-profile" element={<SetupChildProfile />} />

        <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="schedule" element={<DoctorSchedule />} />
            <Route path="consult/:id" element={<DoctorConsultRoom />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['SELLER']} />}>
          <Route path="/seller" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="orders" element={<SellerOrders />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="verify-doctors" element={<DoctorVerification />} />
            <Route path="verify-sellers" element={<SellerVerification />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['PARENT']} />}>
          <Route element={<MainLayout />}>
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/child-development" element={<ChildGrowth />} />
            <Route path="/consult" element={<ConsultMarketplace />} />
            <Route path="/consult/:id" element={<DoctorProfile />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/chat/:sessionId" element={<ChatInterface />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;