# Generated by Django 4.0.3 on 2022-06-30 00:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0041_alter_oos_full_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='studentgroups',
            name='approve_group',
            field=models.BooleanField(default=False, verbose_name='Состав группы утвержден'),
        ),
    ]
