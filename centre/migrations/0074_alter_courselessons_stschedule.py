# Generated by Django 4.0.3 on 2022-07-28 07:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0073_alter_programs_order_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courselessons',
            name='stschedule',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='centre.stschedule', verbose_name='Раздел/тема'),
        ),
    ]
