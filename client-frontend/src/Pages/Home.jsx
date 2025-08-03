import React from 'react'
import Navbar from '../Component/Navbar'
import Hero from '../Component/Hero'
import AiTools from '../Component/AiTools'
import Testimonial from '../Component/Testimonial'
import Plan from '../Component/Plan'
import Footer from '../Component/Footer'

const Home = () => {
  return (
    <>
      <Navbar/>
      <Hero/>
      <AiTools/>
      <Testimonial/>
      <Plan/>
      <Footer/>
    </>
  )
}

export default Home