# Generated by Django 2.0.2 on 2018-02-08 08:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('Cluster', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='id',
        ),
        migrations.AlterField(
            model_name='user',
            name='number',
            field=models.AutoField(primary_key=True, serialize=False, verbose_name='User Identifier'),
        ),
    ]
