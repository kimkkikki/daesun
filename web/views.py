from django.shortcuts import render
from apis import views


def index(request):
    book_list = views.get_shop()
    return render(request, 'index.html', {'book_list': book_list})


def graphs(request):
    return render(request, template_name='graphs.html')


def name(request):
    return render(request, template_name='nameLuck.html')


def lets_encrypt(request, authorization_code):
    return render(request, 'lets_encrypt.html',
                  {'lets_encrypt_authorization_code': 'RFUcoJwfCni-GMuQEDFpKaXIrd3gwS9ZJ45FcF8dGvQ._wy1NPw2PM2-Tj2pxrj4JuyU2iCElWaebHkUZVAerkY'})
