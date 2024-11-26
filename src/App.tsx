import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ProductView } from './pages/ProductView';
import { CategoryPage } from './pages/CategoryPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Notifications } from './pages/Notifications';
import { Favorites } from './pages/Favorites';
import { Messages } from './pages/Messages';
import { Search } from './pages/Search';
import { PostListing } from './pages/PostListing';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { JobProfile } from './pages/JobProfile';
import { PublicProfile } from './pages/PublicProfile';
import { Profile } from './pages/Profile';
import { MyAds } from './pages/MyAds';
import { GetVerified } from './pages/GetVerified';
import { CarAppointments } from './pages/CarAppointments';
import { Bookmarks } from './pages/Bookmarks';
import { Settings } from './pages/Settings';
import { Searches } from './pages/Searches';
import { Logout } from './pages/Logout';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';





export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 md:pb-0 pb-[4rem]">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/search" element={<Search />} />
            <Route path="/post-ad" element={
              <ProtectedRoute>
                <PostListing />
              </ProtectedRoute>
            } />
            <Route path="/job-profile" element={
              <ProtectedRoute>
                <JobProfile />
              </ProtectedRoute>
            } />
            <Route path="/public-profile" element={
              <ProtectedRoute>
                <PublicProfile />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/my-ads" element={
              <ProtectedRoute>
                <MyAds />
              </ProtectedRoute>
            } />
            <Route path="/bookmarks" element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            } />  
            <Route path="/searches" element={
              <ProtectedRoute>
                <Searches />
              </ProtectedRoute>
            } /><Route path="/logout" element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
                </ProtectedRoute>
              } />
            <Route path="/car-appointments" element={
              <ProtectedRoute>
                <CarAppointments />
              </ProtectedRoute>
            } />  



            <Route path="/get-verified" element={
              <ProtectedRoute>
                <GetVerified />
              </ProtectedRoute>
            } />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}