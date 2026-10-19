// Blog posts shown in the Blog app inside VamsiOS. Newest first.
// Each post: slug, title, date (YYYY-MM-DD), summary, body (one string per paragraph).
// draft: true shows the post only on preview links, never on vamsikrishnakosuri.com.
export const POSTS = [
  {
    slug: 'why-my-homepage-is-a-desk',
    title: 'Why my homepage is a desk',
    date: '2026-10-19',
    draft: true,
    summary: 'A portfolio about accessibility should be accessible all the way down, even when it plays.',
    body: [
      'My homepage is my desk. The painting, the whiteboard, the laptop, the headphones and the lamp each open something: my research, my projects, my papers, a small audio demo, and the light or dark theme.',
      'I research how blind, low-vision and neurodivergent learners can program, so the playful version had to work for them too. Every object on the desk is a real button or link with a name a screen reader can announce. Tab and Enter reach all of them, in a sensible order.',
      'The 3D room is drawn on top of the same buttons. Nothing about how you move through the page changes when the room appears. If your device prefers less motion, the room stays still. If you would rather read, the plain text view removes the decoration entirely.',
      'I think delight and access are not a trade-off. This desk is my attempt to show that.',
    ],
  },
];
