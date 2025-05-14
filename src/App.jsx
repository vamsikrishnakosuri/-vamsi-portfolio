import { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    // Add scroll animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 z-50 p-6">
        <a
          href="#blogs"
          className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2 group"
        >
          <span>My Blogs</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient"></div>
        <div className="w-full px-4 relative z-10">
          <div className="text-center animate-on-scroll">
            <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-fade-in">
              Vamsi Krishna Kosuri
            </h1>
            <p className="text-2xl text-gray-300 mb-8 animate-slide-up">Ph.D. Student & Research Assistant</p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 animate-slide-up delay-200">
              Innovative researcher enhancing accessibility in programming tools through code navigation and audio cues.
            </p>
            <div className="flex justify-center gap-6 animate-slide-up delay-300">
              <a href="#projects" className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300">
                View Projects
              </a>
              <a href="#contact" className="px-8 py-3 rounded-full border border-gray-600 transition-all duration-300">
                Contact Me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Passion Section */}
      <section className="py-32 relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"></div>
        <div className="w-full px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* AI Section */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-blue-400">Artificial Intelligence</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  My fascination with AI stems from its potential to transform human-computer interaction.
                  I'm particularly passionate about making AI more accessible and intuitive through
                  innovative interface design and natural language processing.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">Machine Learning</span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">NLP</span>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">Neural Networks</span>
                </div>
              </div>

              {/* HCI Section */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-purple-400">Human-Computer Interaction</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  HCI is where technology meets humanity. I'm dedicated to creating interfaces that are
                  not just functional, but delightful to use. My research focuses on making technology
                  more accessible and intuitive for everyone.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">UX Design</span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">Accessibility</span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">User Research</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Education Section */}
      <section id="about" className="py-32 relative w-full">
        <div className="w-full px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-fade-in">
            About & Education
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Ph.D. in Computer Science</h3>
              <p className="text-gray-300">University of North Texas</p>
              <p className="text-gray-400">Aug 2023 - Present (CGPA: 4.0)</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">M.S. in Computer Science</h3>
              <p className="text-gray-300">University of North Texas</p>
              <p className="text-gray-400">Jan 2022 - May 2023 (CGPA: 3.70)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-32 relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"></div>
        <div className="w-full px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 animate-fade-in">
            Experience
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">Teaching Assistant</h3>
              <p className="text-gray-300 mb-4">University of North Texas</p>
              <p className="text-gray-400">Jan 2023 - Dec 2024</p>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li>• Human-Computer Interaction (HCI)</li>
                <li>• Assembly Language</li>
                <li>• Foundations of Cyber Security</li>
                <li>• Secure E-Commerce</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20">
              <h3 className="text-2xl font-semibold mb-4 text-pink-400">Research Assistant</h3>
              <p className="text-gray-300 mb-4">University of North Texas</p>
              <p className="text-gray-400">Jan 2025 - Present</p>
              <ul className="mt-4 space-y-2 text-gray-300">
                <li>• Google Blockly Accessibility</li>
                <li>• Code Navigation & Audio Cues</li>
                <li>• User Experience Design</li>
                <li>• Multidisciplinary Collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-32 relative w-full">
        <div className="w-full px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-500 animate-fade-in">
            Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20">
              <h3 className="text-2xl font-semibold mb-4 text-pink-400">VR Mental Health Diagnostics</h3>
              <p className="text-gray-300 mb-4">First Prize in INFO 5900</p>
              <p className="text-gray-400 mb-6">Awarded $500 for outstanding VR application development</p>
              <a href="https://ssharma.ci.unt.edu/vrgroupprojects2024"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300">
                View Project
              </a>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Google Blockly Enhancements</h3>
              <p className="text-gray-300 mb-4">Accessibility Research</p>
              <p className="text-gray-400 mb-6">Implementing code navigation and audio cues for improved accessibility</p>
              <a href="https://developers.google.com/blockly/accessibility"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent"></div>
        <div className="w-full px-4 relative">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-fade-in">
            Skills & Expertise
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Technical</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Python, JavaScript, C#</li>
                <li>• HTML, CSS</li>
                <li>• NLP, Data Analysis</li>
                <li>• Accessibility Design</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Design</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Figma, Sketch, Adobe XD</li>
                <li>• Photoshop, Illustrator</li>
                <li>• Blender, After Effects</li>
                <li>• UX/UI Design</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 animate-on-scroll transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20">
              <h3 className="text-xl font-semibold mb-4 text-pink-400">Research</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Experiment Design</li>
                <li>• Statistical Analysis</li>
                <li>• Academic Presentation</li>
                <li>• Project Management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 relative w-full">
        <div className="w-full px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 animate-fade-in">
            Get In Touch
          </h2>
          <div className="max-w-3xl mx-auto">
            <form
              action="https://formsubmit.co/4562fdd6f09fcb170230e601a2d0ec39"
              method="POST"
              className="space-y-6 animate-on-scroll"
            >
              {/* Honeypot to prevent spam */}
              <input type="text" name="_honey" style={{ display: 'none' }} />

              {/* Disable Captcha */}
              <input type="hidden" name="_captcha" value="false" />

              {/* Specify redirect after submission */}
              <input type="hidden" name="_next" value="https://vamsikrishnakosuri.com" />

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 block w-full rounded-lg bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-1 block w-full rounded-lg bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      required
                      className="mt-1 block w-full rounded-lg bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 focus:ring-purple-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blogs" className="py-32 relative w-full">
        <div className="w-full px-4">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 animate-fade-in">
            Latest Articles
          </h2>
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 text-center animate-on-scroll">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-purple-400 mb-4">Blog Coming Soon!</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                I'm currently setting up my blog where I'll be sharing insights about AI, HCI, and my research journey.
                Stay tuned for articles about accessibility, user experience, and the latest developments in technology.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://hashnode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Follow on Hashnode
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 relative w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="w-full px-4 text-center relative z-10">
          <p className="text-gray-400">© 2024 Vamsi Krishna Kosuri. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
