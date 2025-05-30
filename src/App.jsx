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
            PhD Student in Computer Science, specializing in Human-Computer Interaction (HCI) & XR. Passionate about UI/UX design, research, and creating innovative, user-centered experiences.
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
      <section id="contact" className="w-full flex flex-col items-center justify-center py-24 bg-transparent">
        <div className="w-full max-w-xl mx-auto bg-white/80 rounded-2xl shadow-lg p-8 text-center">
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
              className="button-gradient-hover px-8 py-3 bg-white text-gray-900 rounded-full shadow-lg border-2 border-transparent text-lg font-semibold transition hover:scale-105"
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
