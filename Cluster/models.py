from django.db import models


# TODO: ADD ENTRIES FROM QUESTIONNAIRE


class User(models.Model):
    number = models.AutoField("User Identifier", primary_key=True)
    string = models.CharField("String", max_length=200, default="")
    agerange = models.PositiveSmallIntegerField("Age Range", default=0)

    def __str__(self):
        return self.string


class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.CharField("URL", max_length=200, default="", blank=True)
    designnumber = models.PositiveSmallIntegerField("Design", default=0, blank=True)
    clusters = models.FilePathField("Clusters", blank=True)

    def __str__(self):
        return self.user


class Stats(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestartd1 = models.DateTimeField("Start time design 1", blank=True)
    timeendd1 = models.DateTimeField("End time design 1", blank=True)
    timedeltad1 = models.DateTimeField("Delta time design 1", blank=True)
    timestartd2 = models.DateTimeField("Start time design 2", blank=True)
    timeendd2 = models.DateTimeField("End time design 2", blank=True)
    timedeltad2 = models.DateTimeField("Delta time design 2", blank=True)
    timestartd3 = models.DateTimeField("Start time design 3", blank=True)
    timeendd3 = models.DateTimeField("End time design 3", blank=True)
    timedeltad3 = models.DateTimeField("Delta time design 3", blank=True)

    def __str__(self):
        return self.user
