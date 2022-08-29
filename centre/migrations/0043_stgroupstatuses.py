# Generated by Django 4.0.3 on 2022-06-30 01:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0042_studentgroups_approve_group'),
    ]

    operations = [
        migrations.CreateModel(
            name='StGroupStatuses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True, verbose_name='Статус учебной группы')),
            ],
            options={
                'verbose_name': 'Статус учебной группы',
                'verbose_name_plural': 'Статусы учебных групп',
            },
        ),
    ]
