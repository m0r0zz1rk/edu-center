# Generated by Django 4.0.3 on 2022-05-25 03:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authen', '0006_profiles_state'),
        ('students', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='docs',
            options={'verbose_name': 'Документ', 'verbose_name_plural': 'Документы'},
        ),
        migrations.AlterField(
            model_name='docs',
            name='profile',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='profiledocs', to='authen.profiles', verbose_name='Владелец'),
        ),
    ]