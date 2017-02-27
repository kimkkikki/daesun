from django.shortcuts import render
from apis import views
from django.http import HttpResponse


def index(request):
    book_list = views.get_shop()
    pledge_rank_list = views.pledge_rank_list()
    sns_list = views.get_candidate_sns_list()
    issue_list = views.get_issue_keyword_list()
    return render(request, 'index.html', {'book_list': book_list, 'pledge_rank_list': pledge_rank_list, 'sns_list': sns_list,
                                          'issue_list': issue_list})


def graphs(request):
    return render(request, template_name='graphs.html')


def name(request):
    return render(request, template_name='nameLuck.html')


def lets_encrypt(request, authorization_code):
    return render(request, 'lets_encrypt.html',
                  {'lets_encrypt_authorization_code': 'RFUcoJwfCni-GMuQEDFpKaXIrd3gwS9ZJ45FcF8dGvQ._wy1NPw2PM2-Tj2pxrj4JuyU2iCElWaebHkUZVAerkY'})


def google_app_engine_health_check(req):
    return HttpResponse(status=200)
