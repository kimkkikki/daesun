from django.shortcuts import render


def index(request):
    return render(request, template_name='index.html')


def graphs(request):
    return render(request, template_name='graphs.html')


def love_test(request):
    return render(request, template_name='lovetest.html')
