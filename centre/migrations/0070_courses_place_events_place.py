# Generated by Django 4.0.3 on 2022-07-27 03:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0069_alter_studentscerts_unique_together'),
    ]

    operations = [
        migrations.AddField(
            model_name='courses',
            name='place',
            field=models.CharField(default='ГАУ ИО ЦОПМКиМКО', max_length=500, verbose_name='Место проведения'),
        ),
        migrations.AddField(
            model_name='events',
            name='place',
            field=models.CharField(default='ГАУ ИО ЦОПМКиМКО', max_length=500, verbose_name='Место проведения'),
        ),
    ]
