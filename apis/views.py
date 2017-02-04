from apis.models import Scraps
from django.http import HttpResponse
from django.db.models import Count
from django.db.models import Q, Case, When
import json, os, pylibmc


def get_memcache_client():
    # Environment variables are defined in app.yaml.
    # Note: USE_GAE_MEMCACHE is in whitelist-only alpha. See README.md
    if os.environ.get('USE_GAE_MEMCACHE'):
        memcache_server = ':'.join([
            os.environ.get('GAE_MEMCACHE_HOST', 'localhost'),
            os.environ.get('GAE_MEMCACHE_PORT', '11211')])
    else:
        memcache_server = os.environ.get('MEMCACHE_SERVER', 'localhost:11211')

    memcache_username = os.environ.get('MEMCACHE_USERNAME')
    memcache_password = os.environ.get('MEMCACHE_PASSWORD')

    memcache_client = pylibmc.Client(
        [memcache_server], binary=True,
        username=memcache_username, password=memcache_password)

    return memcache_client


def index(request):
    scraps = Scraps.objects.all().values('title', 'cp')
    return HttpResponse(json.dumps(list(scraps)), content_type='application/json; charset=utf-8')


def group(request):
    client = get_memcache_client()
    result = client.get('group_db_result')

    if result:
        print('memcache hit')
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

    client.add(key='group_db_result', val=result, time=3600)

    print('memcache not hit')
    return HttpResponse(json.dumps(list(group_list)), content_type='application/json; charset=utf-8')
