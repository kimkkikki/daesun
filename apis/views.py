from apis.models import Scraps, Keywords, Pledge, ApprovalRating, LoveOrHate
from django.http import HttpResponse
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from django.db.models import Count
from django.db.models import Q, Case, When, Sum, F, Avg
from urllib import parse, request
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import caches
from django.views.decorators.cache import cache_page
import json
import uuid
from .util import hangle
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from operator import itemgetter


class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


def google_app_engine_health_check(req):
    return HttpResponse(status=200)


@cache_page(60 * 1)
def index(req):
    scraps = Scraps.objects.all().values('title', 'cp', 'created_at').order_by('-created_at')[0:100]
    return JSONResponse(list(scraps))


@cache_page(60 * 10)
def cp_group(req):
    candidate_q_list = (Q(title__contains='문재인') | Q(title__contains='안철수') | Q(title__contains='이재명') |
                        Q(title__contains='유승민') | Q(title__contains='안희정') | Q(title__contains='황교안') |
                        Q(title__contains='남경필'))

    group_list = Scraps.objects.filter(candidate_q_list).values('cp').annotate(
        moon=Count(Case(When(title__contains='문재인', then=1))),
        ahn=Count(Case(When(title__contains='안철수', then=1))),
        lee=Count(Case(When(title__contains='이재명', then=1))),
        you=Count(Case(When(title__contains='유승민', then=1))),
        hee=Count(Case(When(title__contains='안희정', then=1))),
        hwang=Count(Case(When(title__contains='황교안', then=1))),
        nam=Count(Case(When(title__contains='남경필', then=1)))
    )

    return JSONResponse(list(group_list))


@cache_page(60 * 10)
def cp_daily(req):
    candidate_q_list = (Q(title__contains='문재인') | Q(title__contains='안철수') | Q(title__contains='이재명') |
                        Q(title__contains='유승민') | Q(title__contains='안희정') | Q(title__contains='황교안') |
                        Q(title__contains='남경필'))

    daily_list = Scraps.objects.filter(candidate_q_list).extra({'date': 'date(created_at)'}).values(
        'date').annotate(
        moon=Count(Case(When(title__contains='문재인', then=1))),
        ahn=Count(Case(When(title__contains='안철수', then=1))),
        lee=Count(Case(When(title__contains='이재명', then=1))),
        you=Count(Case(When(title__contains='유승민', then=1))),
        hee=Count(Case(When(title__contains='안희정', then=1))),
        hwang=Count(Case(When(title__contains='황교안', then=1))),
        nam=Count(Case(When(title__contains='남경필', then=1)))
    )

    return JSONResponse(list(daily_list))


def get_shop():
    client_id = "cC0cf4zyUuLFmj_kKUum"
    client_secret = "EYop6SBs44"

    candidates = ['문재인', '안희정', '이재명', '유승민', '황교안', '안철수']
    results = []

    for candidate in candidates:
        url = "https://openapi.naver.com/v1/search/book_adv.json?d_titl=" + parse.quote(candidate) + "&d_auth=" + parse.quote(
            candidate) + "&sort=date&d_dafr=20150101&d_dato=20171231"

        send_request = request.Request(url)
        send_request.add_header("X-Naver-Client-Id", client_id)
        send_request.add_header("X-Naver-Client-Secret", client_secret)
        response = request.urlopen(send_request)
        code = response.getcode()

        if code == 200:
            try:
                response_body = response.read()
                result = json.loads(response_body)

                for obj in result['items']:
                    obj['image'] = obj['image'].replace('type=m1&', '')
                    results.append(obj)
            except:
                print('response read error')

    results = sorted(results, key=itemgetter('pubdate'), reverse=True)
    return results


@cache_page(60 * 10)
def shop(req):
    return JSONResponse(get_shop())


@cache_page(60 * 10)
def pledge_rank(req):
    pledges = Pledge.objects.annotate(score=Sum(F('like') - F('unlike'))).order_by('-score')[0:10]
    return JSONResponse(list(pledges.values()))


