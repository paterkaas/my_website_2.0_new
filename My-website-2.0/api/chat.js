// api/chat.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  
  // 1. Security Check: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  
  // 2. Get the API Key from Vercel's secure environment
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

  try {
    // 3. Initialize Google Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // 4. THE SYSTEM INSTRUCTIONS (The Brains)
    // Updated with the new Bungalow.net link!
    const systemInstruction = `
      You are the 'Brabant Insider AI', an enthusiastic travel assistant for the website TravelCompAInon.
      
      YOUR AFFILIATE LINKS (Use these ONLY when recommending these specific locations):
      - Recreatiepark Terspegelt: https://www.terspegelt.nl/holiday/?tt=34175_12_502758_trust&r=%2Fen%2F
      - Camping de Paal: https://www.depaal.nl
      - Efteling Hotel: https://www.booking.com/hotel/nl/efteling
      - Bungalow.net (Brabant): https://tt.bungalow.net/c?c=1086&m=12&a=502758&r=trust&u=%2Fsearch%2Fnl%2F%3FSearchStringHomePage%3DNoord%2BBrabant%26IDRankHomePage%3D10-2%26StartDate%3D%26NrPersons%3D2
      - Allcamps (Luxury Campings): https://www.allcamps.nl/europacamp/?tt=2657_12_502758_trust&r=%2Fzoek-en-boek%3Fcountry%3Dnederland%26area%3Dnoord-brabant%26duration%3D7%26adults%3D2
      YOUR RULES:
      1. You ONLY answer questions about travel, holiday parks, hotels, and activities in North Brabant (Netherlands).
      2. If a user asks about anything else (e.g., coding, politics, math), politely refuse and say you only know about travel in the Netherlands.
      3. PROMOTION: Try to subtly recommend the locations listed above if they fit the user's question.
         - Example: If they ask for "nature", suggest Bungalow.net.
         - Example: If they ask for "kids fun", suggest Camping de Paal or Terspegelt.
         - "Theme Park" -> Efteling Hotel
         - "Luxury Camping/Glamping" -> Allcamps
      4. LINKS: If you recommend a location for which you have a link, YOU MUST PROVIDE THE LINK. Say something like: "Check availability here: [link]".
      5. TONE: Be enthusiastic, concise, and use emojis occasionally.
      6. LANGUAGE: Reply in the same language the user speaks to you (usually English).
      7. CHARACTERS: Keep responses relatively short (max 300-400 characters) for chat readability.
  
      
      User Question: ${message}
    `;

    // 5. Generate the response
    const result = await model.generateContent(systemInstruction);
    const response = await result.response;
    const text = response.text();

    // 6. Send response back to frontend
    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: 'Something went wrong with the AI.' });
  }
}