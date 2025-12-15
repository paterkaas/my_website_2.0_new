from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('contact/', views.contact, name='contact'),
    path('allcamps/', views.allcamps, name='allcamps'),
    path('beeksebergen/', views.beeksebergen, name='beeksebergen'),
    path('bungalownet/', views.bungalownet, name='bungalownet'),
    path('depaal/', views.depaal, name='depaal'),
    path('terspegelt/', views.terspegelt, name='terspegelt'),
    path('efteling/', views.efteling, name='efteling'),
]