# Generated by Django 4.0.3 on 2022-06-02 02:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0016_alter_stschedule_program'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stschedule',
            name='name',
            field=models.CharField(default='Наименование', max_length=500, verbose_name='Наименование модуля (раздела)'),
        ),
    ]