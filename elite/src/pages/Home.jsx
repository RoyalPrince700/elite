import React from 'react'
import Hero from '../components/Hero'
import TimeTableComp from '../components/TimeTableComp'
import NavBar from '../components/NavBar'
import ProductShowcase from '../components/ProductShowCase'
import LogoTicker from '../components/LogoTicker'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import CallToAction from '../components/CallToAction'
import CreativeCallToAction from '../components/CreativeCallToAction'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      {/* <NavBar/> */}
      <Hero/>
      <LogoTicker/>
      {/* <ProductShowcase/> */}
      <Pricing/>
      <CallToAction/>

      <Testimonials/>

      <CreativeCallToAction/>

      {/* <Dashboard/> */}
    </div>
  )
}

export default Home