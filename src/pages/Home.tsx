import React from 'react';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { Listings } from '../components/Listings';
import { MobileSearch } from '../components/MobileSearch';

export function Home() {
  return (
    <>
      <MobileSearch />
      <Hero />
      <Categories />
      <Listings />
    </>
  );
}