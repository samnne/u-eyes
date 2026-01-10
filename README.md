## uEyes 👁️

A _real-time visual assistant powered by Gemini 3_

## Inspiration

As a marvel fan, 
specifically someone who loves the technology behind Jarvis, 
Iron Man's in-suit assistant. 
I saw the Gemini 3 Hackathon and the models as not just a hot new AI model but, **a means to help everyone get ahead of life, 
the same way it did Tony**.
When a visually impaired person asks "Where's is my coffee?", 
your regular accessibility tool can really only say it's "on the counter." 
**uEyes** answers like a human would,
**"it's three inches from the counter and it seems to still be hot?"** 
That difference is what makes **uEyes** not just convenient but independent.



**uEyes** is a tool to personalize the connection between a 
simple accessibility tool and a true helper and to 
use technology to streamline and uplift lives for all.

## What it does

**uEyes** is a personal assistant built to help people see, remember, and make life more streamlined
for both the visually impaired and anyone looking to never forgot the world around them.

**1. Camera Processing**. 

Uses real-time camera processing to capture snapshots of the surrounding scene 
to send via websockets and utlizes Gemini 3 to understand, think, and announce the scene around to the end user 

**2. Proper Context Building**. 

**uEyes** uses **context caching** to reduce the need for unnecessary
parts in a conversation to be relayed to the end user. The ensures quality responses, and 
explainations that give guidance and a better underatanding about the surrounding area.

**3. Memorization (Core Feature)**. 

This is what takes **uEyes to the next level**

+ Stores **up to 24 hours of scene memory** to enusre privacy
+ Uses **Firestore to save:
   + Scene Summaries
   + Key Objects 
   + Spacial Hints 
+ Enables Questions like:
> "Yesterday, where did I put my work shirt?"


**4. Low Latency Guidance**




## How we built it

- **Frontend: React** To efficiently display the camera.
- **Models Chosen: Gemini-3-Flash-Preview, Gemini-Native Audio API**
- **Backend: FastAPI** for authentication endpoints, real-time database logic, real-time WebSocket connection to frontend.
- **Memory: Realtime Database with Firesbase** maintain a fast, simple, and reliable connection to user memories to consistently stay integrated. Creates "snapshots" of scenes captured by the model to be quickly searched.


This allows to make a streamlined architecture to make this a one of its kind user experience.
```markdown
Camera Feed
   ↓
Frontend (React)
   ↓ (WebSocket stream)
Backend (FastAPI)
   ↓
Gemini 3 Reasoning
   ↓
Realtime Memory (Firebase)
   ↓
Audio Response (TTS)
```

## Challenges I ran into

**1. The Importance of Websockets** 

Finding the right connection to bridge the frontend to backend. 
Initially I went to sending the snapshots via RESTful API's but I was ambitious to having ultra fast data transfer which is why I eventually settled on WebSocket's to continuously stream frames between services. 
Another challenge I ran into was rate limiting to avoid intense costs, an extensive and real-time connection constantly making reads, writes, API calls to Gemini comes with a lot of financial drawbacks. 
I solved this by implementing **Content Caching** for the system instructions so we avoid unnecessary tokens to be sent on each request.

**2. Gemini Native API session**

Keeping track of the **Gemini Live API** session and using both the **Gemini 3 Pro** model to describe the scene 
was a feat for this project. Making sure **uEyes** has a friendly user experience by utilizing the Live API was a must,
which became the biggest problem in development: the session ending abruptly, constant 500 error by sessions being lost due to inactivity and not spinning back up, 
abd correctly sending PCM audio from the backend to the client. Overall we solved this through reading Google's extensive documentation and using Google Gemini to aide in the 
debugging process to really create a polished and well documented solution.

**3. Memorization** 

Yes, the **BIG** feature from before was the most difficult to implement.
Getting **uEyes** to be fetch based on session ID's of the active user and making sure 
the data fetched from the DB was accurate to the individual in oppose to external scenes. 
Incorrect taglines being returned to the end user, again due to wrong information being fetched. Fixing this did come quickly, 
as it just took refactoring the database logic to be "iron clad" with efficient user queries.


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

**1. Audio-to-Audio Integration**

I plan to integrate **Gemini 3's Audio-to-Audio** 
streaming to remove the need for a **TTS** engine, 
making the voice even more natural and empathetic. 

**2. Repeated Locations**

I plan to really integrate connection through most common locations a person visits that important 
items tend to be left and still keeping users privacy a cause of concern

**2. Multi-Platform Accessibility**

implement support for smart glasses to keep people connected with their world as much as possible.

**3. Hands Free Experience**

I also plan to incorporate browser tooling so the site can be **SEO** compliant, and work 
effectively with accessibility readers so the site is navigable without the need to press a single button. Distinguishing between
traditional tools.

## Demo Scenario

**User:** “Where’s my coffee?”
**uEyes:** “It’s about three inches from the counter edge, and it looks hot.”


**User:** “Did I take my pills earlier?”
**uEyes:** “Yes — you took them around 20 minutes ago.”


**User:** “Is anyone trying to get my attention?”
**uEyes:** "Your friend is waving and smiling.”


## Check it Out Here 

__(In Development)__
Video Demo, and production application coming soon!