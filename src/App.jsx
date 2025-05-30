import { motion } from 'framer-motion';
import './index.css';
import profileImg from './profile.png';
import { useState } from 'react';

const heroVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const goodSkills = [
  'Python', 'Canva', 'Photoshop', 'Pixlr', 'Figma', 'Sketch', 'Data Analysis', 'Notion', 'Slack', '3ds Max', 'Blender', 'Unity3D', 'PPTs', 'UI/UX Design', 'Prompt Engineering', 'AI Agents', 'HTML', 'CSS', 'AI'
];
const allSkills = [
  { category: 'Programming Languages', skills: ['Python', 'JavaScript', 'C#', 'HTML', 'CSS'] },
  { category: 'Visual Design Tools', skills: ['Canva', 'Photoshop', 'Pixlr', 'Illustrator'] },
  { category: 'Interactive Design', skills: ['Figma', 'Sketch', 'Adobe XD'] },
  { category: 'Technical Expertise', skills: ['Natural Language Processing', 'Data Analysis', 'Accessibility Design Principles'] },
  { category: 'Project Management', skills: ['JIRA', 'Notion', 'Slack'] },
  { category: 'Motion Design & 3D Modeling', skills: ['Blender', 'After Effects', '3ds Max'] },
  { category: 'Research & Academic', skills: ['Experiment Design', 'Statistical Analysis', 'Academic Presentation'] },
  { category: 'Additional', skills: ['UI/UX Design', 'Wireframing', 'Prototyping', 'Problem Solving', 'Organizational and Time Management Skills', 'Prompt Engineering', 'AI Agents', 'PPTs', 'Unity3D'] }
];
const skillLevels = {
  'Python': 95,
  'Canva': 90,
  'Photoshop': 85,
  'Pixlr': 80,
  'Figma': 90,
  'Sketch': 85,
  'Data Analysis': 90,
  'Notion': 90,
  'Slack': 85,
  '3ds Max': 80,
  'Blender': 80,
  'Unity3D': 85,
  'PPTs': 95,
  'UI/UX Design': 90,
  'Prompt Engineering': 85,
  'AI Agents': 80,
  'HTML': 90,
  'CSS': 90,
  'AI': 95
};
const skillTaglines = {
  'Python': 'Expert!',
  'Canva': 'Design Pro!',
  'Photoshop': 'Pixel Perfect!',
  'Pixlr': 'Photo Wizard!',
  'Figma': 'UI/UX Pro!',
  'Sketch': 'Vector Master!',
  'Data Analysis': 'Data Cruncher!',
  'Notion': 'Productivity Guru!',
  'Slack': 'Team Player!',
  '3ds Max': '3D Artist!',
  'Blender': 'Animation Ace!',
  'Unity3D': 'Game Dev!',
  'PPTs': 'Presentation King!',
  'UI/UX Design': 'User-Centric!',
  'Prompt Engineering': 'Prompt Genius!',
  'AI Agents': 'AI Tinkerer!',
  'HTML': 'Web Wizard!',
  'CSS': 'Style Master!',
  'AI': 'AI Pro!'
};
const funnyTaglines = [
  'Still leveling up! 🚀',
  'Work in progress…',
  'Learning every day!',
  'On my way to mastery!',
  'Stay tuned for more!'
];
const getRandomFunnyTagline = () => funnyTaglines[Math.floor(Math.random() * funnyTaglines.length)];

function StarRating({ count }) {
  return (
    <span className="ml-2 text-yellow-400">
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  );
}

