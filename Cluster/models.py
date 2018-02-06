from django.db import models


class User(models.Model):
    number = models.PositiveSmallIntegerField(max_length=200, default="")
    string = models.CharField(max_length=200, default="")

    def __str__(self):
        return self.string


class History(models.Model):
    name = models.ForeignKey(User, on_delete=models.CASCADE)
    historyurl = models.CharField(max_length=200, default="")

    def __str__(self):
        return self.name
