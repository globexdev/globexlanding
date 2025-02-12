import { 
  Code2, 
  Smartphone, 
  Globe, 
  Users, 
  Github, 
  Linkedin, 
  Twitter,
  ChevronRight,
  Building2,
  Trophy,
  Heart,
  Lightbulb,
  Target,
  Rocket,
  Menu,
  X
} from 'lucide-react';
import { useState, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import ReCAPTCHA from 'react-google-recaptcha';

interface MainAppProps {
  session: Session | null;
  onShowAuth: () => void;
  onShowDashboard?: () => void;
}

export function MainApp({ session, onShowAuth, onShowDashboard }: MainAppProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    const headerOffset = 80;
    
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const recaptchaValue = await recaptchaRef.current?.executeAsync();
      if (!recaptchaValue) {
        alert('Please complete the reCAPTCHA verification');
        return;
      }

      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        recaptchaToken: recaptchaValue
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          access_key: '3caa78ff-f162-420a-b287-4c9d28330554'
        })
      });

      if (response.ok) {
        alert('Message sent successfully!');
        (e.target as HTMLFormElement).reset();
        recaptchaRef.current?.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      alert('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Globex</span>
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#home" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#services" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#projects" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">Projects</a>
              <a href="#about" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>

            {/* Desktop Login/Dashboard Button */}
            <div className="hidden md:block">
              {session ? (
                <button 
                  onClick={onShowDashboard}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <button 
                  onClick={onShowAuth}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
            <div className="flex flex-col space-y-4">
              <a href="#home" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
              <a href="#services" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#projects" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">Projects</a>
              <a href="#about" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" onClick={handleScroll} className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              {session ? (
                <button 
                  onClick={onShowDashboard}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors w-full"
                >
                  Dashboard
                </button>
              ) : (
                <button 
                  onClick={onShowAuth}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors w-full"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Building the Future of Digital Solutions
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We transform your ideas into powerful, scalable applications that drive business growth.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={onShowAuth} 
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center"
                >
                  Start Project <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80" 
                alt="Team collaboration"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer comprehensive solutions to help businesses thrive in the digital age.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-12 w-12 text-blue-600" />,
                title: "Web Development",
                description: "Custom web applications built with modern technologies and best practices."
              },
              {
                icon: <Smartphone className="h-12 w-12 text-blue-600" />,
                title: "Mobile Apps",
                description: "Native and cross-platform mobile applications for iOS and Android."
              },
              {
                icon: <Building2 className="h-12 w-12 text-blue-600" />,
                title: "Enterprise Solutions",
                description: "Scalable enterprise applications that streamline business operations."
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                {service.icon}
                <h3 className="text-xl font-bold mt-4 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-16 text-center">Recent Projects</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
                title: "FinTech Dashboard",
                description: "A comprehensive financial management platform"
              },
              {
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                title: "Healthcare App",
                description: "Patient management system for modern clinics"
              }
            ].map((project, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-[400px] object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-200">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Trophy className="h-8 w-8" />, number: "150+", label: "Projects Completed" },
              { icon: <Users className="h-8 w-8" />, number: "50+", label: "Team Members" },
              { icon: <Heart className="h-8 w-8" />, number: "99%", label: "Client Satisfaction" },
              { icon: <Globe className="h-8 w-8" />, number: "12+", label: "Years Experience" }
            ].map((stat, index) => (
              <div key={index}>
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Globex</h2>
            <p className="text-xl text-gray-600">
              We're not just developers – we're a think tank dedicated to solving unique digital challenges.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex justify-center mb-6">
                <Lightbulb className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation Lab</h3>
              <p className="text-gray-600">
                Our think tank approach combines deep technical expertise with innovative problem-solving to create unique web solutions that address specific market needs.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex justify-center mb-6">
                <Target className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Niche Focus</h3>
              <p className="text-gray-600">
                We specialize in developing super-niche web applications that solve specific industry challenges, creating targeted solutions that deliver maximum value.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex justify-center mb-6">
                <Rocket className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Practical Solutions</h3>
              <p className="text-gray-600">
                Our solutions are built for real-world impact, combining cutting-edge technology with practical functionality to deliver measurable results.
              </p>
            </div>
          </div>
          <div className="mt-16 bg-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
                  alt="Globex team collaboration"
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
                <p className="text-gray-600 mb-6">
                  At Globex, we believe in the power of focused innovation. Our think tank methodology combines deep industry research, technical expertise, and creative problem-solving to develop web solutions that address specific market gaps and challenges.
                </p>
                <p className="text-gray-600">
                  We're not interested in one-size-fits-all solutions. Instead, we dive deep into niche markets, understanding unique challenges and crafting tailored web applications that deliver exceptional value to our clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                />
              </div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
              />
              <textarea
                name="message"
                placeholder="Message"
                rows={6}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
              ></textarea>
              
              <div className="flex flex-col space-y-4">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  size="normal"
                  sitekey="6LdtetUqAAAAAEJVlY69bHSfIsncKXjHH_AXuyio"
                  className="mx-auto"
                />
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Code2 className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-white">Globex</span>
              </div>
              <p className="text-gray-400">
                Building tomorrow's digital solutions today.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#home" onClick={handleScroll} className="hover:text-blue-500 transition-colors">Home</a></li>
                <li><a href="#services" onClick={handleScroll} className="hover:text-blue-500 transition-colors">Services</a></li>
                <li><a href="#projects" onClick={handleScroll} className="hover:text-blue-500 transition-colors">Projects</a></li>
                <li><a href="#about" onClick={handleScroll} className="hover:text-blue-500 transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-500 transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="hover:text-blue-500 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Globex Enterprises. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}