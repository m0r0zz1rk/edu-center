# Generated by Django 4.0.3 on 2022-05-22 08:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authen', '0003_profiles_phone'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profiles',
            name='phone',
            field=models.CharField(default='', max_length=20, unique=True, verbose_name='Телефон'),
        ),
        migrations.AlterField(
            model_name='profiles',
            name='snils',
            field=models.CharField(default='', max_length=15, unique=True, verbose_name='СНИЛС'),
        ),
    ]
