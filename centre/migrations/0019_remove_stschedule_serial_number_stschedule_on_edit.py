# Generated by Django 4.0.3 on 2022-06-03 00:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0018_remove_stschedule_type_stschedule_serial_number'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stschedule',
            name='serial_number',
        ),
        migrations.AddField(
            model_name='stschedule',
            name='on_edit',
            field=models.CharField(default='', max_length=250, null=True, verbose_name='На редактировании'),
        ),
    ]
