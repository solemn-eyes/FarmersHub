import base64
import requests
from django.conf import settings


def get_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET

    response = requests.get(url, auth=(consumer_key, consumer_secret))
    return response.json().get("access_token")


def stk_push(phone, amount):
    access_token = get_access_token()

    api_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    timestamp = "20250101120000"  # temporary
    short_code = settings.MPESA_SHORTCODE
    passkey = settings.MPESA_PASSKEY

    data_to_encode = short_code + passkey + timestamp
    password = base64.b64encode(data_to_encode.encode()).decode()

    headers = {"Authorization": f"Bearer {access_token}"}

    payload = {
        "BusinessShortCode": short_code,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": short_code,
        "PhoneNumber": phone,
        "CallBackURL": settings.MPESA_CALLBACK_URL,
        "AccountReference": "GreenYard Poultry",
        "TransactionDesc": "Poultry Order"
    }

    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()
