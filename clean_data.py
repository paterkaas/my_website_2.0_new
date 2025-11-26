import json
import re
import os

# 1. INSTELLINGEN
INPUT_FILE = 'review_data/terspegelt.json'
OUTPUT_FILE = 'review_data/terspegelt_clean.json'

def clean_text(text):
    """
    Maakt de review tekst schoon:
    - Verwijdert Google Translate duplicaten.
    - Verwijdert witregels.
    """
    if not text:
        return ""
    
    # In jouw data staat vaak: "Originele tekst... (Translated by Google) Vertaalde tekst"
    # Of andersom. We splitsen op de Google markering.
    if "(Translated by Google)" in text:
        # We pakken het eerste deel (meestal de originele of de primaire vertaling)
        text = text.split("(Translated by Google)")[0]
    
    # Verwijder (Original) tag als die er nog staat
    if "(Original)" in text:
         text = text.split("(Original)")[0]

    # Verwijder newlines en dubbele spaties
    text = text.replace('\n', ' ').replace('\r', '')
    text = re.sub(' +', ' ', text)
    return text.strip()

def process_reviews():
    print(f"🔄 Bezig met lezen van {INPUT_FILE}...")
    
    # Check of bestand bestaat
    if not os.path.exists(INPUT_FILE):
        print(f"❌ Fout: Kan {INPUT_FILE} niet vinden. Zorg dat het bestand in de map 'review_data' staat.")
        return

    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
            # DEBUG: Print de keys om te zien wat de structuur is
            # print(f"DEBUG: Keys in JSON: {raw_data.keys()}") 
    except Exception as e:
        print(f"❌ Fout bij laden JSON: {e}")
        return

    cleaned_reviews = []
    
    # Jouw data structuur heeft een key "reviews" die een lijst bevat.
    # We voegen een check toe voor het geval de structuur anders is.
    if isinstance(raw_data, dict):
        reviews_list = raw_data.get('reviews', [])
    elif isinstance(raw_data, list):
        reviews_list = raw_data
    else:
        print("❌ Fout: Onverwachte JSON structuur.")
        return

    print(f"ℹ️ Aantal gevonden reviews: {len(reviews_list)}")

    for review in reviews_list:
        # In jouw data heet het veld 'comment', soms kan het 'text' heten
        comment = review.get('comment')
        # Fallback als 'comment' leeg is
        if not comment:
             comment = review.get('text')

        rating = review.get('starRating', 'UNKNOWN')
        
        # We willen alleen reviews met tekst
        if comment:
            clean_comment = clean_text(comment)
            
            # Filter hele korte reviews eruit (bv "Top." of "Goed")
            if len(clean_comment) > 5: 
                cleaned_reviews.append({
                    "text": clean_comment,
                    "rating": rating,
                    "author": review.get('reviewer', {}).get('displayName', 'Gast')
                })

    # Opslaan in een nieuw formaat
    output_data = {
        "park_name": "Recreatiepark Terspegelt",
        "total_reviews_processed": len(cleaned_reviews),
        "reviews": cleaned_reviews
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Klaar! {len(cleaned_reviews)} reviews schoongemaakt en opgeslagen in {OUTPUT_FILE}")

if __name__ == "__main__":
    process_reviews()