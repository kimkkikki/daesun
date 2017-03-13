from apis.models import Scraps, Keywords, Pledge, ApprovalRating, LoveOrHate, IssueKeyword, CheeringMessage, LuckyRating
from django.http import HttpResponse
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from django.db.models import Count
from django.db.models import Q, Case, When, Sum, F, Avg
from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import caches
from django.views.decorators.cache import cache_page
import json
import uuid
from .util import hangle, constellation
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
from operator import itemgetter
import requests
import twitter
import pytz
import re


candidates = ['문재인', '안희정', '이재명', '유승민', '황교안', '안철수']
candidate_twitters = ['Jaemyung_Lee', 'steelroot', 'cheolsoo0919', 'moonriver365']


class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


def save_lucky_rating(candidate, type):
    lucky_rating = LuckyRating(candidate=candidate, type=type)
    lucky_rating.save()


@cache_page(60 * 1)
def index(req):
    scraps = Scraps.objects.all().values('title', 'cp', 'created_at').order_by('-created_at')[0:100]
    return JSONResponse(list(scraps))


@cache_page(60 * 10)
def cp_group(request):
    start_date = request.GET.get('start_date', None)
    end_date = request.GET.get('end_date', None)

    if start_date is not None and end_date is not None:
        start = datetime.strptime(start_date, '%Y%m%d')
        end = datetime.strptime(end_date, '%Y%m%d') + timedelta(days=1)
        candidate_q_list = Q(created_at__range=[start, end]) & \
                            (Q(title__contains='문재인') | Q(title__contains='안철수') | Q(title__contains='이재명') |
                             Q(title__contains='유승민') | Q(title__contains='안희정') | Q(title__contains='황교안') |
                             Q(title__contains='남경필'))
    else:
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
    results = []

    for candidate in candidates:
        url = "https://openapi.naver.com/v1/search/book_adv.json?d_titl=" + candidate + "&d_auth=" + candidate + "&sort=date&d_dafr=20150101&d_dato=20171231"

        response = requests.get(url, headers={'X-Naver-Client-Id': 'cC0cf4zyUuLFmj_kKUum',
                                              'X-Naver-Client-Secret': 'EYop6SBs44'})
        result = response.json()

        if 'items' in result:
            for obj in result['items']:
                obj['image'] = obj['image'].replace('type=m1&', 'type=m5&')
                obj['title'] = obj['title'].split('(')[0]
                results.append(obj)

    results = sorted(results, key=itemgetter('pubdate'), reverse=True)
    return results


@cache_page(60 * 10)
def shop(req):
    return JSONResponse(get_shop())


def pledge_rank_list():
    pledges = Pledge.objects.annotate(score=Sum(F('like') - F('unlike'))).order_by('-score')[0:10]
    return list(pledges.values())


@cache_page(60 * 10)
def pledge_rank_api(req):
    return JSONResponse(pledge_rank_list())


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
                Pledge.objects.filter(id=candidate_list[i].get('id')).update(unlike=F('unlike') + 1,
                                                                             updated=datetime.now())
                candidate_dict[candidate_list[i].get('candidate')] -= 1

        result_list = [{'candidate': '문재인', 'count': candidate_dict['문재인']},
                       {'candidate': '안철수', 'count': candidate_dict['안철수']},
                       {'candidate': '이재명', 'count': candidate_dict['이재명']},
                       {'candidate': '유승민', 'count': candidate_dict['유승민']},
                       {'candidate': '안희정', 'count': candidate_dict['안희정']},
                       {'candidate': '황교안', 'count': candidate_dict['황교안']},
                       {'candidate': '남경필', 'count': candidate_dict['남경필']}, ]
        result_list = sorted(result_list, key=itemgetter('count'), reverse=True)

        return JSONResponse(result_list)


def approval_rating_list(cp, is_last):
    if is_last:
        last = ApprovalRating.objects.latest('date').date
        approval_ratings = ApprovalRating.objects.filter(date=last).values('candidate', 'date')\
            .annotate(rating=Avg(F('rating'))).order_by('-rating')
    else:
        if cp is None:
            approval_ratings = ApprovalRating.objects.filter(type=1) \
                .values('candidate', 'date').annotate(rating=Avg(F('rating'))).order_by('date')
        else:
            approval_ratings = ApprovalRating.objects.filter(type=1, cp=cp) \
                .values('candidate', 'date').annotate(rating=Avg(F('rating'))).order_by('date')
    return list(approval_ratings)


