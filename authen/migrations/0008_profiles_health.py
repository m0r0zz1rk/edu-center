# Generated by Django 4.0.3 on 2022-07-14 03:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authen', '0007_profiles_teacher'),
    ]

    operations = [
        migrations.AddField(
            model_name='profiles',
            name='health',
            field=models.BooleanField(default=False, verbose_name='Ограничения по здоровью'),
        ),
    ]