@csrf_exempt
def pledge(req):
    cache = caches['default']

    if req.method == 'GET':
        pledge_obj = Pledge.objects.all().order_by('updated')[0:10]
        pledges = list(pledge_obj.values())
        print(pledges)

        # 10개 공약 순서대로 누군지 저장해야함
        evaluate_token = str(uuid.uuid4())
        cache_key = 'pledge_evaluate|' + evaluate_token

        data = {"token": evaluate_token, "list": pledges}
        cache.set(cache_key, json.dumps(data, cls=DjangoJSONEncoder), timeout=600)

        return JSONResponse(data)

    elif req.method == 'POST':
        body = JSONParser().parse(req)
        token = body.get('token', None)
        result_list = body.get('list', None)
        cache_key = 'pledge_evaluate|' + token
        cache_data = cache.get(cache_key)
        cache.delete(cache_key)

        print(cache_data)

        if cache_data is None:
            # Expire
            return JSONResponse({'message': '10분 이내에 입력해야 합니다'}, status=400)

        cache_data = json.loads(cache_data)
        candidate_list = cache_data['list']
        candidate_dict = {'문재인': 0, '안철수': 0, '이재명': 0, '유승민': 0, '안희정': 0, '황교안': 0, '남경필': 0}

        for i, result in enumerate(result_list):
            if result == 1 or result == '1':
                Pledge.objects.filter(id=candidate_list[i].get('id')).update(like=F('like') + 1, updated=datetime.now())
                candidate_dict[candidate_list[i].get('candidate')] += 1
            elif result == -1 or result == '-1':
                Pledge.objects.filter(id=candidate_list[i].get('id')).update(unlike=F('unlike') + 1, updated=datetime.now())
                candidate_dict[candidate_list[i].get('candidate')] -= 1

        result_list = [{'candidate': '문재인', 'count': candidate_dict['문재인']},
                       {'candidate': '안철수', 'count': candidate_dict['안철수']},
                       {'candidate': '이재명', 'count': candidate_dict['이재명']},
                       {'candidate': '유승민', 'count': candidate_dict['유승민']},
                       {'candidate': '안희정', 'count': candidate_dict['안희정']},
                       {'candidate': '황교안', 'count': candidate_dict['황교안']},
                       {'candidate': '남경필', 'count': candidate_dict['남경필']},]
        result_list = sorted(result_list, key=itemgetter('count'), reverse=True)

        return JSONResponse(result_list)


@cache_page(60 * 10)
def approval_rating(req):
    cp = req.GET.get('cp', None)
    if cp is None:
        approval_ratings = ApprovalRating.objects.filter(type=1).extra({'date': 'date(date)'})\
        .values('candidate', 'date').annotate(rating=Avg(F('rating'))).order_by('-date')
    else:
        approval_ratings = ApprovalRating.objects.filter(type=1, cp=cp).extra({'date': 'date(date)'}) \
            .values('candidate', 'date').annotate(rating=Avg(F('rating'))).order_by('-date')

    return JSONResponse(list(approval_ratings))


@cache_page(60 * 1)
def name_chemistry(req):
    name = req.GET.get('name', None)

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
@cache_page(60 * 30)
def timeline(req):
    param = int(req.GET.get('param', 1))

    start_date = datetime.now() - timedelta(hours=param * 3)
    end_date = start_date + timedelta(hours=3)

    date_group_list = Keywords.objects.values('created_at').annotate(count=Count('created_at')).filter(
        created_at__gte=start_date).filter(created_at__lte=end_date).order_by('-created_at')
    result_list = []
    for data_group in date_group_list:
        result_inner = {}
        candidate_list = Keywords.objects.values('candidate').annotate(count=Count('candidate')).filter(
            created_at__contains=data_group['created_at'])
        result_data_list = []

        for c in candidate_list:
            inner = {}
            keyword_list = []
            candidate_keyword_list = Keywords.objects.values('candidate', 'keyword', 'count').filter(
                candidate__contains=c['candidate']).filter(created_at__contains=data_group['created_at'])
            for ck in candidate_keyword_list:
                inner_keyword = {'keyword': ck['keyword'], 'count': ck['count']}
                scraps = [scraps for scraps in
                          Scraps.objects.values('title', 'link', 'cp', 'created_at').order_by('-created_at').filter(
                              title__contains=ck['candidate']).filter(title__contains=ck['keyword'])[:5]]
                inner_keyword['news'] = scraps
                keyword_list.append(inner_keyword)

            inner['candidate'] = c['candidate']
            inner['keywords'] = keyword_list
            result_data_list.append(inner)

        result_inner['created_at'] = data_group['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        result_inner['data'] = result_data_list
        result_list.append(result_inner)

    return JSONResponse(list(result_list))


@api_view(['GET'])
@cache_page(60 * 60)
def love_test(req):
    cache = caches['default']
    cache.delete('lovetest')

    number = [('문재인', 1), ('안희정', 2), ('이재명', 3), ('안철수', 4), ('유승민', 5), ('황교안', 6)]
    result_list = []
    result_db_list = LoveOrHate.objects.values('speaker', 'target').annotate(s_cnt=Count('speaker'), t_cnt=Count('target'))
    speaker, target, count, arrows = result_db_list[0]['speaker'], result_db_list[0]['target'], result_db_list[0]['t_cnt'], 'to'
    for result in result_db_list:
        if speaker != result['speaker']:
            for n in number:
                if n[0] == speaker:
                    speaker = n[1]
                if n[0] == target:
                    target = n[1]
            result_list.append({'from': speaker, 'to': target, 'arrows': arrows, 'label': '싫어함', 'font': {'align': 'bottom'}})
            speaker, target, count = result['speaker'], result['target'], result['t_cnt']

        if count < result['t_cnt']:
            count, target = result['t_cnt'], result['target']
            if count > 20:
                arrows = {'to': {'scaleFactor': '2'}}

    return JSONResponse(list(result_list))