@cache_page(60 * 10)
def approval_rating(request):
    return JSONResponse(approval_rating_list(request.GET.get('cp', None), False))


@csrf_exempt
def name_chemistry(request):
    if request.method == 'GET':
        name = request.GET.get('name', None)
    else:
        body = JSONParser().parse(request)
        name = body.get('name', None)

    if name is None:
        return JSONResponse({'message': 'param is missing'}, status=400)

    result_list = []
    for candidate in candidates:
        score_to = hangle.name_chemistry(name, candidate)
        score_from = hangle.name_chemistry(candidate, name)
        result_list.append({'candidate': candidate, 'score_to': score_to, 'score_from': score_from, 'score': score_to + score_from})

    if len(result_list) > 0:
        result_list = sorted(result_list, key=itemgetter('score'), reverse=True)
        save_lucky_rating(result_list[0]['candidate'], 'name')

    return JSONResponse({'list': result_list})


@api_view(['GET'])
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
                scraps = [{'title': scraps['title'], 'link': scraps['link'], 'cp': scraps['cp'],
                           'created_at': scraps['created_at'].strftime('%Y-%m-%d %H:%M:%S')} for scraps in
                          Scraps.objects.values('title', 'link', 'cp', 'created_at').order_by('-created_at').
                          filter(title__contains=ck['candidate']).filter(title__contains=ck['keyword'])[:5]]
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
def love_test(req):
    candidate_dict = {'문재인': 1, '안희정': 2, '이재명': 3, '안철수': 4, '유승민': 5, '황교안': 6, '남경필': 7}
    result_list = []
    result_db_list = LoveOrHate.objects.values('speaker', 'target').annotate(s_cnt=Count('speaker'),
                                                                             t_cnt=Count('target'))
    speaker, target, count, arrows = result_db_list[0]['speaker'], result_db_list[0]['target'], result_db_list[0][
        't_cnt'], 'to'
    for result in result_db_list:
        if speaker != result['speaker']:
            result_list.append({'from': candidate_dict[speaker], 'to': candidate_dict[target],
                                'arrows': arrows})
            speaker, target, count = result['speaker'], result['target'], result['t_cnt']

        if count < result['t_cnt']:
            count, target = result['t_cnt'], result['target']
            if count > 20:
                arrows = {'to': {'scaleFactor': '2'}}
    print(list(result_list))
    return JSONResponse(list(result_list))


