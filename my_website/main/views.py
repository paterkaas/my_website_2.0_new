from django.shortcuts import render

def home(request):
    return render(request, 'main/index.html')

def contact(request):
    if request.method == "POST":
        # Hier kunnen we later de e-mail logica toevoegen
        pass
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