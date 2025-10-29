# 🦉 AgreeWise — Chrome AI Extension using Gemini Nano

**AgreeWise** helps users understand what they’re actually signing up for.  
It automatically analyzes Terms & Conditions (T&C) or Privacy Policies using **on-device AI**, summarizing risks, rights, and key points — without sending any data to servers.

Built entirely with **Chrome’s Built-in AI APIs (Gemini Nano)**, it runs locally with full privacy.
 
## 💡 How It Works

When you click **Analyze**:

- It reads the selected text or the entire webpage’s Terms & Conditions.  
- Uses the **Summarizer API** (Gemini Nano) to create clear, human-friendly summaries.  
- Uses the **Prompt API** to extract structured **risk signals**, including:
  - Personal data collection  
  - Third-party sharing  
  - Ad tracking  
  - Arbitration or auto-renewal clauses  
- Optionally uses the **Translator API** to translate the full analysis.  
- If the text contains PDFs or links, it follows and analyzes those as well.  
- Displays a collapsible **Summary** section with play/pause audio (TTS) support.  
- The interface automatically localizes button labels and headings (Show/Hide Summary) in the user’s chosen language.  

All processing happens **entirely on-device** — no cloud calls, no API keys, and no privacy leaks.

## ✨ Features

- 🧠 On-device AI (Gemini Nano) — private and fast  
- 📄 Summarizes T&C or Privacy Policies into plain-language bullet points  
- ⚖️ Highlights key risk factors (data collection, ads, arbitration, etc.)  
- 🌐 Multilingual translation with auto-localized UI text  
- 🔊 Read-aloud option with play/pause and auto-stop  
- 📎 Follows PDF or external links for deeper analysis  
- 🕶️ Auto-detects system theme (light/dark)

## 🧩 Load the AgreeWise Extension

1. Clone or download this repository:
```bash
git clone https://github.com/whynotshrutz/AgreeWise.git
cd AgreeWise
```

2. Open Chrome Canary and go to:
chrome://extensions/

3. Enable Developer Mode (top-right).

4. Click Load unpacked → select your AgreeWise/ folder.

5. The AgreeWise icon will now appear in your Chrome toolbar.

6. Click the AgreeWise icon on any Terms or Privacy page and press **Analyze** to generate a localized, collapsible summary with optional text-to-speech.

## 🧱 Built With
- Chrome’s Built-in AI APIs (Summarizer, Prompt, Translator, TTS)
- Vanilla JavaScript, Tailwind-style CSS

<details>
<summary>Setting up Gemini Nano</summary>
Here are the instruction to get started with Gemini Nano using chrome \
Make sure to have atleast 20 GB space in your local PC \
1. Download the Chrome Canary - https://www.google.com/chrome/canary/ \
2. Open Chrome Canary, head to chrome://flags/#optimization-guide-on-device-model, select -> BypassPerfRequirement \
3. Go to chrome://flags/#prompt-api-for-gemini-nano. Select Enabled \
4. Also see other capabilities in the settings like Reader , Writer API, Summarization API, etc. If you’d like, Enable them too\
6. Relaunch Chrome at each step\
Test the Gemini Nano\
Head to https://chrome.dev/web-ai-demos/prompt-api-playground/, test via chat\
<\details>
