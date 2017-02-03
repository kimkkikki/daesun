from apis.models import Scraps
from django.http import HttpResponse
from django.db.models import Count
from django.db.models import Q, Case, When
import json, os

if os.getenv('GAE_INSTANCE'):
    from google.appengine.api import memcache

def index(request):
    scraps = Scraps.objects.all().values('title', 'cp')
    return HttpResponse(json.dumps(list(scraps)), content_type='application/json; charset=utf-8')


def group(request):
    if os.getenv('GAE_INSTANCE'):
        result = memcache.get('group_db_result')

        if result:
            return HttpResponse(result, content_type='application/json; charset=utf-8')

    group_list = Scraps.objects.filter(
        Q(title__contains='문재인') | Q(title__contains='안철수') | Q(title__contains='이재명') |
        Q(title__contains='유승민') | Q(title__contains='안희정')
    ).values('cp').annotate(
        moon=Count(Case(When(title__contains='문재인', then=1))),
        ahn=Count(Case(When(title__contains='안철수', then=1))),
        lee=Count(Case(When(title__contains='이재명', then=1))),
        you=Count(Case(When(title__contains='유승민', then=1))),
        hee=Count(Case(When(title__contains='안희정', then=1)))
    )

    print(group_list.query)

    result = json.dumps(list(group_list))

    if os.getenv('GAE_INSTANCE'):
        memcache.add(key='group_db_result', value=result, time=3600)

    return HttpResponse(json.dumps(list(group_list)), content_type='application/json; charset=utf-8')
