import { useState, useEffect, lazy, Suspense } from 'react'
import Preloader from './components/Preloader/Preloader'
import Navbar from './components/Layout/Navbar'
import CustomCursor from './components/Layout/CustomCursor'
import ScrollProgress from './components/Layout/ScrollProgress'
import NoiseOverlay from './components/Layout/NoiseOverlay'
import SmoothScroll from './components/Layout/SmoothScroll'
import Hero from './components/Hero/Hero'
import WaveDivider from './components/Layout/WaveDivider'
import { startTimeOfDay, stopTimeOfDay } from './utils/timeOfDay'
import { prefersReducedMotion } from './utils/perfBudget'

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
    const timer = setTimeout(() => setIsLoading(false), 1650)
    return () => clearTimeout(timer)
  }, [])

  // Time-of-day color cycling
  useEffect(() => {
    if (prefersReducedMotion) return
    startTimeOfDay()
    return () => stopTimeOfDay()
  }, [])

  // Tab title easter egg
  useEffect(() => {
    const originalTitle = document.title
    const handleVisibility = () => {
      if (document.hidden) {
        document.title = 'Come back — let\'s build something great'
      } else {
        document.title = originalTitle
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
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
          <WaveDivider />
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
