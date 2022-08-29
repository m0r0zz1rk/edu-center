# Generated by Django 4.0.3 on 2022-06-18 10:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('centre', '0033_alter_courselessons_options_eventslessons'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='courselessons',
            name='course',
        ),
        migrations.RemoveField(
            model_name='events',
            name='students_number',
        ),
        migrations.RemoveField(
            model_name='eventslessons',
            name='event',
        ),
        migrations.AddField(
            model_name='courselessons',
            name='group',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='centre.studentgroups', verbose_name='Курс'),
        ),
        migrations.AddField(
            model_name='eventslessons',
            name='group',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='centre.studentgroups', verbose_name='Мероприятие'),
        ),
        migrations.AddField(
            model_name='studentgroups',
            name='students_number',
            field=models.PositiveIntegerField(blank=True, null=True, verbose_name='Плановое количество мест'),
        ),
    ]