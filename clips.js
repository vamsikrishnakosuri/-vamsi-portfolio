// The talking-photo clips.
//
// HOW TO ADD ONE
// 1. Generate/record the clip, export as .mp4 (720p is plenty, keep it under ~8 MB).
// 2. Put it in  /videos/  in this repo, e.g. videos/intro.mp4
// 3. Optional but recommended: a captions file next to it, e.g. videos/intro.vtt
// 4. Add an entry below. Set `file` to the path. Delete entries you haven't made yet.
//
// The site works fine with an empty list — the photo just does its usual animation.
// Clips with a `file` that doesn't exist are skipped automatically.
//
// `ask` = words that should make the assistant offer this clip. Lowercase.
// `text` = the transcript. Shown under the video and read by screen readers.

export const CLIPS = [
  {
    id: 'intro',
    file: 'videos/intro.mp4',
    vtt: 'videos/intro.vtt',
    title: 'Hello',
    intro: true,                 // this one plays when someone taps the photo
    ask: ['who are you', 'about you', 'introduce', 'yourself', 'hello', 'hi'],
    text: "Hi, I'm Vamsi Krishna Kosuri. I'm a fourth-year PhD candidate in Computer Science at the University of North Texas, advised by Dr. Stephanie Ludi in the DiscoverABILITY Lab. I work on making programming tools usable for people they usually leave out — blind and low-vision programmers, and neurodivergent learners. I expect to graduate in May 2027.",
  },
  {
    id: 'research',
    file: 'videos/research.mp4',
    vtt: 'videos/research.vtt',
    title: 'What I research',
    ask: ['research', 'what do you work on', 'focus', 'phd', 'dissertation', 'study'],
    text: "My research asks one stubborn question: the tools we build for programming assume a certain kind of user, so what does it take to make them work for everyone else? I approach that from three sides — blind and low-vision access, neurodivergent learners, and the human-computer interaction methods that keep both grounded in how people actually work.",
  },
  {
    id: 'blockly',
    file: 'videos/blockly.mp4',
    vtt: 'videos/blockly.vtt',
    title: 'Accessible Blockly',
    ask: ['blockly', 'blind', 'low-vision', 'screen reader', 'audio cue', 'bvi', 'eaf'],
    text: "In the DiscoverABILITY Lab I work on making Google Blockly usable with a keyboard and a screen reader. I contributed to an extension-based accessibility framework, and designed an audio cue system where the sounds change with how deeply blocks are nested, so you can hear the shape of your code. That work was funded by Google's Blockly Accessibility Fund and published at UISE 2026.",
  },
  {
    id: 'tools',
    file: 'videos/tools.mp4',
    vtt: 'videos/tools.vtt',
    title: 'Things I have shipped',
    ask: ['built', 'shipped', 'tools', 'projects', 'ai-ac', 'extension', 'chrome'],
    text: "I like research that ships. AI-AC is a Chrome extension I published that scores any website per disability profile instead of giving you one flat list — a free local rules engine mapped to WCAG 2.2, plus an optional AI pass that reads a screenshot the way a person sees it. I also built Strangers Connect, a full-stack peer-to-peer video chat app.",
  },
  {
    id: 'hiring',
    file: 'videos/hiring.mp4',
    vtt: 'videos/hiring.vtt',
    title: 'What I am looking for',
    ask: ['hire', 'hiring', 'job', 'role', 'available', 'graduate', 'looking for', 'work with'],
    text: "I graduate in May 2027, and I'm open to accessibility engineering and UX research roles, and to research collaborations. I move between research methods and engineering because good accessibility needs both — evidence about people, and software that actually runs. The fastest way to reach me is email, and there's a note you can leave on this page too.",
  },
];
