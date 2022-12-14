# Generated by Django 4.0.3 on 2022-06-03 07:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authen', '0007_profiles_teacher'),
        ('centre', '0021_events_courses'),
    ]

    operations = [
        migrations.CreateModel(
            name='StudentGroups',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(default='', max_length=50, unique=True, verbose_name='Шифр')),
                ('course', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='centre.courses', verbose_name='Курс')),
                ('event', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='centre.events', verbose_name='Мероприятие')),
                ('students', models.ManyToManyField(to='authen.profiles', verbose_name='Обучающиеся')),
            ],
            options={
                'verbose_name': 'Учебная группа',
                'verbose_name_plural': 'Учебные группы',
            },
        ),
    ]
