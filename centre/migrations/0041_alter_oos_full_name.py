# Generated by Django 4.0.3 on 2022-06-28 12:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0040_alter_oos_full_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='oos',
            name='full_name',
            field=models.CharField(blank=True, max_length=300, null=True, verbose_name='Полное название ОО'),
        ),
    ]
