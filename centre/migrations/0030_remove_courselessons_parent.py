# Generated by Django 4.0.3 on 2022-06-16 06:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0029_courselessons'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='courselessons',
            name='parent',
        ),
    ]
