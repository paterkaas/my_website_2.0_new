import os
import json

print("--- START SCRIPT ---")

# 1. Check of de map bestaat
if os.path.exists('review_data'):
    print("✅ Map 'review_data' gevonden.")
else:
    print("❌ Map 'review_data' NIET gevonden! Maak deze map aan.")

# 2. Check of het bestand bestaat
bestand = 'review_data/terspegelt.json'
if os.path.exists(bestand):
    print(f"✅ Bestand '{bestand}' gevonden.")
    
    # Probeer het bestand te lezen
    try:
        with open(bestand, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print("✅ JSON succesvol ingeladen!")
            
            # Check wat voor soort data het is
            if isinstance(data, dict):
                print(f"ℹ️ Data is een Dictionary. Keys: {list(data.keys())}")
                reviews = data.get('reviews', [])
                print(f"ℹ️ Aantal reviews gevonden in 'reviews': {len(reviews)}")
            elif isinstance(data, list):
                print(f"ℹ️ Data is een Lijst. Aantal items: {len(data)}")
            else:
                print("⚠️ Data is een onbekend type.")
                
    except Exception as e:
        print(f"❌ Fout bij lezen JSON: {e}")

else:
    print(f"❌ Bestand '{bestand}' NIET gevonden. Controleer de naam!")

print("--- EINDE SCRIPT ---")