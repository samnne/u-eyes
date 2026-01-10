## Inspiration

As a marvel fan, specifically someone who loves the technology behind Jarvis, Iron Man's in-suit assistant. I saw the Gemini 3 Hackathon and the models as not just a hot new AI model but, **a means to help everyone get ahead of life.**
When a visually impaired person asks "Where's is my coffee?", your regular accessibility tool can really only say it's "on the counter." **uEyes** answers like a human would, **"it's three inches from the counter and it seems to still be hot?"** That difference is what makes **uEyes** not just convenient but independent.

**uEyes** is a tool to personalize the connection between a simple accessibility tool and a true helper and to use technology to streamline and uplift lives for all.

## What it does

**uEyes** is a real-time multimodal assistant that transforms the live environment into a semantic "HUD" for the visually impaired.

- **Live Environmental Reasoning**: It detects hazards, reads tiny text on pill bottles, and interprets social cues (e.g., "Your friend is waving at you").
- **Episodic Memory**: Using a real time database "memory" system, users can ask questions about things uEyes saw minutes or hours ago, like "Where did I leave my keys?"
- **Low-Latency Guidance**: Optimized for speed, it provides <3-5s feedback.

## How we built it

- **Frontend: React** To efficiently display the camera.
- **Models Chosen: Gemini-3-Flash-Preview, Gemini-Native Audio API**
- **Backend: FastAPI** for authentication endpoints, real-time database logic, real-time WebSocket connection to frontend.
- **Memory: Realtime Database with Firesbase** maintain a fast, simple, and reliable connection to user memories to consistently stay integrated. Creates "snapshots" of scenes captured by the model to be quickly searched.

## Challenges I ran into

Finding the right connection to bridge the frontend to backend. Initially I went to sending the snapshots via RESTful API's but I was ambitious to having ultra fast data transfer which is why I eventually settled on WebSocket's to continuously stream frames between services. Another challenge I ran into was rate limiting to avoid intense costs, an extensive and real-time connection constantly making reads, writes, API calls to Gemini comes with a lot of financial drawbacks. I solved this by implementing **Content Caching** for the system instructions so we avoid unnecessary tokens to be sent on each request.

## Accomplishments that we're proud of

I successfully achieved **<800-1200ms** response time for visual queries to really have the AI feel like a natural experience. We are also incredibly proud of our **"Social Cues"** module, which uses **Gemini 3’s** reasoning to go beyond object detection and actually describe the intent of people in the room (e.g., "The person at the desk looks busy, maybe wait to approach").

## Why uEyes is Different

Most accessibility tools stop at object detection.  
uEyes aims to deliver **human-like understanding**.

Traditional tools:
- "Item detected"
- "Person detected"

**uEyes**:
- "Your keys are near the edge of the counter"
- "Your friend is waving, they look happy to see you."

Which was only possible with Gemini 3's reasoning, context caching, and thought signatures to make this as cost effective, efficient, and accessible.

## What I learned

I learned how to leverage **AI** to be a companion and not a simple tool. I learned how to maximize performance, use **WebSocket's** for real-time connections, use **Firebase's Realtime Database**, and create a full backend with **FastAPI's** python library. Most of all, I learned how to make an application that solves a real problem for people who would really benefit from a second set of eyes and that is why I feel so passionate about technology.

## What's next for uEyes

I plan to integrate **Gemini 3's Audio-to-Audio** streaming to remove the need for a **TTS** engine, making the voice even more natural and empathetic. I plan to really integrate connections through most common locations a person visits that important items tend to be left and also implement support for smart glasses to keep people connected with their world as much as possible.

