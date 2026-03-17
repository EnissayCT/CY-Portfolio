import { useState, useEffect, lazy, Suspense } from 'react'
import Preloader from './components/Preloader/Preloader'
import Navbar from './components/Layout/Navbar'
import CustomCursor from './components/Layout/CustomCursor'
import ScrollProgress from './components/Layout/ScrollProgress'
import NoiseOverlay from './components/Layout/NoiseOverlay'
import SmoothScroll from './components/Layout/SmoothScroll'
import Hero from './components/Hero/Hero'

const About = lazy(() => import('./components/About/About'))
const Experience = lazy(() => import('./components/Experience/Experience'))
const Projects = lazy(() => import('./components/Projects/Projects'))
const Skills = lazy(() => import('./components/Skills/Skills'))
const Education = lazy(() => import('./components/Education/Education'))
const Contact = lazy(() => import('./components/Contact/Contact'))
const Footer = lazy(() => import('./components/Layout/Footer'))

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <CustomCursor />
      <NoiseOverlay />
      <SmoothScroll>
        <ScrollProgress />
        <Navbar />
        <main>
          <Hero />
          <Suspense fallback={null}>
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Education />
            <Contact />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </SmoothScroll>
    </>
  )
}

export default App
