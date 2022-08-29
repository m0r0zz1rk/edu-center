# Generated by Django 4.0.3 on 2022-05-26 06:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0002_alter_oos_form_alter_oos_full_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mos',
            name='name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Название МО'),
        ),
        migrations.AlterField(
            model_name='ootypes',
            name='name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Наименование типа ОО'),
        ),
        migrations.AlterField(
            model_name='positioncategories',
            name='name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Название категории'),
        ),
        migrations.AlterField(
            model_name='positions',
            name='name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Название должности'),
        ),
    ]