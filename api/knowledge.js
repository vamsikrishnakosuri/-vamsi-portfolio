// Everything the website assistant knows about Vamsi. Plain text. Edit freely, redeploy.
// Only put things here that you are happy for ANY visitor to hear.
export const KNOWLEDGE = `
IDENTITY
- Full name: Vamsi Krishna Kosuri. He/him.
- Fourth-year PhD candidate in Computer Science and Engineering at the University of North Texas (UNT), Denton, Texas.
- Advisor: Dr. Stephanie Ludi, DiscoverABILITY Lab, UNT.
- Started the PhD in August 2023. Expected graduation: May 2027.
- Funded Research Assistant at UNT. Maintains a 4.0 GPA in the PhD program.
- Originally from Visakhapatnam (Vizag), India. Speaks Telugu and English.
- Website: https://www.vamsikrishnakosuri.com. Email: kosurivamsi5@gmail.com. GitHub: https://github.com/vamsikrishnakosuri

RESEARCH FOCUS
- Accessibility and human-computer interaction (HCI), specifically accessible programming tools.
- Two populations: (1) blind and low-vision (BLV) programmers, (2) neurodivergent learners.
- Dissertation topic: AI-enhanced adaptive block-based programming for neurodivergent learners. It is a three-paper dissertation.
- Methods he uses: co-design, surveys, usability testing, interviews, qualitative coding, experiment design, statistical analysis.

DISSERTATION TOOL (not yet published)
- Vamsi is building an adaptive block-based programming tool for neurodivergent learners: a block-based editor that changes how it supports the learner based on how they work, designed with input from the people it is for.
- The tool's name, its specific features, the specific population, survey findings, and study details are NOT public yet. Do not name the tool, do not name a specific condition or diagnosis, do not list features, and do not describe any study. If asked for more, say the work is unpublished and Vamsi can share details by email at kosurivamsi5@gmail.com.

ACCESSIBLE BLOCKLY FOR BLIND AND LOW-VISION USERS (research assistant work)
- Works in the DiscoverABILITY Lab on making Google Blockly usable with a keyboard and a screen reader.
- Contributed to an extension-based accessibility framework for Blockly, and designed an audio cue system where sounds change with the nesting depth of blocks (for example, dive/surface water sounds).
- Also did accessible-PDF work (tagged headings, table headers, alt text) so the papers themselves are readable with screen readers.

PUBLICATIONS
- Mollik, Kosuri, Djalali, Ludi, Mountapmbeme (2026). "An Extension-Based Accessibility Framework for Making Blockly Accessible to Blind and Low-Vision Users." UISE '26, 1st International Workshop on User Interface and Experience for Software Engineering, Rio de Janeiro, Brazil, April 2026. ACM. DOI 10.1145/3786169.3788398. Also on arXiv (2601.10688). Vamsi is second author. PDF is open access at https://dl.acm.org/doi/pdf/10.1145/3786169.3788398 Summary: EAF is a plugin-style framework that adds keyboard navigation, screen-reader support (WAI-ARIA, tested with NVDA, JAWS, VoiceOver), a "3D" navigation model (left-right, up-down, in-out of nesting) using WASD+F/Q keys, stack labels and block numbers, stack jumping, and mode-based editing to Blockly without modifying the Blockly library. Evaluated with 177 integration test cases and interviews with 4 participants. Funded by Google's Blockly Accessibility Fund. Demo: https://rubelhassan.github.io/eaf-blockly
- Two further papers on accessible block-based programming are currently under review. Their titles, venues, and findings are not public yet, so do not name or describe them; say Vamsi can share details by email once they are public.

TOOLS HE HAS SHIPPED
- AI-AC (AI Accessibility Checker): a published Chrome extension (Manifest V3, JavaScript). It scans any website and reports a score for each disability profile rather than one flat list. A free local rules engine is mapped to WCAG 2.2; an optional AI vision pass reads a screenshot to catch text baked into images, meaning carried by colour alone, and mismatched alt text. Chrome Web Store: https://chromewebstore.google.com/detail/kkfchmjomomkiggchkodggcniklniika Source: https://github.com/vamsikrishnakosuri/ai-ac
- Strangers Connect: a full-stack video chat app (WebRTC peer-to-peer video, Socket.io signalling, Node.js, React, end-to-end encrypted messaging, dark/light UI). Demo: https://strangers-connect.vercel.app Source: https://github.com/vamsikrishnakosuri/StrangersConnect
- This website itself is hand-built HTML/CSS/JS, designed to WCAG 2.2 AA, and the assistant you are talking to runs on a small serverless function he wrote.

TEACHING AND MENTORSHIP (University of North Texas)
- Mentors undergraduate researchers in the UR2PhD program under Dr. Ludi.
- Teaching Assistant for Human-Computer Interaction, Assembly Language, Cyber Security, and Secure E-Commerce.

SKILLS
- Accessibility: WCAG 2.2, screen readers, keyboard navigation, audio interfaces, accessible PDF (PDF/UA).
- Engineering: JavaScript, Python, C#, HTML/CSS, Google Blockly, Chrome extensions, Node.js, React, Unity3D.
- Design: Figma, Adobe XD, prototyping, interaction design.
- Research: survey design, usability studies, qualitative coding, NLP, statistics.

WHAT HE IS LOOKING FOR
- Graduating May 2027. Open to accessibility engineering and UX research roles in industry, and to research collaborations.
- Best way to reach him: kosurivamsi5@gmail.com
`;
