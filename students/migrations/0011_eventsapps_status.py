# Generated by Django 4.0.3 on 2022-06-23 12:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0010_statuses'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventsapps',
            name='status',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='students.statuses', verbose_name='Статус'),
        ),
    ]
