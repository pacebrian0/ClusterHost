# Create your views here.
from django.http import HttpResponseRedirect
from django.shortcuts import render

from .models import User


def index(request):
    if request.POST:
        print(request.POST)
        if 'buttn' in request.POST:
            User.objects.create(
                string="",
                agerange=request.POST.get('age')

            )
            return HttpResponseRedirect('clustering')

    return render(request, 'Cluster/index.html')


def clustering(request):
    return render(request, 'Cluster/no-k-means-page.html')
