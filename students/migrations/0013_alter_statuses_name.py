# Generated by Django 4.0.3 on 2022-06-23 12:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0012_alter_eventsapps_options_eventsapps_date_create'),
    ]

    operations = [
        migrations.AlterField(
            model_name='statuses',
            name='name',
            field=models.CharField(max_length=50, unique=True, verbose_name='Статус'),
        ),
    ]
