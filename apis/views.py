from apis.models import Scraps, Keywords, Pledge
from django.http import HttpResponse
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
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
from rest_framework.decorators import api_view


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


class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


@api_view()
def index(req):
    scraps = Scraps.objects.all().values('title', 'cp', 'created_at').order_by('-created_at')[0:100]
    return JSONResponse(list(scraps))


candidate_q_list = (Q(title__contains='문재인') | Q(title__contains='안철수') | Q(title__contains='이재명') |
            Q(title__contains='유승민') | Q(title__contains='안희정') | Q(title__contains='황교안') |
            Q(title__contains='남경필'))


@api_view()
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

    result = json.loads(result)

    return JSONResponse(result)


@api_view()
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

    result = json.loads(result)

    return JSONResponse(result)


@api_view()
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
        return JSONResponse(response_body)

    else:
        print("Error Code:" + code)
        return HttpResponse(status=code)


@api_view()
def pledge_rank(req):
    cache_key = 'pledge_rank'
    client = get_memcache_client()
    result = client.get(cache_key)

    if result is None:
        pledges = Pledge.objects.annotate(score=Sum(F('like')-F('unlike'))).order_by('-score')[0:10]
        result = json.dumps(list(pledges.values()), cls=DjangoJSONEncoder)
        client.add(key=cache_key, val=result, time=60)

    result = json.loads(result)

    return JSONResponse(result)


@csrf_exempt
@api_view(['GET', 'POST'])
def pledge(req):
    memcache_client = get_memcache_client()

    if req.method == 'GET':
        pledge_obj = Pledge.objects.all().order_by('updated')[0:10]
        pledges = list(pledge_obj.values())
        print(pledges)

        # 10개 공약 순서대로 누군지 저장해야함
        evaluate_token = str(uuid.uuid4())
        cache_key = 'pledge_evaluate|' + evaluate_token

        data = {"token": evaluate_token, "list": pledges}
        memcache_client.add(key=cache_key, val=json.dumps(data, cls=DjangoJSONEncoder), time=600)

        return JSONResponse(data)

    elif req.method == 'POST':
        body = JSONParser().parse(req)
        token = body.get('token', None)
        result_list = body.get('list', None)
        cache_data = memcache_client.get('pledge_evaluate|' + token)
        print(cache_data)

        if cache_data is None:
            # Expire
            return JSONResponse({'message': '10분 이내에 입력해야 합니다'}, status=400)
        else:
            cache_data = json.loads(cache_data)
            candidate_list = cache_data['list']
            candidate_dict = {'문재인': 0, '안철수': 0, '이재명': 0, '유승민': 0, '안희정': 0, '황교안': 0, '남경필': 0}

            for i, result in enumerate(result_list):
                if result == 1:
                    Pledge.objects.filter(id=candidate_list[i].get('id')).update(like=F('like') + 1)
                    candidate_dict[candidate_list[i].get('candidate')] += 1
                elif result == -1:
                    Pledge.objects.filter(id=candidate_list[i].get('id')).update(unlike=F('unlike') + 1)
                    candidate_dict[candidate_list[i].get('candidate')] -= 1

            return JSONResponse(candidate_dict)

    else:
        return JSONResponse({'message': 'not supported request method'}, status=400)


@api_view(['GET'])
def name_chemistry(req):
    if req.method == 'GET':
        name = req.GET.get('name', None)

    else:
        return JSONResponse({'message': 'not supported request method'}, status=400)

    if name is None:
        return JSONResponse({'message': 'param is missing'}, status=400)

    candidates = ['문재인', '이재명', '안철수', '안희정', '황교안', '남경필']
    result_list = []
    for candidate in candidates:
        score_to = hangle.name_chemistry(name, candidate)
        score_from = hangle.name_chemistry(candidate, name)
        result_list.append({'candidate': candidate, 'score_to': score_to, 'score_from': score_from})

    return JSONResponse({'list': result_list})


@api_view(['GET'])
def timeline(req):

    param = int(req.GET.get('param', 1))

    cache_key = 'timeline_result_' + str(param)
    client = get_memcache_client()
    result = client.get(cache_key)

    if result is None:
        start_date = datetime.now() - timedelta(hours=param * 3)
        end_date = start_date + timedelta(hours=3)

        date_group_list = Keywords.objects.values('created_at').annotate(count=Count('created_at')).filter(created_at__gte=start_date).filter(created_at__lte=end_date).order_by('-created_at')
        result_list = []
        for data_group in date_group_list:
            result_inner = {}
            candidate_list = Keywords.objects.values('candidate').annotate(count=Count('candidate')).filter(created_at__contains=data_group['created_at'])
            result_data_list = []

            for c in candidate_list:
                inner = {}
                keyword_list = []
                candidate_keyword_list = Keywords.objects.values('candidate', 'keyword', 'count').filter(candidate__contains=c['candidate']).filter(created_at__contains=data_group['created_at'])
                for ck in candidate_keyword_list:
                    inner_keyword = {}
                    inner_keyword['keyword'] = ck['keyword']
                    inner_keyword['count'] = ck['count']
                    scraps = [scraps for scraps in Scraps.objects.values('title', 'link', 'cp', 'created_at').order_by('-created_at').filter(title__contains=ck['candidate']).filter(title__contains=ck['keyword'])[:5]]
                    inner_keyword['news'] = scraps
                    keyword_list.append(inner_keyword)

                inner['candidate'] = c['candidate']
                inner['keywords'] = keyword_list
                result_data_list.append(inner)

            result_inner['created_at'] = data_group['created_at']
            result_inner['data'] = result_data_list
            result_list.append(result_inner)

        result = json.dumps(list(result_list), cls=DjangoJSONEncoder)
        client.add(key=cache_key, val=result, time=600)
        print('memcache not hit')

    result = json.loads(result)
    return JSONResponse(result)
