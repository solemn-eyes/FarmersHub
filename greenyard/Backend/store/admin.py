from django.contrib import admin
from .models import Product, Order, Contact


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'total', 'paid', 'created_at')
    readonly_fields = ('created_at',)


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'created_at')
    readonly_fields = ('created_at',)
from django.contrib import admin

# Register your models here.
