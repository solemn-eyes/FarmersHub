from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from django.conf import settings
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer
from .mpesa import stk_push


@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def contact_form(request):
    name = request.data.get('name')
    email = request.data.get('email')
    message = request.data.get('message')

    if not name or not email or not message:
        return Response({'error': 'All fields required'}, status=400)

    full_message = (
        f"Name: {name}\n"
        f"Email: {email}\n\n"
        f"Message:\n{message}"
    )

    send_mail(
        "New Contact Message - Poultry Shop",
        full_message,
        settings.EMAIL_HOST_USER,
        ["jerhomemaunga@gmail.com", "jeemaventures@gmail.com", "momuono6@gmail.com"],
    )

    return Response({'success': 'Message sent!'})


@api_view(['POST'])
def make_order(request):
    phone = request.data.get('phone_number')
    amount = request.data.get('amount')

    if not phone or not amount:
        return Response({'error': 'Phone number and amount required'}, status=400)

    # STK PUSH
    mpesa_response = stk_push(phone, int(amount))

    # Record order in DB
    order = Order.objects.create(
        phone_number=phone,
        amount=amount
    )

    return Response({
        "message": "STK push sent. Complete payment on your phone.",
        "order_id": order.id,
        "mpesa_response": mpesa_response
    })


@api_view(['POST'])
def mpesa_callback(request):
    data = request.data

    # Safaricom returns this nested structure
    try:
        callback = data["Body"]["stkCallback"]
        result_code = callback["ResultCode"]
        receipt = callback["CallbackMetadata"]["Item"][1]["Value"]
    except:
        return Response({"message": "Invalid callback"}, status=400)

    # If payment successful
    if result_code == 0:
        # You can update the order or log the transaction
        print("MPESA RECEIPT: ", receipt)

    return Response({"message": "Callback received"})
