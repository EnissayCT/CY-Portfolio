import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { MapPin, Phone, Send, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const formCardRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entry — fade in
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
          },
        },
      )

      // Stagger contact info items
      gsap.fromTo(
        '.contact-info-item',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      )

      // Social links pop in
      gsap.fromTo(
        '.contact-social',
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        },
      )

      // Form card slides up
      gsap.fromTo(
        '.contact-form-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        },
      )

      // Form inputs stagger in
      gsap.fromTo(
        '.form-field',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // 3D tilt on form card
  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!formCardRef.current) return
    const rect = formCardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    formCardRef.current.style.transform = `perspective(1200px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`
  }

  const handleCardMouseLeave = () => {
    if (formCardRef.current) formCardRef.current.style.transform = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(false)

    try {
      const response = await fetch('https://formspree.io/f/myyrgeod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormState({ name: '', email: '', message: '' })
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding relative"
    >
      {/* Ambient glow behind section */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(79,195,247,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-accent font-mono text-sm">06.</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Get In Touch
          </h2>
          <div className="flex-1 h-px bg-white/10 ml-4" />
        </div>
        <p className="text-white/50 mb-16">
          Got a project in mind or just want to say hi? Feel free to reach
          out.
        </p>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              {
                icon: <MapPin size={18} />,
                label: 'Location',
                value: 'Casablanca, Morocco',
              },
              {
                icon: <Phone size={18} />,
                label: 'Phone',
                value: '+212 625 297 293',
              },
              {
                icon: <HiOutlineMail size={18} />,
                label: 'Email',
                value: 'chrittyassine@gmail.com',
              },
            ].map((item) => (
              <div key={item.label} className="contact-info-item flex items-start gap-4 group cursor-default">
                <div className="text-accent mt-0.5 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <span className="text-accent font-mono text-xs">
                    {item.label}
                  </span>
                  <p className="text-white/70 text-sm mt-1 group-hover:text-white/90 transition-colors">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="pt-6 flex items-center gap-4">
              {[
                {
                  icon: <FaGithub size={20} />,
                  href: 'https://github.com/enissayct',
                },
                {
                  icon: <FaLinkedin size={20} />,
                  href: 'https://linkedin.com/in/chritt-yassine',
                },
                {
                  icon: <HiOutlineMail size={20} />,
                  href: 'mailto:chrittyassine@gmail.com',
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social text-white/40 hover:text-accent hover:-translate-y-1 transition-all duration-300 p-2.5 rounded-full hover:bg-white/[0.06] hover:shadow-[0_0_15px_rgba(79,195,247,0.15)]"
                  data-cursor-hover
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Decorative element */}
            <div className="hidden lg:block pt-8">
              <div className="flex items-center gap-2 text-white/20">
                <Sparkles size={14} />
                <span className="text-xs font-mono">Let's create something great</span>
              </div>
            </div>
          </div>

          {/* Terminal-Style Form */}
          <div className="lg:col-span-3 contact-form-card">
            <div
              ref={formCardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className="glass-card overflow-hidden transition-[box-shadow] duration-300 hover:shadow-[0_0_40px_rgba(79,195,247,0.06)]"
            >
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-accent/80" />
                <span className="text-white/30 text-xs font-mono ml-2">
                  contact@yassine ~ %
                </span>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 font-mono text-sm"
              >
                {submitted ? (
                  <div className="text-accent py-8 text-center">
                    <Sparkles size={32} className="mx-auto mb-3 text-accent animate-pulse" />
                    <p className="text-lg font-display font-bold mb-2">
                      Message sent! &#10003;
                    </p>
                    <p className="text-white/50 font-sans">
                      I'll get back to you soon.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-accent/70 hover:text-accent underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-field">
                      <label className="text-accent/70 text-xs">
                        <span className="text-accent">$</span> name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            name: e.target.value,
                          }))
                        }
                        className={`w-full mt-1 bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none transition-all duration-300 ${
                          focusedField === 'name'
                            ? 'border-accent/50 ring-1 ring-accent/30 shadow-[0_0_15px_rgba(79,195,247,0.1)]'
                            : 'border-white/10'
                        }`}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="form-field">
                      <label className="text-accent/70 text-xs">
                        <span className="text-accent">$</span> email
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            email: e.target.value,
                          }))
                        }
                        className={`w-full mt-1 bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none transition-all duration-300 ${
                          focusedField === 'email'
                            ? 'border-accent/50 ring-1 ring-accent/30 shadow-[0_0_15px_rgba(79,195,247,0.1)]'
                            : 'border-white/10'
                        }`}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="form-field">
                      <label className="text-accent/70 text-xs">
                        <span className="text-accent">$</span> message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formState.message}
                        onFocus={() => setFocusedField('message')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            message: e.target.value,
                          }))
                        }
                        className={`w-full mt-1 bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none transition-all duration-300 resize-none ${
                          focusedField === 'message'
                            ? 'border-accent/50 ring-1 ring-accent/30 shadow-[0_0_15px_rgba(79,195,247,0.1)]'
                            : 'border-white/10'
                        }`}
                        placeholder="What's on your mind?"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="form-field flex items-center gap-2 px-6 py-3 bg-accent text-navy-900 font-sans font-medium rounded-lg hover:bg-accent-light hover:shadow-[0_0_20px_rgba(79,195,247,0.25)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                      data-cursor-hover
                    >
                      <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>

                    {error && (
                      <p className="text-red-400 text-xs font-sans mt-2">
                        Something went wrong. Please try again or email me directly.
                      </p>
                    )}
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
