import React from 'react';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { Listings } from '../components/Listings';

export function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Listings />
    </>
  );
}