# Generated by Django 4.0.3 on 2022-05-25 03:10

from django.db import migrations, models
import django.db.models.deletion
import students.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authen', '0006_profiles_state'),
    ]

    operations = [
        migrations.CreateModel(
            name='DocsTypes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Наименование типа файла')),
            ],
            options={
                'verbose_name': 'Тип документа',
                'verbose_name_plural': 'Типы документов',
            },
        ),
        migrations.CreateModel(
            name='Docs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('upload_date', models.DateField(auto_now_add=True, verbose_name='Дата загрузки файла')),
                ('file', models.FileField(upload_to=students.models.get_path, verbose_name='Документ')),
                ('doc_type', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='students.docstypes', verbose_name='Тип документа')),
                ('profile', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='authen.profiles', verbose_name='Владелец')),
            ],
            options={
                'verbose_name': 'Документы',
            },
        ),
    ]