import google.generativeai as genai
import os
from ai_engine.base import AISummary
from ai_engine.enums import GeminiModelVersion

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class GeminiModel:
    def __init__(self):
        self.model_name = GeminiModelVersion.GEMINI_1_5_FLASH.value

    def summarize(self, content: str) -> dict:
        prompt = f""" (Make sure to write in paragraphs and do not use bullet points or numbering and 1 line break in paragraph)
            Summarize the text below in a structured format of length 400-500 words and in response just write (Here's the summary of the PDF content:) 

            Text:
        """

        model = genai.GenerativeModel(self.model_name)
        response = model.generate_content(f"{prompt}\n{content}")

        return {
            "summary": response.text.strip(),
            # "token_usage": response.usage_metadata.get("total_token_count") if response.usage_metadata else None
        }