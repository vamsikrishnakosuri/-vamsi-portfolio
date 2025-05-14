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
              <input type="hidden" name="_next" value="https://vamsikrishnakosuri.com/thanks" />

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
