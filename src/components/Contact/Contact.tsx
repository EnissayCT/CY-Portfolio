import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { MapPin, Phone, Send } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-content',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('https://formspree.io/f/myyrgeod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormState({ name: '', email: '', message: '' })
      }
    } catch {
      // silently handle network errors
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 contact-content">
          <span className="text-accent font-mono text-sm">06.</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Get In Touch
          </h2>
          <div className="flex-1 h-px bg-white/10 ml-4" />
        </div>
        <p className="text-white/50 mb-16 contact-content">
          Got a project in mind or just want to say hi? Feel free to reach
          out.
        </p>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6 contact-content">
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
              <div key={item.label} className="flex items-start gap-4 group">
                <div className="text-accent mt-0.5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <span className="text-accent font-mono text-xs">
                    {item.label}
                  </span>
                  <p className="text-white/70 text-sm mt-1">{item.value}</p>
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
                  className="text-white/40 hover:text-accent transition-colors"
                  data-cursor-hover
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Terminal-Style Form */}
          <div className="lg:col-span-3 contact-content">
            <div className="glass-card overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
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
                    <div>
                      <label className="text-accent/70 text-xs">
                        <span className="text-accent">$</span> name
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            name: e.target.value,
                          }))
                        }
                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-accent/70 text-xs">
                        <span className="text-accent">$</span> email
                      </label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            email: e.target.value,
                          }))
                        }
                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-accent/70 text-xs">
                        <span className="text-accent">$</span> message
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) =>
                          setFormState((s) => ({
                            ...s,
                            message: e.target.value,
                          }))
                        }
                        className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                        placeholder="What's on your mind?"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-accent text-navy-900 font-sans font-medium rounded-lg hover:bg-accent-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      data-cursor-hover
                    >
                      <Send size={16} />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
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
