from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('privacy/', views.privacy, name='privacy'),                             
    
    # De nieuwe pagina's
    path('allcamps/', views.allcamps, name='allcamps'),
    path('beeksebergen/', views.beeksebergen, name='beeksebergen'),
    path('bungalownet/', views.bungalownet, name='bungalownet'),
    path('depaal/', views.depaal, name='depaal'),
    path('terspegelt/', views.terspegelt, name='terspegelt'),
    path('efteling/', views.efteling, name='efteling'),
    path('sitemap.xml', TemplateView.as_view(template_name='main/sitemap.xml', content_type='text/xml')),


    # <--- HIER IS DE NIEUWE REGEL VOOR DE CHATBOT:
    path('api/chat', views.chat_api, name='chat_api'),
]