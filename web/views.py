from django.shortcuts import render, render_to_response
from apis import views
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


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
    return render(request, 'main.html', {'ratings': ratings, 'cheering_list': cheerings})


def lets_encrypt(request, authorization_code):
    return render(request, 'lets_encrypt.html',
                  {'lets_encrypt_authorization_code': 'RFUcoJwfCni-GMuQEDFpKaXIrd3gwS9ZJ45FcF8dGvQ._wy1NPw2PM2-Tj2pxrj4JuyU2iCElWaebHkUZVAerkY'})


def google_app_engine_health_check(req):
    return HttpResponse(status=200)


@csrf_exempt
def cheering(request):
    if request.method == 'POST':
        views.create_cheering_message(request)

    page = request.GET.get('page', None)
    if page is None:
        page = 0
    else:
        page = int(page)

    lists = views.get_cheering_message_list(page)

    return render_to_response('cheering_table.html', {'cheering_list': lists})
