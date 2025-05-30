import { motion } from 'framer-motion';
import './index.css';
import profileImg from './profile.png';

const heroVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function App() {
  return (
    <div className="animated-bg min-h-screen flex flex-col items-center justify-center font-sans">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: 'spring', bounce: 0.2 }}
        className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4 sm:px-6 md:px-8"
      >
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
          PhD Student in Computer Science, specializing in Human-Computer Interaction (HCI) & XR. Passionate about UI/UX design, research, and creating innovative, user-centered experiences.
        </motion.p>
        <div className="animated-gradient-border rounded-full p-[3px] mb-2">
          <motion.a
            href="#about"
            whileHover={{ scale: 1.07, boxShadow: '0 8px 32px rgba(236,72,153,0.15)' }}
            className="button-gradient-hover px-10 py-4 bg-white text-gray-900 rounded-full shadow-lg border-2 border-transparent text-lg font-semibold transition relative overflow-hidden group block"
            style={{ minWidth: 180, textAlign: 'center' }}
          >
            <span className="relative z-10">Learn More</span>
          </motion.a>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-3xl mx-auto py-16 px-4"
      >
        <h2 className="text-3xl font-semibold mb-4">About Me</h2>
        <p className="text-lg text-gray-700 mb-4">
          I'm currently pursuing my PhD in Human-Computer Interaction (HCI), focusing on the intersection of technology and user experience. My current project involves Unity game development—fun and challenging! I'm passionate about UI/UX design and always seeking projects that help my portfolio stand out (because why blend in when you can shine?).
        </p>
        <p className="text-lg text-gray-700 mb-4">
          With a solid foundation in front-end technologies, my knowledge is diverse—almost like a buffet of skills, but everything on the menu is delicious. Variety <span className="italic">is</span> the spice of life!
        </p>
      </motion.section>

      {/* Experience Section */}
      <motion.section
        id="experience"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-3xl mx-auto py-16 px-4"
      >
        <h2 className="text-3xl font-semibold mb-6">Experience</h2>
        <div className="space-y-6">
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            className="bg-gray-50 rounded-xl p-6 shadow transition"
          >
            <h3 className="text-xl font-bold mb-1">Research Assistant at Google Blockly</h3>
            <p className="text-gray-700">
              Improving the coding experience by enhancing code navigation and integrating audio cues for accessibility. Building inclusive tools that empower users to engage with technology effectively.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            className="bg-gray-50 rounded-xl p-6 shadow transition"
          >
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
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-3xl mx-auto py-16 px-4 text-center"
      >
        <h2 className="text-3xl font-semibold mb-4">Contact</h2>
        <p className="text-lg text-gray-700 mb-6">
          Want to connect or collaborate? Reach out via email or find me on social media!
        </p>
        <div className="flex justify-center space-x-6">
          <a href="mailto:vamsi@email.com" className="text-black hover:text-blue-600 text-2xl transition">✉️</a>
          <a href="https://www.linkedin.com/in/vamsikrishnakosuri/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-600 text-2xl transition">in</a>
          {/* Add more social links as needed */}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-8 text-sm">
        &copy; {new Date().getFullYear()} Vamsi Krishna Kosuri
      </footer>
    </div>
  );
}

export default App;
