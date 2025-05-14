import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Vamsi Krishna Kosuri</h1>
            <p className="text-xl text-gray-600 mb-4">Ph.D. Student &amp; Research Assistant, University of North Texas</p>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
              Innovative and detail-oriented student researcher with hands-on experience enhancing accessibility and usability in programming tools. Demonstrated expertise in improving user experiences by implementing code navigation and audio cues as part of the Google Blockly team. Strong technical skills and a user-centric approach to developing inclusive technologies, with a proven ability to collaborate effectively in multidisciplinary environments.
            </p>
            <div className="flex justify-center gap-4">
              <a href="#projects" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">View Projects</a>
              <a href="#contact" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition">Contact Me</a>
            </div>
          </div>
        </div>
      </section>

      {/* About & Education Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">About & Education</h2>
          <div className="max-w-3xl mx-auto text-gray-600 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Ph.D. in Computer Science and Engineering</h3>
              <p>University of North Texas, Aug 2023 - Present (Current CGPA: 4.0)</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">M.S. in Computer Science</h3>
              <p>University of North Texas, Jan 2022 - May 2023 (Final CGPA: 3.70)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Experience</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-xl mb-2">Teaching Assistant</h3>
              <p className="text-gray-700 mb-2">University of North Texas, Jan 2023 - Dec 2024</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Guided students in Human-Computer Interaction (HCI), Assembly Language, Cyber Security, and Secure E-Commerce.</li>
                <li>Supported hands-on learning in usability, interaction design, system security, and e-commerce technologies.</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-xl mb-2">Research Assistant</h3>
              <p className="text-gray-700 mb-2">University of North Texas, Jan 2025 - Present</p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Enhancing Google Blockly with code navigation and audio cues for accessibility.</li>
                <li>Designing user-friendly features for diverse audiences in visual programming tools.</li>
                <li>Collaborating with a multidisciplinary team to deliver accessibility-focused solutions.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognitions */}
      <section id="awards" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Awards & Recognitions</h2>
          <div className="max-w-2xl mx-auto text-gray-600 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold">First Prize for Project in INFO 5900: Virtual Reality and its Applications</h3>
              <p>University of North Texas, May 2024</p>
              <p className="mt-2">Awarded a $500 prize for outstanding performance in developing a Virtual Reality application for mental health diagnostics.</p>
              <a href="https://ssharma.ci.unt.edu/vrgroupprojects2024" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Project</a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2">Virtual Reality for Mental Health Diagnostics</h3>
              <p className="text-gray-600 mb-4">Developed a VR application for mental health diagnostics, awarded first prize in INFO 5900. <a href="https://ssharma.ci.unt.edu/vrgroupprojects2024" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Project Link</a></p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2">Google Blockly Accessibility Enhancements</h3>
              <p className="text-gray-600 mb-4">Implemented code navigation and audio cues to improve accessibility for users, including those with visual impairments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Certifications */}
      <section id="skills" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Skills & Certifications</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Key Skills</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Programming: Python, JavaScript, C#, HTML, CSS</li>
                <li>Visual Design: Canva, Photoshop, Pixlr, Illustrator</li>
                <li>Interactive Design: Figma, Sketch, Adobe XD</li>
                <li>Technical: NLP, Data Analysis, Accessibility Design</li>
                <li>Project Management: JIRA, Notion, Slack</li>
                <li>Motion/3D: Blender, After Effects, 3ds Max</li>
                <li>Research: Experiment Design, Statistical Analysis, Academic Presentation</li>
                <li>UX/UI, Wireframing, Prototyping, Problem Solving, Time Management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Certifications</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>UX Foundations: Research - LinkedIn</li>
                <li>Figma for UX Research - LinkedIn</li>
                <li>Figma for UX Design - LinkedIn</li>
                <li>UX Foundations: Usability Testing - LinkedIn</li>
                <li>Interaction Design Foundations - LinkedIn</li>
                <li>Unity Essentials Pathway - Unity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Languages & Interests */}
      <section id="languages" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Languages & Interests</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Languages</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>English: Fluent (Read, Write, Speak)</li>
                <li>Telugu: Native (Read, Write, Speak)</li>
                <li>Hindi: Proficient in Speaking and Reading</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Hobbies & Interests</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Drawing: Passionate about creating visual art, exploring different mediums and techniques.</li>
                <li>In-Depth Research: Enthusiastic about delving deep into topics and gaining comprehensive understanding.</li>
                <li>Cooking: Enjoy experimenting with new recipes and cuisines.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Vamsi Krishna Kosuri. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
