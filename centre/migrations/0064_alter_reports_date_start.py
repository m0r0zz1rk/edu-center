# Generated by Django 4.0.3 on 2022-07-21 01:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0063_alter_courselessons_control'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reports',
            name='date_start',
            field=models.DateTimeField(default=None, null=True, verbose_name='Дата запуска процесса'),
        ),
    ]
