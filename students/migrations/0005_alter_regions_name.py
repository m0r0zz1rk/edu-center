# Generated by Django 4.0.3 on 2022-06-22 02:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0004_regions'),
    ]

    operations = [
        migrations.AlterField(
            model_name='regions',
            name='name',
            field=models.CharField(max_length=150, unique=True, verbose_name='Регион'),
        ),
    ]