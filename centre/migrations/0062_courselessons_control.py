# Generated by Django 4.0.3 on 2022-07-20 01:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0061_courselessons_distance_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='courselessons',
            name='control',
            field=models.BooleanField(default=False, verbose_name='Контрольное занятие'),
        ),
    ]
