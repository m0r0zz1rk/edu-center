# Generated by Django 4.0.3 on 2022-05-31 06:53

from django.db import migrations, models
import students.models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0002_alter_docs_options_alter_docs_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='docs',
            name='file',
            field=models.FileField(max_length=1000, upload_to=students.models.get_path, verbose_name='Документ'),
        ),
    ]
