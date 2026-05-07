// lib/translate.js
const LIBRETRANSLATE_URL = "https://libretranslate.com/translate"; // Public instance
// const LIBRETRANSLATE_URL = "https://your-selfhosted-instance.com/translate";

export const translateText = async (text, targetLang, sourceLang = "auto") => {
  try {
    const res = await fetch(LIBRETRANSLATE_URL, {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // fallback to original text
  }
};