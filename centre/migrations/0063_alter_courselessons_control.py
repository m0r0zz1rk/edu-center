# Generated by Django 4.0.3 on 2022-07-20 02:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0062_courselessons_control'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courselessons',
            name='control',
            field=models.CharField(default='', max_length=50, verbose_name='Контрольное занятие'),
        ),
    ]
