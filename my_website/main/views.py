import os
import json
import google.generativeai as genai
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# --- PAGINA VIEWS ---

def home(request):
    return render(request, 'main/index.html')

def contact(request):
    return render(request, 'main/contact.html')

def allcamps(request):
    return render(request, 'main/allcamps.html')

def beeksebergen(request):
    return render(request, 'main/beeksebergen.html')

def bungalownet(request):
    return render(request, 'main/bungalownet.html')

def depaal(request):
    return render(request, 'main/depaal.html')

def terspegelt(request):
    return render(request, 'main/terspegelt.html')

def efteling(request):
    return render(request, 'main/efteling.html')

def privacy(request):
    return render(request, 'main/privacy.html')


# --- CHATBOT API (De Logica) ---

@csrf_exempt  # Zorgt dat we geen 403 Forbidden error krijgen op de chat
def chat_api(request):
    if request.method == 'POST':
        try:
            # 1. Haal het bericht op uit de request
            data = json.loads(request.body)
            user_message = data.get('message', '')

            # 2. Check de API Key
            api_key = os.environ.get('GEMINI_API_KEY')
            if not api_key:
                return JsonResponse({'error': 'API Key not configured'}, status=500)

            # 3. Stel Google Gemini in
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')

            # 4. De instructies voor de AI (vertaald uit jouw chat.js)
            system_instruction = f"""
            You are the 'Brabant Insider AI', an enthusiastic travel assistant for TravelCompAInion.
            
            YOUR AFFILIATE LINKS (Use ONLY when relevant):
            - Recreatiepark Terspegelt: https://www.terspegelt.nl/holiday/?tt=34175_12_502758_trust&r=%2Fen%2F
            - Camping de Paal: https://www.depaal.nl
            - Efteling Hotel: https://www.booking.com/hotel/nl/efteling
            - Bungalow.net: https://tt.bungalow.net/c?c=1086&m=12&a=502758&r=trust&u=%2Fsearch%2Fnl%2F%3FSearchStringHomePage%3DNoord%2BBrabant
            - Allcamps: https://www.allcamps.nl/europacamp/?tt=2657_12_502758_trust&r=%2Fzoek-en-boek%3Fcountry%3Dnederland%26area%3Dnoord-brabant
            - Safaripark Beekse Bergen: https://www.beeksebergen.nl/ttnl/?tt=23280_12_502758_trust&r=%2Fen%2Fstay-the-night

            YOUR RULES:
            1. ONLY answer questions about travel to or in North Brabant (Netherlands).
            2. If asked about coding/math/politics, politely refuse.
            3. PROMOTION: Subtly suggest the locations above if they fit.
            4. LINKS: If you suggest a location, YOU MUST PROVIDE THE LINK.
            5. TONE: Enthusiastic, concise, use emojis.
            6. LANGUAGE: Reply in the same language as the user (english).
            7. Keep it short (max 400 chars).

            User Question: {user_message}
            """

            # 5. Genereer antwoord
            response = model.generate_content(system_instruction)
            
            return JsonResponse({'reply': response.text})

        except Exception as e:
            print("AI Error:", e)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid method'}, status=405)