# Generated by Django 4.0.3 on 2022-06-03 00:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0019_remove_stschedule_serial_number_stschedule_on_edit'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stschedule',
            name='on_edit',
        ),
        migrations.AddField(
            model_name='programs',
            name='kug_on_edit',
            field=models.CharField(default='', max_length=250, null=True, verbose_name='На редактировании'),
        ),
    ]