def get_candidate_sns_list():
    api = twitter.Api(access_token_key='833848464979079168-qhskxnXzEstVFlOtD6RDyA47OJetk4H',
                      access_token_secret='rJQaE6OrI6pFjcpXC7Aheq9ebslHyRVlVuLmt5FRWvVYv',
                      consumer_key='MHJ7LJmm1nGHLlNrN7lntMSB8',
                      consumer_secret='lxpIYyImUVVyIQfDyrEPi5HIh71CZLrnNBF2uRPfuNrmVUqICM')

    schedules = []
    candidate_dict = {'문재인': '#337ab7', '안희정': '#337ab7', '이재명': '#337ab7',
                      '안철수': '#669966', '유승민': '#4ca0e6', '황교안': '#c9151e', '남경필': '#c9151e'}

    for screen_name in candidate_twitters:
        statuses = api.GetUserTimeline(screen_name=screen_name)

        for status in statuses:
            created = datetime.strptime(status.created_at, '%a %b %d %H:%M:%S %z %Y').astimezone(pytz.timezone('Asia/Seoul'))
            contents_split = status.text.split('https')
            contents = ''
            for string in contents_split:
                contents += string.replace('&lt;', '').replace('&gt;', '')

            if '일정' in contents:
                contents += '\n'

                date_format_1 = re.compile('\d+[.]\d+')  # 00.00
                date_format_2 = re.compile('\d+월\s*\d+일')  # 00월 00일
                hour_format_1 = re.compile('(\d+:\d+)\s*(.+?)\n')  # 00:00
                hour_format_2 = re.compile('\n(\D+?)\s*(\d+시\s?\d*분?)\s?(.+?)\n')  # (오전) 00시 00분

                month, day, hour, minute = created.month, created.day, 00, 00
                if contents.find('내일') > 0:
                    date = created + timedelta(days=1)
                    month, day = date.month, date.day
                elif date_format_1.search(contents) is not None:
                    date = date_format_1.search(contents).group().split('.')
                    month, day = int(date[0]), int(date[1])
                elif date_format_2.search(contents) is not None:
                    date = date_format_2.search(contents).group().split('월')
                    month, day = int(date[0]), int(date[1].replace('일', '').strip())

                if hour_format_1.findall(contents) is not None:
                    for time in hour_format_1.finditer(contents):
                        schedule_time = time.group(1).split(':')
                        hour, minute = int(schedule_time[0]), int(schedule_time[1])
                        title = time.group(time.lastindex)
                        if status.user.name == '문재인':
                            title = re.compile('일정]\s(.+?)\n').search(contents).group(1)

                        if title.find('…') > 0:
                            continue
                        schedules.append({'start': datetime(2017, month, day, hour, minute).strftime('%Y-%m-%d %H:%M'),
                                          'title': status.user.name + ', ' + title, 'color': candidate_dict[status.user.name]})

                if hour_format_2.findall(contents) is not None:
                    for time in hour_format_2.finditer(contents):
                        schedule_time = time.group(time.lastindex-1).split('시')
                        hour = int(schedule_time[0])
                        if time.group(time.lastindex-1).find('분') > 0:
                            minute = int(schedule_time[1].replace('분', ''))

                        if time.lastindex == 3:
                            if any(word in time.group(time.lastindex-2) for word in ['오후', '저녁', '밤']):
                                hour += 12

                        title = time.group(time.lastindex).replace('에는', '')
                        if title.find('…') > 0:
                            continue
                        schedules.append({'start': datetime(2017, month, day, hour, minute).strftime('%Y-%m-%d %H:%M'),
                                          'title': status.user.name + ', ' + title, 'color': candidate_dict[status.user.name]})

                continue

    schedules = sorted(schedules, key=lambda k: k['start'])
    return schedules


@cache_page(60 * 10)
def get_candidate_sns_api(request):
    return JSONResponse(get_candidate_sns_list())


def get_issue_keyword_list():
    issue_keywords = IssueKeyword.objects.all().order_by('-date')

    results = []
    temps = []
    temp_date = None
    for idx, issue in enumerate(issue_keywords):
        if idx == 0:
            temp_date = issue.date

        keywords = eval(issue.keywords)
        if len(keywords) != 0:
            issue_dict = {'candidate': issue.candidate, 'keywords': keywords}

            if temp_date == issue.date:
                temps.append(issue_dict)
            else:
                temps = sorted(temps, key=itemgetter('candidate'))
                results.append({'items': temps, 'date': temp_date})
                temp_date = issue.date
                temps = []

    if len(temps) != 0:
        temps = sorted(temps, key=itemgetter('candidate'))
        results.append({'items': temps, 'date': temp_date})

    return results


def get_issue_keyword_api(request):
    return JSONResponse(get_issue_keyword_list())


def get_cheering_message_list(page):
    messages = CheeringMessage.objects.all().values('candidate', 'message', 'ip', 'created').order_by('-created')[page * 10:page * 10 + 10]
    return list(messages)


def create_cheering_message(request):
    body = JSONParser().parse(request)
    candidate = body.get('candidate', None)
    message = body.get('message', None)
    ip = body.get('ip', None)

    if candidate is not None and message is not None and ip is not None:
        new_message = CheeringMessage(candidate=candidate, message=message, ip=ip)
        new_message.save()
        return True

    return False


@csrf_exempt
def cheering_message_api(request):
    if request.method == 'GET':
        page = request.GET.get('page', None)
        if page is None:
            page = 0
        return JSONResponse(get_cheering_message_list(page=page))

    elif request.method == 'POST':
        if create_cheering_message(request):
            return JSONResponse({'message': 'success'})
        else:
            return JSONResponse({'message': 'failure'})


@csrf_exempt
def constellation_api(request):
    if request.method == 'POST':
        body = JSONParser().parse(request)
        month = body.get('month', None)
        day = body.get('day', None)

        request_constellation = constellation.get_constellation((month, day))
        result = constellation.constellation_chemistry(request_constellation)
        result = sorted(result, key=itemgetter('score'), reverse=True)
        save_lucky_rating(result[0]['candidate'], 'star')

        return JSONResponse(result)