function App() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="animated-bg min-h-screen w-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2, type: 'spring', bounce: 0.4 }}
            className="animated-gradient-border mb-8 rounded-full"
            style={{ width: 180, height: 180 }}
          >
            <img
              src={profileImg}
              alt="Profile"
              className="rounded-full object-cover w-full h-full border-4 border-white shadow-xl"
            />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-green-400 via-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Hello, I'm Vamsi
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            PhD Student in Computer Science, specializing in Human-Computer Interaction (HCI). I'm passionate about <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent font-bold">AI</span>, UI/UX design, research, and creating innovative, user-centered experiences.
          </motion.p>
          <div className="animated-gradient-border rounded-full mb-2" style={{ padding: 2, display: 'inline-block' }}>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.07, boxShadow: '0 8px 32px rgba(236,72,153,0.15)' }}
              className="button-gradient-hover px-10 py-4 bg-white text-gray-900 rounded-full shadow-lg border-2 border-transparent text-lg font-semibold transition relative overflow-hidden group block min-w-[180px] text-center"
            >
              <span className="relative z-10">Learn More</span>
            </motion.a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="w-full flex flex-col items-center justify-center py-16">
        <div className="w-full max-w-2xl mx-auto bg-white/80 shadow-lg p-8 mb-8 gradient-border-hover">
          <h2 className="text-3xl font-bold mb-4">About Me</h2>
          <p className="text-lg text-gray-700 mb-4">
            I'm currently pursuing my PhD in Human-Computer Interaction (HCI), focusing on the intersection of technology and user experience. My current project involves Unity game development—fun and challenging! I'm passionate about UI/UX design and always seeking projects that help my portfolio stand out (because why blend in when you can shine?).
          </p>
          <p className="text-lg text-gray-700 mb-4">
            With a solid foundation in front-end technologies, my knowledge is diverse—almost like a buffet of skills, but everything on the menu is delicious. Variety <span className="italic">is</span> the spice of life!
          </p>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="w-full flex flex-col items-center justify-center py-16">
        <div className="w-full max-w-2xl mx-auto bg-white/80 shadow-lg p-8 mb-8 gradient-border-hover">
          <h2 className="text-3xl font-bold mb-6">Experience</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition hover:bg-gray-50">
              <h3 className="text-xl font-bold mb-1">Research Assistant at Google Blockly</h3>
              <p className="text-gray-700">
                Improving the coding experience by enhancing code navigation and integrating audio cues for accessibility. Building inclusive tools that empower users to engage with technology effectively.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm transition hover:bg-gray-50">
              <h3 className="text-xl font-bold mb-1">Teaching Assistant Roles at UNT</h3>
              <ul className="list-disc ml-6 text-gray-700">
                <li>Human-Computer Interaction (HCI): Usability, interaction design, user-centered research.</li>
                <li>Assembly Language: Low-level programming, computer architecture.</li>
                <li>Foundations of Cyber Security: System security, vulnerabilities, cryptography.</li>
                <li>Secure E-Commerce: Payment systems, transaction protocols, infrastructure.</li>
              </ul>
              <p className="mt-2 text-gray-700">
                These roles honed my communication and mentorship skills while deepening my technical expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="w-full flex flex-col items-center justify-center py-16">
        <div className="w-full max-w-3xl mx-auto bg-white/80 shadow-lg p-8 mb-8 gradient-border-hover">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 via-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">Skills</h2>
          {allSkills.map((group) => (
            <div key={group.category} className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">{group.category}</h3>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill) => (
                  <div
                    key={skill}
                    className={`relative cursor-pointer px-4 py-2 rounded-full border border-gray-200 shadow-sm bg-white transition hover:bg-yellow-50 ${activeSkill === skill && showPopup ? 'z-20' : ''}`}
                    onMouseEnter={() => { setActiveSkill(skill); setShowPopup(true); }}
                    onMouseLeave={() => { setShowPopup(false); setTimeout(() => setActiveSkill(null), 200); }}
                  >
                    {skill}
                    {/* Popup animation */}
                    {activeSkill === skill && showPopup && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: -10 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-1/2 -translate-x-1/2 -top-16 min-w-[180px] bg-white border border-yellow-300 rounded-xl shadow-lg p-4 flex flex-col items-center"
                      >
                        {goodSkills.includes(skill) ? (
                          <>
                            <div className="w-full flex items-center mb-2">
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skillLevels[skill] || 80}%` }}
                                  transition={{ duration: 0.7 }}
                                  className="h-2 bg-yellow-400 rounded-full"
                                />
                              </div>
                              <StarRating count={Math.round((skillLevels[skill] || 80) / 20)} />
                            </div>
                            <div className="text-sm font-semibold text-yellow-600">{skillTaglines[skill]}</div>
                          </>
                        ) : (
                          <div className="text-sm font-semibold text-purple-500 flex items-center gap-2">
                            {getRandomFunnyTagline()} <span>😅</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full flex flex-col items-center justify-center py-24 bg-transparent">
        <div className="w-full max-w-xl mx-auto bg-white/80 shadow-lg p-8 text-center gradient-border-hover">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 via-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">Contact Me</h2>
          <form
            action="https://formsubmit.co/kosurivamsi5@gmail.com"
            method="POST"
            className="flex flex-col gap-6"
          >
            {/* Redirect after submission */}
            <input type="hidden" name="_next" value="https://www.vamsikrishnakosuri.com/?contact=success" />
            {/* Disable Captcha */}
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              required
              className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            ></textarea>
            <button
              type="submit"
              className="button-gradient-hover hover-glow px-8 py-3 bg-white text-gray-900 rounded-full shadow-lg border-2 border-transparent text-lg font-semibold transition hover:scale-105"
              onClick={async (e) => {
                if (typeof window !== 'undefined') {
                  const confetti = (await import('canvas-confetti')).default;
                  confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#22c55e', '#fde047', '#f472b6', '#a78bfa'],
                  });
                }
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-8 text-sm">
        &copy; {new Date().getFullYear()} Vamsi Krishna Kosuri
      </footer>
    </div>
  );
}

export default App;
