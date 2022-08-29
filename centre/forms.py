from authen.middleware import GetDepsFromAD
from centre.models import AudienceCategories, Programs, Courses, Events, StudentGroups, EventTypes
from django import forms


class ListTextWidget(forms.TextInput):
    def __init__(self, data_list, name, *args, **kwargs):
        super(ListTextWidget, self).__init__(*args, **kwargs)
        self._name = name
        self._list = data_list
        self.attrs.update({'list':'list__%s' % self._name})

    def render(self, name, value, attrs=None, renderer=None):
        text_html = super(ListTextWidget, self).render(name, value, attrs=attrs)
        data_list = '<datalist id="list__%s">' % self._name
        for item in self._list:
            data_list += '<option value="%s">' % item
        data_list += '</datalist>'

        return (text_html + data_list)


class ProgramForm(forms.ModelForm):
    class Meta:
        dep_choices = GetDepsFromAD()
        cats = AudienceCategories.objects.all()
        cat_choices = ()
        for cat in cats:
            cat_choices = cat_choices + ((str(cat.id), cat.name), )
        cat_choices = tuple(sorted(cat_choices))
        type_choices = (('Повышение квалификации', 'Повышение квалификации'), ('Профессиональная переподготовка', 'Профессиональная переподготовка'))
        model = Programs
        fields = (
            'department',
            'name',
            'type_dpp',
            'duration',
            'categories',
            'annotation',
            'order_id',
            'order_date',
            'order_file',
            'price',
        )
        widgets = {
            'department': ListTextWidget(data_list=dep_choices, name='department', attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'value': '',
                'required': 'true',
            }),
            'type_dpp': forms.Select(choices=type_choices, attrs={
                'class': 'form-control',
                'style': 'text-align: center;',
                'required': 'true',
                'id': 'SelectType'
            }),
            'duration': forms.NumberInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
                'placeholder': 'Не более 250 часов',
                'max': 250,
                'id': 'DurationProg'
            }),
            'annotation': forms.Textarea(attrs={
                'class': 'form-control',
                'required': 'true',
            }),
            'order_id': forms.TextInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'order_date': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'order_file': forms.FileInput(attrs={
                'class': 'form-control',
                'id': 'InputFile',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
            }),
        }

    categories = forms.ModelMultipleChoiceField(
        label='Категории слушателей',
        queryset=AudienceCategories.objects.all().order_by('-id'),
        widget=forms.CheckboxSelectMultiple(attrs={
            'style': 'align-items: left;',
        })
    )


class CoursesForm(forms.ModelForm):
    class Meta:
        progs = Programs.objects.all()
        progs_choices = ()
        count = progs.count()
        for prog in progs:
            progs_choices = progs_choices + ((str(prog.id), prog.name),)
            count -= 1
        model = Courses
        fields = (
            'program',
            'place',
            'date_start',
            'date_finish',
        )
        widgets = {
            'program': forms.Select(choices=progs_choices, attrs={
                'class': 'form-control',
                'id': 'ProgramName',
                'style': 'text-align: center;',
                'required': 'true',
            }),
            'place': forms.TextInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'value': 'ГАУ ИО ЦОПМКиМКО',
                'required': 'true',
            }),
            'date_start': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control',
                'id': 'StartDate',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'date_finish': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control',
                'id': 'FinishDate',
                'style': 'text-align:center;',
                'required': 'true',
            }),
        }


class EventsForm(forms.ModelForm):
    class Meta:
        types = EventTypes.objects.all().order_by('-id')
        types_choices = ()
        count = 1
        for type in types:
            types_choices = types_choices + ((str(count), type.name),)
            count += 1
        dep_choices = GetDepsFromAD()
        model = Events
        fields = (
            'id',
            'department',
            'type',
            'name',
            'duration',
            'categories',
            'place',
            'date_start',
            'date_finish',
            'price',
        )
        widgets = {
            'id': forms.HiddenInput(attrs={
                'class': 'form-control',
                'style': 'text-align: center;',
                'required': 'true',
            }),
            'department': ListTextWidget(data_list=dep_choices, name='department', attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'type': forms.Select(choices=types_choices, attrs={
                'class': 'form-control',
                'id': 'Type',
                'style': 'text-align: center;',
                'required': 'true',
            }),
            'name': forms.Textarea(attrs={
                'class': 'form-control',
                'required': 'true',
            }),
            'duration': forms.NumberInput(attrs={
                'class': 'form-control',
                'style': 'text-align: center;',
                'required': 'true',
            }),
            'place': forms.TextInput(attrs={
                'class': 'form-control',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'date_start': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control',
                'id': 'StartDate',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'date_finish': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control',
                'id': 'FinishDate',
                'style': 'text-align:center;',
                'required': 'true',
            }),
            'price': forms.NumberInput(attrs={
                    'min': 0,
                    'class': 'form-control',
                    'style': 'text-align: center;',
                    'required': 'true',
            }),
        }

    categories = forms.ModelMultipleChoiceField(
        label='Категории слушателей',
        queryset=AudienceCategories.objects.all().order_by('-id'),
        widget=forms.CheckboxSelectMultiple(attrs={
            'style': 'align-items: left;',
        })
    )