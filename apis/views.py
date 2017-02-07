from apis.models import Scraps
from django.http import HttpResponse
from django.db.models import Count
from django.db.models import Q, Case, When
from urllib import parse, request
from django.core.serializers.json import DjangoJSONEncoder
import json
import os
import pylibmc
# from pytrends.request import TrendReq


# pytrend = TrendReq('donggeun.kim@questcompany.io', 'ejdrmsdl1', custom_useragent='daesun pytrends')


def get_memcache_client():
    # Environment variables are defined in app.yaml.
    # Note: USE_GAE_MEMCACHE is in whitelist-only alpha. See README.md
    if os.environ.get('USE_GAE_MEMCACHE'):
        memcache_server = ':'.join([
            os.environ.get('GAE_MEMCACHE_HOST', 'localhost'),
            os.environ.get('GAE_MEMCACHE_PORT', '11211')])
    else:
        memcache_server = os.environ.get('MEMCACHE_SERVER', 'localhost:11211')

    memcache_client = pylibmc.Client([memcache_server], binary=True)

    return memcache_client


def index(req):
    scraps = Scraps.objects.all().values('title', 'cp', 'created_at').order_by('-created_at')
    return HttpResponse(json.dumps(list(scraps), cls=DjangoJSONEncoder), content_type='application/json; charset=utf-8')


def cp_group(req):
    cache_key = 'cp_group_result'
    client = get_memcache_client()
    result = client.get(cache_key)

    if result is None:
        group_list = Scraps.objects.filter(
            Q(title__contains='문재인') | Q(title__contains='안철수') | Q(title__contains='이재명') |
            Q(title__contains='유승민') | Q(title__contains='안희정') | Q(title__contains='황교안') |
            Q(title__contains='남경필')
        ).values('cp').annotate(
            moon=Count(Case(When(title__contains='문재인', then=1))),
            ahn=Count(Case(When(title__contains='안철수', then=1))),
            lee=Count(Case(When(title__contains='이재명', then=1))),
            you=Count(Case(When(title__contains='유승민', then=1))),
            hee=Count(Case(When(title__contains='안희정', then=1))),
            hwang=Count(Case(When(title__contains='황교안', then=1))),
            nam=Count(Case(When(title__contains='남경필', then=1)))
        )

        print(group_list.query)
        result = json.dumps(list(group_list))
        client.add(key=cache_key, val=result, time=600)
        print('memcache not hit')

    return HttpResponse(result, content_type='application/json; charset=utf-8')


def cp_daily(req):
    cache_key = 'cp_daily_result'
    client = get_memcache_client()
    result = client.get(cache_key)

    if result is None:
        daily_list = Scraps.objects.filter(
            Q(title__contains='문재인') | Q(title__contains='안철수') | Q(title__contains='이재명') |
            Q(title__contains='유승민') | Q(title__contains='안희정') | Q(title__contains='황교안')
        ).extra({'date': 'date(created_at)'}).values('date').annotate(
            moon=Count(Case(When(title__contains='문재인', then=1))),
            ahn=Count(Case(When(title__contains='안철수', then=1))),
            lee=Count(Case(When(title__contains='이재명', then=1))),
            you=Count(Case(When(title__contains='유승민', then=1))),
            hee=Count(Case(When(title__contains='안희정', then=1))),
            hwang=Count(Case(When(title__contains='황교안', then=1)))
        )

        result = json.dumps(list(daily_list), cls=DjangoJSONEncoder)
        client.add(key=cache_key, val=result, time=600)

    return HttpResponse(result, content_type='application/json; charset=utf-8')


def shop(req):
    client_id = "cC0cf4zyUuLFmj_kKUum"
    client_secret = "EYop6SBs44"
    # 추후 parameter 로 변경
    enc_text = parse.quote("문재인")
    # json 결과
    url = "https://openapi.naver.com/v1/search/book.json?query=" + enc_text

    send_request = request.Request(url)
    send_request.add_header("X-Naver-Client-Id", client_id)
    send_request.add_header("X-Naver-Client-Secret", client_secret)
    response = request.urlopen(send_request)
    code = response.getcode()

    if code == 200:
        response_body = response.read()
        print(response_body.decode('utf-8'))
        return HttpResponse(response_body, content_type='application/json; charset=utf-8')

    else:
        print("Error Code:" + code)
        return HttpResponse(status=code)


def pledge(req):
    if req.method == 'GET':
        pass
    else:
        pass


# def trend(req):
#     pytrend.build_payload(kw_list=['문재인', '안희정', '이재명', '유승민', '황교안'], timeframe='today 1-m')
#
#     # Interest Over Time
#     interest_over_time_df = pytrend.interest_over_time()
#     print(interest_over_time_df)
#
#     return HttpResponse(status=200)
