import base64


def process_pcm(data):
    return base64.b64encode(data).decode("utf-8")


def parse_image(base_64_str: str):
    comma = base_64_str.find(",") + 1
    return base_64_str[comma : len(base_64_str)]

    # if part.thought:
    #
    # elif part.text:
    #     yield {
    #         "type": "token",
    #         "text": part.text,
    #         "serverTs": int(time.time() * 1000),
    #         "thought_signature": (
    #             part.thought_signature
    #             if hasattr(part, "thought_signature")
    #             else None
    #         ),
    #     }

    # cache_name = ""
    # if len(history) != 0:
    #     cache = client.caches.create(
    #         model="gemini-3-flash-preview",
    #         config=genai.types.CreateCachedContentConfig(
    #             display_name="memory",
    #             ttl="3600s",
    #             contents=[genai.types.Part.from_text(text=history[0])],
    #             system_instruction=system_prompt,
    #         ),
    #     )
    #     cache_name = cache.name

    # GEMINI 3 CONFIG: Define thinking depth and image quality
