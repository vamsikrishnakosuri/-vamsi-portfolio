# vamsikrishnakosuri.com

Personal site for Vamsi Krishna Kosuri, Accessibility & HCI Researcher.
Deployed on Vercel, served at https://www.vamsikrishnakosuri.com.

## Files
- `index.html` — the whole site (HTML, CSS, JS in one file; no build step needed).
- `profile.jpg` — portrait.
- `api/chat.js` — serverless function behind the "Ask my assistant" orb. Keeps the AI key on the server.
- `api/knowledge.js` — the only facts the assistant may use. Edit this to change what it knows, then push.

## Environment variables (Vercel → Settings → Environment Variables)
| Name | Required | Default |
|---|---|---|
| `AI_API_KEY` | yes | — (Hugging Face fine-grained token with "Make calls to Inference Providers", or a Groq key) |
| `AI_BASE_URL` | no | `https://router.huggingface.co/v1` (Groq: `https://api.groq.com/openai/v1`) |
| `AI_MODEL` | no | `openai/gpt-oss-20b` (works on both Groq and Hugging Face) |

Redeploy after changing variables.

## Local preview
`npx vite` serves the page. The assistant needs the Vercel function, so test it with `npx vercel dev` or on the deployed site.
