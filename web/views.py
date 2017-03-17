from django.shortcuts import render, render_to_response
from apis import views
from django.http import HttpResponse
from datetime import datetime


def index(request):
    book_list = views.get_shop()
    # book_list = []
    pledge_rank_list = views.pledge_rank_list()
    sns_list = views.get_candidate_sns_list()
    issue_list = views.get_issue_keyword_list()
    cheerings = views.get_cheering_message_list(0)
    return render(request, 'index.html', {'book_list': book_list, 'pledge_rank_list': pledge_rank_list, 'sns_list': sns_list,
                                          'issue_list': issue_list, 'cheering_list': cheerings})


def main(request):
    ratings = views.approval_rating_list(None, True)
    cheerings = views.get_cheering_message_list(0)
    return render(request, 'main.html', {'ratings': ratings, 'cheering_list': cheerings, 'today': datetime.today()})


def lets_encrypt(request, authorization_code):
    return render(request, 'lets_encrypt.html',
                  {'lets_encrypt_authorization_code': 'RFUcoJwfCni-GMuQEDFpKaXIrd3gwS9ZJ45FcF8dGvQ._wy1NPw2PM2-Tj2pxrj4JuyU2iCElWaebHkUZVAerkY'})


def google_app_engine_health_check(req):
    return HttpResponse(status=200)


def cheering(request):
    if request.method == 'POST':
        views.create_cheering_message(request)

    page = request.GET.get('page', None)
    if page is None:
        page = 0
    else:
        page = int(page)

    lists = views.get_cheering_message_list(page)
    return render_to_response('cheering_table.html', {'cheering_list': lists, 'today': datetime.today()})


def rating(request):
    if request.method == 'POST':
        ratings = views.lucky_rating_list()
        return render_to_response('rating.html', {'ratings': ratings})
    else:
        return HttpResponse(status=404)


def pledge(request):
    if request.method == 'GET':
        type = request.GET.get('type', None)
        if type is None:
            return render_to_response('pledge_test.html')
        elif type == 'rank':
            results = views.pledge_rank_list()
            return render_to_response('pledge_rank_modal.html', {'pledge_rank_list': results})
    else:
        results = views.pledge_post(request)
        return render_to_response('pledge_result.html', {'results': results})


def constellation_chemistry(request):
    if request.method == 'POST':
        results = views.constellation_post(request)
        return render_to_response('constellation_modal.html', {'constellation_result': results})
