from rest_framework import serializers
from .models import Product, Order, Contact
from decimal import Decimal


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'phone', 'address', 'items', 'total', 'created_at', 'paid', 'mpesa_checkout_request_id', 'mpesa_response']
        read_only_fields = ['created_at', 'paid', 'mpesa_checkout_request_id', 'mpesa_response']

    def validate_items(self, value):
        # Expect a list of {"product_id": int, "qty": int}
        if not isinstance(value, list):
            raise serializers.ValidationError("items must be a list")
        for item in value:
            if not isinstance(item, dict):
                raise serializers.ValidationError("each item must be an object with product_id and qty")
            if 'product_id' not in item or 'qty' not in item:
                raise serializers.ValidationError("each item must include product_id and qty")
            try:
                int(item['qty'])
            except Exception:
                raise serializers.ValidationError("qty must be an integer")
        return value

    def create(self, validated_data):
        items = validated_data.get('items', [])
        total_calc = Decimal('0.00')
        for it in items:
            prod_id = it.get('product_id')
            qty = int(it.get('qty', 0))
            try:
                product = Product.objects.get(pk=prod_id)
                total_calc += (product.price * qty)
            except Product.DoesNotExist:
                # skip or raise — prefer to raise so consumer corrects input
                raise serializers.ValidationError({"product_id": f"Product {prod_id} does not exist"})

        validated_data['total'] = total_calc
        return super().create(validated_data)


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'message', 'created_at']
        read_only_fields = ['created_at']
