from apis.models import Scraps
from django.http import HttpResponse
import json


def index(request):
    scraps = Scraps.objects.all().values('title', 'cp')
    return HttpResponse(json.dumps(list(scraps)), content_type='application/json; charset=utf-8')

