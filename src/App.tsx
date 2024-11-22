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


export function App() {
  return (
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
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/search" element={<Search />} />
          <Route path="/post-ad" element={<PostListing />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}