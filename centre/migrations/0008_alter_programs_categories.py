# Generated by Django 4.0.3 on 2022-05-31 06:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0007_alter_audiencecategories_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='programs',
            name='categories',
            field=models.ManyToManyField(to='centre.audiencecategories', verbose_name='Категории слушателей'),
        ),
    ]
