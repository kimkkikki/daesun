from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import cache_page
from apis import views
from django.http import HttpResponse
from datetime import datetime, date
from django.conf import settings


def labs(request):
    book_list = views.get_shop()
    return render(request, 'labs.html', {'book_list': book_list})


def terms(request):
    return render(request, 'terms.html')


def policy(request):
    return render(request, 'policy.html')


@cache_page(60 * 1)
def main(request):
    # ratings = views.lucky_rating_list('all')
    # ratings = views.approval_rating_list(None, True)

    lucky_count = views.lucky_rating_count()
    cheerings = views.get_cheering_message_list(0)
    d_day = (date(2017, 5, 9) - date.today()).days
    candidates = views.get_candidates()
    return render(request, 'main.html', {'lucky_count': lucky_count, 'count_string': '%', 'cheering_list': cheerings, 'today': datetime.today(), 'd_day': d_day, 'candidates': candidates})


def lets_encrypt(request, authorization_code):
    print(authorization_code)
    return render(request, 'lets_encrypt.html',
                  {'lets_encrypt_authorization_code': 'RFUcoJwfCni-GMuQEDFpKaXIrd3gwS9ZJ45FcF8dGvQ._wy1NPw2PM2-Tj2pxrj4JuyU2iCElWaebHkUZVAerkY'})


def google_app_engine_health_check(request):
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
    return render_to_response('cheering_table.html', {'cheering_list': lists, 'today': datetime.today()})


@cache_page(60 * 10)
@csrf_exempt
def rating(request):
    if request.method == 'GET':
        request_type = request.GET.get('type', 'all')
        ratings = views.lucky_rating_list(request_type)
        if request_type == 'detail':
            return render_to_response('rating_lucky.html', {'results': ratings})
        else:
            return render_to_response('rating.html', {'ratings': ratings, 'count_string': '점'})
    else:
        ratings = views.approval_rating_list(None, True)
        return render_to_response('rating.html', {'real_ratings': ratings, 'count_string': '%'})


@csrf_exempt
def pledge(request):
    if request.method == 'GET':
        pledge_type = request.GET.get('type', None)
        if pledge_type == 'rank':
            results = views.pledge_rank_list()
            return render_to_response('pledge_rank_modal.html', {'pledge_rank_list': results})
    else:
        results = views.pledge_post(request)
        return render_to_response('pledge_result.html', {'results': results})


@csrf_exempt
def total_chemistry(request):
    if request.method == 'POST':
        results = views.total_chemistry(request)
        return render_to_response('total_modal.html', {'results': results})


@csrf_exempt
def constellation_chemistry(request):
    if request.method == 'POST':
        results = views.constellation_post(request)
        return render_to_response('constellation_modal.html', {'constellation_result': results})


@csrf_exempt
def blood_chemistry(request):
    if request.method == 'POST':
        results = views.blood_type_chemistry(request)
        return render_to_response('blood_modal.html', {'results': results})


@csrf_exempt
def zodiac_chemistry(request):
    if request.method == 'POST':
        results = views.zodiac_chemistry(request)
        return render_to_response('zodiac_modal.html', {'results': results})


@csrf_exempt
def slot(request):
    if request.method == 'POST':
        result = views.save_lucky_result(request)
        return render_to_response('slot_modal.html', {'result': result})


@csrf_exempt
def luckyname(request):
    result = views.lucky_name(request)
    return render_to_response('lucky_name_modal.html', result)


@cache_page(60 * 10)
@csrf_exempt
def keyword(request):
    result = views.get_issue_keyword_list(request.GET.get('date', None))
    if len(result) > 0:
        return render_to_response('keyword.html', {'results': result[0]['items']})
    else:
        return render_to_response('keyword.html', {'results': []})


@cache_page(60 * 10)
@csrf_exempt
def news(request):
    if request.method == 'POST':
        news_list = views.get_news_list(request)
        return render_to_response('keyword_modal.html', {'results': news_list})


def slot_honor(request):
    if request.method == 'GET':
        results = views.slot_honor_list()
        return render_to_response('slot_honor_modal.html', {'results': results})


def solar(request):
    ratings = views.lucky_rating_list('all')
    solar = ['mercury', 'venus', 'earth', 'mars', 'jupiter']
    result = []
    image = None

    count = 0

    for item in ratings:
        if item['candidate'] == '문재인':
            image = "content:url('"+settings.STATIC_URL+"img/candidate/moon.jpg');"
        elif item['candidate'] == '안철수':
            image = "content:url('"+settings.STATIC_URL+"img/candidate/ahn1.jpg');"
        elif item['candidate'] == '홍준표':
            image = "content:url('"+settings.STATIC_URL+"img/candidate/hong.jpg');"
        elif item['candidate'] == '유승민':
            image = "content:url('"+settings.STATIC_URL+"img/candidate/you.jpg');"
        elif item['candidate'] == '심상정':
            image = "content:url('"+settings.STATIC_URL+"img/candidate/sim.jpg');"

        result.append({'id': solar[count], 'image': image, 'name': item['candidate']})
        count += 1

    print(result)
    return render_to_response('solar.html', {'ratings': result})
