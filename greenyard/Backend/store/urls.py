from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.get_products),
    path('order/', views.make_order),
    path('contact/', views.contact_form),
    path('mpesa/callback/', views.mpesa_callback),
]
