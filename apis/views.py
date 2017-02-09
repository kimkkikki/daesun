from apis.models import Scraps, Keywords, Pledge
from django.http import HttpResponse, JsonResponse
from django.core import serializers
from django.db.models import Count
from django.db.models import Q, Case, When, Sum, F
from urllib import parse, request
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt
import json
import os
import pylibmc
import uuid
from .util import hangle
from datetime import datetime, timedelta


def get_memcache_client():
    # Environment variables are defined in app.yaml.
    # Note: USE_GAE_MEMCACHE is in whitelist-only alpha. See README.md
    if os.environ.get('USE_GAE_MEMCACHE'):
        memcache_server = ':'.join([
            os.environ.get('GAE_MEMCACHE_HOST', 'localhost'),
            os.environ.get('GAE_MEMCACHE_PORT', '11211')])
    else:
        memcache_server = os.environ.get('MEMCACHE_SERVER', '104.199.215.251:11211')

    memcache_client = pylibmc.Client([memcache_server], binary=True)

    return memcache_client


def index(req):
    scraps = Scraps.objects.all().values('title', 'cp', 'created_at').order_by('-created_at')[0:100]
    return HttpResponse(json.dumps(list(scraps), cls=DjangoJSONEncoder), content_type='application/json; charset=utf-8')


candidate_q_list = (Q(title__contains='문재인') | Q(title__contains='안철수') | Q(title__contains='이재명') |
            Q(title__contains='유승민') | Q(title__contains='안희정') | Q(title__contains='황교안') |
            Q(title__contains='남경필'))


def cp_group(req):
    cache_key = 'cp_group_result'
    client = get_memcache_client()
    result = client.get(cache_key)

    if result is None:
        group_list = Scraps.objects.filter(candidate_q_list).values('cp').annotate(
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

    return HttpResponse(result, content_type='application/json', charset='utf8')


def cp_daily(req):
    cache_key = 'cp_daily_result'
    client = get_memcache_client()
    result = client.get(cache_key)

    if result is None:
        daily_list = Scraps.objects.filter(candidate_q_list).extra({'date': 'date(created_at)'}).values('date').annotate(
            moon=Count(Case(When(title__contains='문재인', then=1))),
            ahn=Count(Case(When(title__contains='안철수', then=1))),
            lee=Count(Case(When(title__contains='이재명', then=1))),
            you=Count(Case(When(title__contains='유승민', then=1))),
            hee=Count(Case(When(title__contains='안희정', then=1))),
            hwang=Count(Case(When(title__contains='황교안', then=1)),
            nam=Count(Case(When(title__contains='남경필', then=1))))
        )

        result = json.dumps(list(daily_list), cls=DjangoJSONEncoder)
        client.add(key=cache_key, val=result, time=600)

    return HttpResponse(result, content_type='application/json', charset='utf8')


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
        return HttpResponse(response_body, content_type='application/json', charset='utf-8')

    else:
        print("Error Code:" + code)
        return HttpResponse(status=code)


def pledge_rank(req):
    cache_key = 'pledge_rank'
    client = get_memcache_client()
    result = client.get(cache_key)

    if result is None:
        pledges = Pledge.objects.annotate(score=Sum(F('like')-F('unlike'))).order_by('-score')[0:10]
        result = json.dumps(list(pledges.values()), cls=DjangoJSONEncoder)
        client.add(key=cache_key, val=result, time=60)

    return HttpResponse(result, content_type='application/json', charset='utf-8')


@csrf_exempt
def pledge(req):
    memcache_client = get_memcache_client()

    if req.method == 'GET':
        pledge_obj = Pledge.objects.all().order_by('updated')[0:10]
        pledges = list(pledge_obj.values())
        print(pledges)

        # 10개 공약 순서대로 누군지 저장해야함
        evaluate_token = str(uuid.uuid4())
        cache_key = 'pledge_evaluate|' + evaluate_token

        data = json.dumps({"token": evaluate_token, "list": pledges}, cls=DjangoJSONEncoder)
        memcache_client.add(key=cache_key, val=data, time=600)

        return HttpResponse(data, content_type='application/json', charset='utf-8')

    elif req.method == 'POST':
        body = json.loads(req.body)
        token = body.get('token', None)
        result_list = body.get('list', None)
        cache_data = memcache_client.get('pledge_evaluate|' + token)
        print(cache_data)

        if cache_data is None:
            # Expire
            return HttpResponse(json.dumps({'message': '10분 이내에 입력해야 합니다'}, cls=DjangoJSONEncoder), status=400, content_type='application/json', charset='utf-8')
        else:
            cache_data = json.loads(cache_data)
            candidate_list = cache_data['list']

            for i, result in enumerate(result_list):
                if result == 1:
                    Pledge.objects.filter(id=candidate_list[i].get('id')).update(like=F('like') + 1)
                elif result == -1:
                    Pledge.objects.filter(id=candidate_list[i].get('id')).update(unlike=F('unlike') + 1)

            return HttpResponse(status=200, content_type='application/json', charset='utf-8')

    else:
        return HttpResponse(status=400, content_type='application/json', charset='utf-8')


@csrf_exempt
def name_chemistry(req):
    if req.method == 'GET':
        name1 = req.GET.get('name1', None)
        name2 = req.GET.get('name2', None)

    elif req.method == 'POST':
        body = json.loads(req.body)
        name1 = body.get('name1', None)
        name2 = body.get('name2', None)
    else:
        return HttpResponse(status=400)

    if name1 is None or name2 is None:
        return HttpResponse(status=400)

    if len(name1) == 3 and len(name2) == 3:
        result = hangle.name_chemistry(name1, name2)
    else:
        result = 0

    return HttpResponse(json.dumps({'score': result}), content_type='application/json', charset='utf-8')


def timeline(req):
    cache_key = 'timeline_result'
    client = get_memcache_client()
    result = client.get(cache_key)

    if result is None:
        item_list = Keywords.objects.values('candidate', 'created_at').annotate(keyword_count=Count('candidate'), c_count=Count('created_at')).filter(created_at__gte=datetime.now() - timedelta(hours=3)).order_by('-created_at')
        result_list = []
        for item in item_list:
            inner = {}
            keyword_list = []
            keywords = Keywords.objects.values('keyword', 'count').filter(candidate__contains=item['candidate']).filter(created_at__contains=item['created_at'])
            for k in keywords:
                inner_keyword = {}
                inner_keyword['keyword'] = k['keyword']
                inner_keyword['count'] = k['count']
                scraps = [scraps for scraps in Scraps.objects.values('title', 'link', 'cp', 'created_at').filter(title__contains=item['candidate']).filter(title__contains=k['keyword'])[:5]]
                inner_keyword['news'] = scraps
                keyword_list.append(inner_keyword)

            inner['candidate'] = item['candidate']
            inner['created_at'] = item['created_at']
            inner['keywords'] = keyword_list
            result_list.append(inner)

        result = json.dumps(list(result_list), cls=DjangoJSONEncoder)
        client.add(key=cache_key, val=result, time=600)
        print('memcache not hit')

    return HttpResponse(result, content_type='application/json', charset='utf-8')
