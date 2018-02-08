# Register your models here.
from django.contrib import admin

from .models import *


class userAdmin(admin.ModelAdmin):
    fieldsets = [
        ("ID", {'fields': ['number']}),
        ("String", {'fields': ['string']}),
        ("Age Range", {'fields': ['agerange']}),
    ]

    list_display = ('number', 'string', 'agerange')
    list_filter = ['agerange', ]
    search_fields = ['number', 'agerange']


class historyAdmin(admin.ModelAdmin):
    fieldsets = [
        ("User", {'fields': ['user']}),
        ("Design Number", {'fields': ['designnumber']}),
        ("URL", {'fields': ['url']}),
        ("Clusters", {'fields': ['clusters']}),
    ]
    list_display = ('user', 'designnumber', 'url', 'clusters',)
    list_filter = ['designnumber', 'user']
    search_fields = ['user', 'designnumber', 'url']


class statsAdmin(admin.ModelAdmin):
    fieldsets = [
        ("User", {'fields': ['user']}),
        ("Time Start Design 1", {'fields': ['timestartd1']}),
        ("Time End Design 1", {'fields': ['timeendd1']}),
        ("Time Delta Design 1", {'fields': ['timedeltad1']}),
        ("Time Start Design 2", {'fields': ['timestartd2']}),
        ("Time End Design 2", {'fields': ['timeendd2']}),
        ("Time Delta Design 2", {'fields': ['timedeltad2']}),
        ("Time Start Design 3", {'fields': ['timestartd3']}),
        ("Time End Design 3", {'fields': ['timeendd3']}),
        ("Time Delta Design 3", {'fields': ['timedelta3']}),

    ]
    list_display = ('user', 'timedeltad1', 'timedeltad2', 'timedeltad3')
    list_filter = ['user']
    search_fields = ['user', 'timestartd1', 'timeendd1', 'timedeltad1', 'timestartd2', 'timeendd2', 'timedeltad2',
                     'timestartd3', 'timeendd3', 'timedeltad3']


admin.site.register(User, userAdmin)
admin.site.register(History, historyAdmin)
admin.site.register(Stats, statsAdmin)
