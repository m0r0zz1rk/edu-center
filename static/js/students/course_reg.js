function CheckboxJob() {
    if ($('#job').is(":checked")) {
        $('#tr_oo').css('visibility', 'collapse');
        if ($('#ManualOo').length) {
            $('#ManualOo').val();
            $('#ManualOo').prop('disabled', false);
            $('#OoButton').attr('onclick', 'SaveManualOo();');
            $('#OoButton').text('Сохранить организацию');
            $('#SelectRegion option[value="0"]').attr("disabled", false);
            $('#SelectRegion option[value="0"]').prop('selected', true);
        }
        $('#tr_poscat').css('visibility', 'collapse');
        $('#tr_pos').css('visibility', 'collapse');
        $('#oo_poscat').empty();
        $('#oo_pos').empty();
    } else {

    }
};
function SelectRegions() {
    $('#SelectRegion option[value="0"]').remove();
    var id = $('#SelectRegion').val();
    if ($("#SelectRegion option[value='"+id+"']").text() == 'Иркутская область') {
        $('#tr_mo').css('visibility', 'visible');
        $('#SelectRegion option[value="0"]').attr("disabled", true);
        $('#MoDiv').empty();
        $('#MoDiv').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
        $('#tr_oo').css('visibility', 'collapse');
        $.ajax(
         {
            type: "GET",
            url: "/student/api/mos",
            dataType : "json",
            success: function(result) {
                select = '<select class="form-control" id="SelectMo" style="text-align: center;" onchange="SelectMos();" required>'
                    +'<option value="0">Выберите МО</option>'
                $.each(result, function(index, data) {
                    select += '<option value="'+data.id+'">'+data.name+'</option>'
                });
                select += '</select>'
                $('#MoDiv').empty();
                $('#MoDiv').append(select);
            }
         });
    } else {
        if (!$('#job').is(":checked")) {
           $('#tr_mo').css('visibility', 'collapse');
           $('#MoDiv').empty();
           $('#tr_oo').css('visibility', 'collapse');
           $('#oo_div').empty();
           ManualOo();
        } else {
            $('#tr_edulevel').css('visibility', 'visible');
            $('#edu_level').empty();
            $('#edu_level').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
             $.ajax(
             {
                type: "GET",
                url: "/student/api/edu_levels",
                dataType : "json",
                success: function(result) {
                    select = '<select class="form-control" id="SelectEduLevels" style="text-align: center;" onchange="SelectEduLevel();" required>'
                        + '<option value="0" selected>Выберите из списка</option>'
                    $.each(result, function(index, data) {
                        select += '<option value="'+data.id+'">'+data.name+'</option>'
                    });
                    select += '</select>'
                    $('#edu_level').empty();
                    $('#edu_level').append(select);
                }
             });
            $('#tr_surname').css('visibility', 'collapse');
            $('#tr_surinfo').css('visibility', 'collapse');
            $('#tr_changesur').css('visibility', 'collapse');
            $('#tr_eduserial').css('visibility', 'collapse');
            $('#tr_edunumber').css('visibility', 'collapse');
            $('#tr_edudate').css('visibility', 'collapse');
            $('#check_surname').empty();
            $('#change_surname').empty();
            $('#edu_serial').empty();
            $('#edu_number').empty();
            $('#edu_date').empty();
        }
    }
};
function SelectMos() {
   $('#SelectMo option[value="0"]').remove();
   if (!$('#job').is(":checked")) {
       $('#tr_oo').css('visibility', 'visible');
       $('#oo_div').empty();
       $('#oo_div').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
       window.id_mo = $('#SelectMo').val();
       $.ajax(
         {
            type: "GET",
            url: "/student/api/oos",
            data: {
                id: id_mo
            },
            dataType : "json",
            success: function(result) {
                modal = '<table border="0" style="width: 60vw; margin: 0 auto;"><tr><td style="width: 50%; margin: 0 auto;"><button type="button" class="m-auto w-100 btn btn-lg btn-primary" onclick="ManualOo();window.location.href=\'#close\';">'
                    + 'Моей организации нет в списке</button></td><td style="margin: 0 auto;"><button type="button" class="m-auto w-100 btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                    + 'Закрыть</button></td></tr></table><br>'
                    + '<input type="text" class="form-control" id="SearсhOoText" placeholder="Начните вводить название..." onchange="SearchOo();"><br>'
                    + '<table class="table_crit" id="OosTable"><thead><th>Краткое название</th><th>Полное название</th>'
                    + '<th>Тип</th><th>Выбор</th></thead><tbody>'
                $.each(result, function(index, data){
                    modal += '<tr><td>'+data.short_name+'</td><td>'+data.full_name+'</td><td>'+data.type_oo+'</td>'
                        + '<td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="ChooseOo('+data.id+');window.location.href=\'#close\';">'
                        + 'Выбрать</button></td></tr>'
                });
                modal += '</tbody></table><br>'
                $('.popup_add').empty();
                $('.popup_add').append(modal);
                if (!$('#job').is(":checked")) {
                    button = '<button type="button" class="m-auto w-50 btn btn-lg btn-primary" onclick="SelectMos();window.location.href=\'#win\'">'
                        + 'Выбрать организацию</button>'
                    $('#oo_div').empty();
                    $('#oo_div').append(button);
                }
            }
         });
     } else {
        $('#tr_edulevel').css('visibility', 'visible');
            $('#edu_level').empty();
            $('#edu_level').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
             $.ajax(
             {
                type: "GET",
                url: "/student/api/edu_levels",
                dataType : "json",
                success: function(result) {
                    select = '<select class="form-control" id="SelectEduLevels" style="text-align: center;" onchange="SelectEduLevel();" required>'
                        + '<option value="0" selected>Выберите из списка</option>'
                    $.each(result, function(index, data) {
                        select += '<option value="'+data.id+'">'+data.name+'</option>'
                    });
                    select += '</select>'
                    $('#edu_level').empty();
                    $('#edu_level').append(select);
                }
             });
            $('#tr_surname').css('visibility', 'collapse');
            $('#tr_surinfo').css('visibility', 'collapse');
            $('#tr_changesur').css('visibility', 'collapse');
            $('#tr_eduserial').css('visibility', 'collapse');
            $('#tr_edunumber').css('visibility', 'collapse');
            $('#tr_edudate').css('visibility', 'collapse');
            $('#check_surname').empty();
            $('#change_surname').empty();
            $('#edu_serial').empty();
            $('#edu_number').empty();
            $('#edu_date').empty();
     }
};
function SearchOo() {
    $('#OosTable').find("tr:gt(0)").remove();
    row = '<tr><td colspan="5"><img src="/static/work/load_full.gif" style="width:10%; height:10%"></td></tr>';
    $('#OosTable > tbody').append(row);
    var val = $('#SearсhOoText').val();
    $.ajax(
     {
        type: "GET",
        url: "/student/api/oos",
        data: {
            id: id_mo,
            search: val
        },
        dataType : "json",
        success: function(result) {
            rows = '';
            $.each(result, function(index, data){
                rows += '<tr><td>'+data.short_name+'</td><td>'+data.full_name+'</td><td>'+data.type_oo+'</td>'
                    + '<td><button type="button" class="m-auto btn btn-lg btn-primary" onclick="ChooseOo('+data.id+');window.location.href=\'#\';">'
                    + 'Выбрать</button></td></tr>'
            });
            $('#OosTable').find("tr:gt(0)").remove();
            $('#OosTable').append(rows);
        }
    });
};
function ChooseOo(id_oo) {
   $('#oo_div').empty();
   $('#oo_div').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
    $.ajax(
     {
        type: "GET",
        url: "/student/api/oos",
        data: {
            oo_id: id_oo
        },
        dataType : "json",
        success: function(result) {
            div = '<select class="form-control" id="Oo" style="text-align: center; width: 100%" required>'
                + '<option value="'+result[0].id+'">'+result[0].short_name+'</option>'
                + '</select><br><button type="button" class="m-auto w-50 btn btn-lg btn-primary" onclick="window.location.href=\'#win\'">'
                + 'Изменить организацию</button>'
            $('#oo_div').empty();
            $('#oo_div').append(div);
        }
    });
    $('#tr_edulevel').css('visibility', 'visible');
    $('#edu_level').empty();
    $('#edu_level').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
     $.ajax(
     {
        type: "GET",
        url: "/student/api/edu_levels",
        dataType : "json",
        success: function(result) {
            select = '<select class="form-control" id="SelectEduLevels" style="text-align: center;" onchange="SelectEduLevel();" required>'
                + '<option value="0" selected>Выберите из списка</option>'
            $.each(result, function(index, data) {
                select += '<option value="'+data.id+'">'+data.name+'</option>'
            });
            select += '</select>'
            $('#edu_level').empty();
            $('#edu_level').append(select);
        }
     });
    $('#tr_poscat').css('visibility', 'visible');
    PosCatData();
};
function ManualOo(){
    $('#tr_oo').css('visibility', 'visible');
    $('#oo_div').empty();
    $('#oo_div').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
    div = '<textarea class="form-control" id="ManualOo" placeholder="Впишите название своей организации..." name="OoManual" required></textarea><br>'
        + '<button type="button" id="OoButton" class="m-auto w-50 btn btn-lg btn-primary" onclick="SaveManualOo();">'
        + 'Сохранить организацию</button>'
    $('#oo_div').empty();
    $('#oo_div').append(div);
};
function SaveManualOo(){
    $('#job').prop('disabled', true);
    if ($('#ManualOo').val().length == 0) {
        $('#oo_div').append('<br><b id="OoError" style="color: red;">Заполните название организации</b>');
    } else {
        if ($('#OoError').length) {
            $('#OoError').remove();
        }
        $('#ManualOo').prop('disabled', true);
        if ($("#SelectRegion option:selected").text() == 'Иркутская область') {
            $('#OoButton').attr('onclick', 'window.location.href=\'#win\';');
        } else {
            $('#OoButton').attr('onclick', 'ManualOo();');
        }
        $('#OoButton').text('Изменить организацию');
        $('#tr_poscat').css('visibility', 'visible');
        PosCatData();
    }
};
function PosCatData(){
    $.ajax(
     {
        type: "GET",
        url: "/student/api/pos_cats",
        dataType : "json",
        success: function(result) {
            select_cats = '<select class="form-control" id="SelectPosCat" style="text-align:center;" onchange="SelectPosCats();" required>'
                + '<option value="0">Выберите категорию</option>';
            $.each(result, function(index, data) {
                select_cats += '<option value="'+data.id+'">'+data.name+'</option>'
            });
            select_cats += '</select>'
            $('#oo_poscat').empty();
            $('#oo_poscat').append(select_cats);
        }
     });
}
function SelectPosCats(){
    $('#SelectPosCat option[value="0"]').remove();
    $('#tr_pos').css('visibility', 'visible');
    $('#oo_pos').empty();
    $('#oo_pos').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
    $.ajax(
     {
        type: "GET",
        url: "/student/api/positions",
        success: function(result) {
            select = '<select class="form-control" id="SelectPos" style="text-align: center;" onchange="SelectP();" required>'
                +'<option value="0" selected>Выберите из списка</option>'
            $.each(result, function(index, data) {
                select += '<option value="'+data.id+'">'+data.name+'</option>'
            });
            select += '</select>'
            $('#oo_pos').empty();
            $('#oo_pos').append(select);
        }
     });
};
function SelectP(){
    $('#SelectPos option[value="0"]').remove();
    $('#tr_edulevel').css('visibility', 'visible');
    $('#edu_level').empty();
    $('#edu_level').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
     $.ajax(
     {
        type: "GET",
        url: "/student/api/edu_levels",
        dataType : "json",
        success: function(result) {
            select = '<select class="form-control" id="SelectEduLevels" style="text-align: center;" onchange="SelectEduLevel();" required>'
                + '<option value="0" selected>Выберите из списка</option>'
            $.each(result, function(index, data) {
                select += '<option value="'+data.id+'">'+data.name+'</option>'
            });
            select += '</select>'
            $('#edu_level').empty();
            $('#edu_level').append(select);
        }
     });
    $('#tr_surname').css('visibility', 'collapse');
    $('#tr_surinfo').css('visibility', 'collapse');
    $('#tr_changesur').css('visibility', 'collapse');
    $('#tr_eduserial').css('visibility', 'collapse');
    $('#tr_edunumber').css('visibility', 'collapse');
    $('#tr_edudate').css('visibility', 'collapse');
    $('#check_surname').empty();
    $('#change_surname').empty();
    $('#edu_serial').empty();
    $('#edu_number').empty();
    $('#edu_date').empty();
};
function SelectEduLevel(){
    $('#SelectEduLevels option[value="0"]').remove();
    $('#tr_eduload').css('visibility', 'visible');
    $('#tr_edufile').css('visibility', 'collapse');
    var level = $('#SelectEduLevels option:selected').text();
    if (level != 'Студент') {
        $('#tr_educat').css('visibility', 'collapse');
        $('#tr_surname').css('visibility', 'visible');
        $('#tr_eduserial').css('visibility', 'visible');
        $('#tr_edufile').css('visibility', 'visible');
        $('#tr_edunumber').css('visibility', 'visible');
        $('#tr_edudate').css('visibility', 'visible');
        $('#tr_eduload').css('visibility', 'collapse');
        $('#edu_load').empty();
        $('#edu_cat').empty();
        $('#edu_file').empty();
        $('#edu_file_title').text('Диплом (скан, фотокопия):')
        div_doc = '<button type="button" class="btn btn-lg btn-primary" onclick="DiplomaList();window.location.href=\'#win\';">Выберите документ</button>'
        $('#edu_file').empty();
        $('#edu_file').append(div_doc);
    } else {
        $('#tr_surname').css('visibility', 'collapse');
        $('#tr_eduserial').css('visibility', 'collapse');
        $('#tr_edunumber').css('visibility', 'collapse');
        $('#tr_edudate').css('visibility', 'collapse');
        $('#InputSurname').val('');
        $('#InputSerial').val('');
        $('#InputNumber').val('');
        $('#EduDate').val('');
        $('#change_surname').empty();
        $('#tr_educat').css('visibility', 'visible');
        $('#tr_edufile').css('visibility', 'visible');
        $.ajax(
         {
            type: "GET",
            url: "/student/api/edu_cats",
            dataType : "json",
            success: function(result) {
                select = '<select class="form-control" id="SelectEduCats" style="text-align: center;" onchange="SelectEC();" required>'
                    +'<option value="0">Выберите категорию</option>'
                $.each(result, function(index, data) {
                    select += '<option value="'+data.id+'">'+data.name+'</option>'
                });
                select += '</select>'
                $('#edu_cat').empty();
                $('#edu_cat').append(select);
                $('#tr_eduload').css('visibility', 'collapse');
                $('#edu_load').empty();
                $('#tr_educat').css('visibility', 'visible');
                $('#edu_file_title').text('Справка об обучении (скан, фотокопия):')
                div_doc = '<button type="button" class="btn btn-lg btn-primary"'
                    + 'onclick="StudyCertsList();window.location.href=\'#win\';">Выберите документ</button>'
                $('#edu_file').empty();
                $('#edu_file').append(div_doc);
                $('#tr_edufile').css('visibility', 'visible');
            }
         });
    }
};
function SelectEC() {
    $('#SelectEduCats option[value="0"]').remove();
}
function CheckSurname() {
    $.ajax(
         {
            type: "GET",
            url: "/student/api/check_surname",
            dataType : "json",
            success: function(result) {
                if (result[0].surname != $('#InputSurname').val()) {
                    $('#tr_surinfo').css('visibility', 'visible');
                    div_doc = '<button type="button" class="btn btn-lg btn-primary" onclick="ChangeSurnameList();window.location.href=\'#win\';">Выберите документ</button>'
                    $('#change_surname').empty();
                    $('#change_surname').append(div_doc);
                    $('#tr_changesur').css('visibility', 'visible');
                    $('#tr_eduserial').css('visibility', 'collapse');
                    $('#tr_edunumber').css('visibility', 'collapse');
                    $('#tr_edudate').css('visibility', 'collapse');
                    $('#tr_radio').css('visibility', 'collapse');
                    $('#tr_getcert').css('visibility', 'collapse');
                    $('#tr_checkbutton').css('visibility', 'collapse');
                } else {
                    $('#tr_surinfo').css('visibility', 'collapse');
                    $('#tr_changesur').css('visibility', 'collapse');
                    $('#change_surname').empty();
                    $('#tr_eduserial').css('visibility', 'visible');
                    $('#tr_edunumber').css('visibility', 'visible');
                    $('#tr_edudate').css('visibility', 'visible');
                    $('#tr_radio').css('visibility', 'visible');
                    $('#tr_getcert').css('visibility', 'visible');
                    $('#tr_checkbutton').css('visibility', 'visible');
                }
            }
         });
};
function ChangeSurnameList(){
    $('.popup_add').empty();
    $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
    $.ajax(
         {
            type: "GET",
            url: "/student/api/change_surname",
            dataType : "json",
            success: function(result) {
                table = '<h4>Документы о смене фамилии</h4><table class="table_crit"><thead><tr><th colspan="4"><div class="inl">'
                +'<button type="button" class="btn btn-lg btn-primary"'
                +'onclick="UploadChangeSurname();window.location.href=\'#win\';">'
                +'Внести новый документ</button>'
                +'</div></th></tr><tr><th>Имя файла</th><th>Дата загрузки</th><th>Выбор</th></tr>'
                +'</thead><tbody>'
                if (result.length == 0) {
                    table += '<tr><td colspan="4"><b>Документы не найдены</b></td></tr>'
                } else {
                    $.each(result, function(index, data) {
                        table += '<tr><td><form action="/doc_view" id="show_'+data.id+'" method="GET" target="_blank">'
                            +'<input type="hidden" value="'+data.id+'" name="doc_id">'
                            +'<a href="javascript:{}" onclick="document.getElementById(\'show_'+data.id+'\').submit();">'+data.filename+'</a></form></td>'
                            +'<td>'+ StrDate(data.upload_date) +'</td>'
                            +'<td><button type="button" class="btn btn-lg btn-primary" onclick="ChooseDoc('+data.id+', \'change_surname\');window.location.href=\'#close\';">'
                            +'Выбрать</button></td></tr>'
                    });
                }
                table += '</tbody></table><br><button type="button" class="m-auto w-25 btn btn-lg btn-primary"'
                    +'onclick="window.location.href=\'#close\';">Закрыть</button>'
                $('.popup_add').empty();
                $('.popup_add').append(table);
            }
         });
};
function DiplomaList() {
    $('.popup_add').empty();
    $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
    $.ajax(
         {
            type: "GET",
            url: "/student/api/diploma",
            dataType : "json",
            success: function(result) {
                table = '<h4>Дипломы</h4><table class="table_crit"><thead><tr><th colspan="4"><div class="inl">'
                +'<button type="button" class="btn btn-lg btn-primary"'
                +'onclick="UploadDiploma();window.location.href=\'#win\';">'
                +'Внести новый документ</button>'
                +'</div></th></tr><tr><th>Имя файла</th><th>Дата загрузки</th><th>Выбор</th></tr>'
                +'</thead><tbody>'
                if (result.length == 0) {
                    table += '<tr><td colspan="4"><b>Документы не найдены</b></td></tr>'
                } else {
                    $.each(result, function(index, data) {
                        table += '<tr><td><form action="/doc_view" id="show_'+data.id+'" method="GET" target="_blank">'
                            +'<input type="hidden" value="'+data.id+'" name="doc_id">'
                            +'<a href="javascript:{}" onclick="document.getElementById(\'show_'+data.id+'\').submit();">'+data.filename+'</a></form></td>'
                            +'<td>'+ StrDate(data.upload_date) +'</td>'
                            +'<td><button type="button" class="btn btn-lg btn-primary" onclick="ChooseDoc('+data.id+', \'diploma\');window.location.href=\'#close\';">'
                            +'Выбрать</button></td></tr>'
                    });
                }
                table += '</tbody></table><br><button type="button" class="m-auto w-25 btn btn-lg btn-primary"'
                    +'onclick="window.location.href=\'#close\';">Закрыть</button>'
                $('.popup_add').empty();
                $('.popup_add').append(table);
            }
         });
};
function StudyCertsList() {
    $('.popup_add').empty();
    $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
    $.ajax(
         {
            type: "GET",
            url: "/student/api/study_certs",
            dataType : "json",
            success: function(result) {
                table = '<h4>Справки об обучении</h4><table class="table_crit"><thead><tr><th colspan="4"><div class="inl">'
                +'<button type="button" class="btn btn-lg btn-primary"'
                +'onclick="UploadStudyCert();window.location.href=\'#win\';">'
                +'Внести новый документ</button>'
                +'</div></th></tr><tr><th>Имя файла</th><th>Дата загрузки</th><th>Выбор</th></tr>'
                +'</thead><tbody>'
                if (result.length == 0) {
                    table += '<tr><td colspan="4"><b>Документы не найдены</b></td></tr>'
                } else {
                    $.each(result, function(index, data) {
                        table += '<tr><td><form action="/doc_view" id="show_'+data.id+'" method="GET" target="_blank">'
                            +'<input type="hidden" value="'+data.id+'" name="doc_id">'
                            +'<a href="javascript:{}" onclick="document.getElementById(\'show_'+data.id+'\').submit();">'+data.filename+'</a></form></td>'
                            +'<td>'+ StrDate(data.upload_date) +'</td>'
                            +'<td><button type="button" class="btn btn-lg btn-primary" onclick="ChooseDoc('+data.id+', \'study_cert\');window.location.href=\'#close\';">'
                            +'Выбрать</button></td></tr>'
                    });
                }
                table += '</tbody></table><br><button type="button" class="m-auto w-25 btn btn-lg btn-primary"'
                    +'onclick="window.location.href=\'#close\';">Закрыть</button>'
                $('.popup_add').empty();
                $('.popup_add').append(table);
            }
         });
};
function UploadChangeSurname(){
    $('.popup_add').empty();
    $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
    $.ajax(
         {
            type: "GET",
            url: "/student/api/doc_types",
            dataType : "json",
            success: function(result) {
                table = '<table class="table_crit"><thead><tr><th colspan="2">Загрузка документа о смене фамилии</th></tr></thead>'
                    +'<tbody><tr><td>Выберите файл:<br>(Размер файла не должен превышать 10 мб,<br>'
                    +'Допустимые форматы - jpg, png, pdf)</td><td>'
                    +'<input type="file" class="form-control" id="new_doc">'
                    +'</td></tr><tr><td colspan="2">'
                $.each(result, function(index, data) {
                    if (data.name == 'Документ о смене фамилии') {
                        table += '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="UploadDoc('+data.id+');">'
                    }
                })
                table += 'Загрузить документ</button></td></tr></tbody></table><div id="doc_error" style="margin:0 auto;">'
                    +'</div><br><button type="button" class="m-auto btn btn-lg btn-primary" onclick="ChangeSurnameList();">'
                    +'Закрыть</button><br>'
                    $('.popup_add').empty();
                    $('.popup_add').append(table);
            }
    });
};
function UploadDiploma() {
    $('.popup_add').empty();
    $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
    $.ajax(
         {
            type: "GET",
            url: "/student/api/doc_types",
            dataType : "json",
            success: function(result) {
                table = '<table class="table_crit"><thead><tr><th colspan="2">Загрузка диплома</th></tr></thead>'
                    +'<tbody><tr><td>Выберите файл:<br>(Размер файла не должен превышать 10 мб,<br>'
                    +'Допустимые форматы - jpg, png, pdf)</td><td>'
                    +'<input type="file" class="form-control" id="new_doc">'
                    +'</td></tr><tr><td colspan="2">'
                $.each(result, function(index, data) {
                    if (data.name == 'Диплом') {
                        table += '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="UploadDoc('+data.id+');">'
                    }
                })
                table += 'Загрузить документ</button></td></tr></tbody></table><div id="doc_error" style="margin:0 auto;">'
                    +'</div><br><button type="button" class="m-auto btn btn-lg btn-primary" onclick="DiplomaList();">'
                    +'Закрыть</button><br>'
                    $('.popup_add').empty();
                    $('.popup_add').append(table);
            }
    });
};
function UploadStudyCert() {
    $('.popup_add').empty();
    $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
    $.ajax(
         {
            type: "GET",
            url: "/student/api/doc_types",
            dataType : "json",
            success: function(result) {
                table = '<table class="table_crit"><thead><tr><th colspan="2">Загрузка справки об образовании</th></tr></thead>'
                    +'<tbody><tr><td>Выберите файл:<br>(Размер файла не должен превышать 10 мб,<br>'
                    +'Допустимые форматы - jpg, png, pdf)</td><td>'
                    +'<input type="file" class="form-control" id="new_doc">'
                    +'</td></tr><tr><td colspan="2">'
                $.each(result, function(index, data) {
                    if (data.name == 'Справка об обучении') {
                        table += '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="UploadDoc('+data.id+');">'
                    }
                })
                table += 'Загрузить документ</button></td></tr></tbody></table><div id="doc_error" style="margin:0 auto;">'
                    +'</div><br><button type="button" class="m-auto btn btn-lg btn-primary" onclick="StudyCertsList();">'
                    +'Закрыть</button><br>'
                    $('.popup_add').empty();
                    $('.popup_add').append(table);
            }
    });
};
function UploadDoc(id) {
    if ($('#new_doc').val() == '') {
        $('#doc_error').empty();
        $('#doc_error').append('<b style="color: red;">Файл не выбран</b>');
    } else if ($('#new_doc').val().length > 50) {
       $('#doc_error').empty();
       $('#doc_error').append('<b style="color: red;">Длинное имя файла</b>');
    } else {
        if ($('#new_doc')[0].files[0].size > 10485760) {
            $('#doc_error').empty();
            $('#doc_error').append('<b style="color: red;">Размер файла превышает 10 мб</b>');
        } else {
            var fileExtension = ['jpg', 'png', 'pdf'];
            if ($.inArray($('#new_doc').val().split('.').pop().toLowerCase(), fileExtension) == -1) {
                $('#doc_error').empty();
                $('#doc_error').append('<b style="color: red;">Выбран файл с недопустимым форматом</b>');
            } else {
                $('#doc_error').empty();
                var fd = new FormData();
                fd.append('doc_type', id);
                fd.append('file', $('#new_doc')[0].files[0]);
                $('.popup_add').empty();
                $('.popup_add').append('<h4>Подождите, идет загрузка файла...</h4>');
                $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
                $.ajax({
                  headers: { "X-CSRFToken": getCookie("csrftoken") },
                  url: '/student/api/doc_upload',
                  data: fd,
                  processData: false,
                  contentType: false,
                  type: 'POST',
                  success: function(data){
                    $.ajax(
                        {
                        type: "GET",
                        url: "/student/api/doc_types",
                        data: {
                            id_doctype: id
                        },
                        dataType : "json",
                        success: function(result) {
                            switch(result[0].name) {
                             case 'Справка об обучении':
                              StudyCertsList();
                              break;
                             case 'Диплом':
                              DiplomaList();
                              break;
                             case 'Документ о смене фамилии':
                              $('#tr_surinfo').css('visibility', 'collapse');
                              ChangeSurnameList();
                              break;
                            }
                        }
                    });
                  }
                });
            }
        }
    }
};
function ChooseDoc(id, type) {
    switch (type) {
        case 'study_cert':
            $.ajax(
             {
                type: "GET",
                data: {
                    id_studycert: id
                },
                url: "/student/api/study_certs",
                dataType : "json",
                success: function(result) {
                    $('#edu_file').empty();
                    $('#edu_file').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
                    div = '<select class="form-control" style="text-align: center;" id="SelectStudyCert"><option value="'+result[0].id+'">'+result[0].filename+'</option>'
                        +'</select><br><button type="button" class=" m-auto btn btn-lg btn-primary" '
                        +'onclick="StudyCertsList();window.location.href=\'#win\';">Изменить документ</button>';
                    $('#edu_file').empty();
                    $('#edu_file').append(div);
                }
             });
             $('#tr_radio').css('visibility', 'visible');
             $('#tr_getcert').css('visibility', 'visible');
             $('#tr_checkbutton').css('visibility', 'visible');
             break;
        case 'diploma':
            $('#edu_file').empty();
            $('#edu_file').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
            $.ajax(
             {
                type: "GET",
                data: {
                    id_diploma: id
                },
                url: "/student/api/diploma",
                dataType : "json",
                success: function(result) {
                    div = '<select class="form-control" style="text-align: center;" id="SelectDiploma"><option value="'+result[0].id+'">'+result[0].filename+'</option></select><br>'
                        +'<button type="button" class=" m-auto btn btn-lg btn-primary" '
                        +'onclick="DiplomaList();window.location.href=\'#win\';">Изменить документ</button>';
                    $('#edu_file').empty();
                    $('#edu_file').append(div);
                }
             });
             $('#tr_radio').css('visibility', 'visible');
             $('#tr_getcert').css('visibility', 'visible');
             $('#tr_checkbutton').css('visibility', 'visible');
             break;
        case 'change_surname':
            $('#tr_surinfo').css('visibility', 'collapse');
            $('#change_surname').empty();
            $('#change_surname').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
            $.ajax(
             {
                type: "GET",
                data: {
                    id_changesurname: id
                },
                url: "/student/api/change_surname",
                dataType : "json",
                success: function(result) {
                    div = '<select class="form-control" style="text-align: center;" id="SelectChangeSur"><option value="'+result[0].id+'">'+result[0].filename+'</option></select><br>'
                        +'<button type="button" class=" m-auto btn btn-lg btn-primary" '
                        +'onclick="ChangeSurnameList();window.location.href=\'#win\';">Изменить документ</button>';
                    $('#change_surname').empty();
                    $('#change_surname').append(div);
                }
             });
             $('#tr_eduserial').css('visibility', 'visible');
             $('#tr_edunumber').css('visibility', 'visible');
             $('#tr_edudate').css('visibility', 'visible');
             $('#tr_radio').css('visibility', 'visible');
             $('#tr_getcert').css('visibility', 'visible');
             $('#tr_checkbutton').css('visibility', 'visible');
             break;
    }
};
function CheckCert(){
    if ($('#GetCert').is(":checked")) {
        $('#tr_address').css('visibility', 'visible');
        $('#cert_addr').empty();
        $('#cert_addr').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
        div = '<textarea class="form-control" id="PhysAddr" required></textarea>'
        $('#cert_addr').empty();
        $('#cert_addr').append(div);
    } else {
        $('#tr_address').css('visibility', 'collapse');
        $('#cert_addr').empty();
    }
};
function AutoCompleteFormButton(){
  $.ajax(
     {
        type: "GET",
        url: "/student/api/getlast_course",
        dataType : "json",
        success: function(result) {
            if (result.length == 1) {
               div = '<button type="button" class="btn btn-lg btn-primary" onclick="AutoCompleteForm();">Вставить данные из предыдущей анкеты</button>'
               $('.title').append(div);
            } else {
               $('.title').empty();
            }
        }
     });
}
function AutoCompleteForm() {
    $('.title').empty();
    $('.title').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vw', height: '10vw'}));
    $.ajax(
     {
        type: "GET",
        url: "/student/api/getlast_course",
        dataType : "json",
        success: function(result) {
           if (result[0].workless == true) {
            $('#job').prop('checked', true);
           } else {
            $('#job').prop('checked', false);
           }
           $('#SelectRegion option[value="'+result[0].region.id+'"]').prop('selected', true);
           if (result[0].mo != null) {
                div = '<select class="form-control" id="SelectMo" style="text-align: center;" onchange="SelectMos();" required>'
                    +'<option value="'+result[0].mo.id+'">'+result[0].mo.name+'</option></select>'
                $('#MoDiv').empty();
                $('#MoDiv').append(div);
                $('#tr_mo').css('visibility', 'visible');
           } else {
                $('#tr_mo').css('visibility', 'collapse');
                $('#MoDiv').empty();
           }
           if (result[0].oo_new != null) {
                div = '<textarea class="form-control" id="ManualOo" placeholder="Впишите название своей организации..." name="OoManual" required>'
                    +result[0].oo_new+'</textarea>'
                $('#oo_div').empty();
                $('#oo_div').append(div);
                $('#tr_oo').css('visibility', 'visible');
           } else {
                if (result[0].oo != null) {
                    div = '<select class="form-control" id="Oo" style="text-align: center; width: 100%" required>'
                        +'<option value="'+result[0].oo.id+'">'+result[0].oo.short_name+'</option></select>'
                    $('#oo_div').empty();
                    $('#oo_div').append(div);
                    $('#tr_oo').css('visibility', 'visible');
                } else {
                    $('#tr_oo').css('visibility', 'collapse');
                    $('#oo_div').empty();
                }
           }
           if (result[0].position_cat != null) {
                div = '<select class="form-control" id="SelectPosCat" style="text-align:center;" onchange="SelectPosCats();" required>'
                    +'<option value="'+result[0].position_cat.id+'">'+result[0].position_cat.name+'</option></select>'
                $('#oo_poscat').empty();
                $('#oo_poscat').append(div);
                $('#tr_poscat').css('visibility', 'visible');
           } else {
                $('#tr_poscat').css('visibility', 'collapse');
                $('#oo_poscat').empty();
           }
           if (result[0].position != null) {
                div = '<select class="form-control" id="SelectPos" style="text-align: center;" onchange="SelectP();" required>'
                    +'<option value="'+result[0].position.id+'">'+result[0].position.name+'</option></select>'
                $('#oo_pos').empty();
                $('#oo_pos').append(div);
                $('#tr_pos').css('visibility', 'visible');
           } else {
                $('#tr_pos').css('visibility', 'collapse');
                $('#oo_pos').empty();
           }
           $('#tr_edulevel').css('visibility', 'collapse');
           $('#edu_level').empty();
           select = '<select class="form-control" id="SelectEduLevels" style="text-align: center;" onchange="SelectEduLevel();" required>'
                +'<option value="'+result[0].edu_level.id+'">'+result[0].edu_level.name+'</option></select>'
           $('#edu_level').append(select);
           $('#tr_edulevel').css('visibility', 'visible');
           if (result[0].edu_cat != null) {
                div = '<select class="form-control" id="SelectEduCats" style="text-align: center;" onchange="SelectEC();" required>'
                    +'<option value="'+result[0].edu_cat.id+'">'+result[0].edu_cat.name+'</option></select>'
                $('#edu_cat').empty();
                $('#edu_cat').append(div);
                $('#tr_educat').css('visibility', 'visible');
           } else {
                $('#tr_educat').css('visibility', 'collapse');
                $('#edu_cat').empty();
           }
           switch (result[0].edu_doc.doc_type){
                case 'Справка об обучении':
                    $('#edu_file_title').empty();
                    $('#edu_file_title').append('Справка об обучении');
                    div = '<select class="form-control" style="text-align: center;" id="SelectStudyCert">'
                        +'<option value="'+result[0].edu_doc.id+'">'+result[0].edu_doc.filename+'</option></select><br>'
                        +'<form action="/doc_view" method="GET" target="_blank"><input type="hidden" value="'+result[0].edu_doc.id+'" name="doc_id">'
                        +'<button type="submit" class="btn btn-lg btn-primary">Просмотр</button></form>'
                    break;
                case 'Диплом':
                    $('#edu_file_title').empty();
                    $('#edu_file_title').append('Диплом');
                    div = '<select class="form-control" style="text-align: center;" id="SelectDiploma">'
                        +'<option value="'+result[0].edu_doc.id+'">'+result[0].edu_doc.filename+'</option></select><br>'
                        +'<form action="/doc_view" method="GET" target="_blank"><input type="hidden" value="'+result[0].edu_doc.id+'" name="doc_id">'
                        +'<button type="submit" class="btn btn-lg btn-primary">Просмотр</button></form>'
                    break;
           }
           $('#tr_edufile').css('visibility', 'collapse');
           $('#edu_file').empty();
           $('#edu_file').append(div);
           $('#tr_edufile').css('visibility', 'visible');
           if (result[0].check_surname != '') {
               $('#InputSurname').val(result[0].check_surname);
               $('#tr_surname').css('visibility', 'visible');
           } else {
               $('#InputSurname').val();
               $('#tr_surname').css('visibility', 'collapse');
           }
           if (result[0].change_surname != null) {
               div = '<select class="form-control" style="text-align: center;" id="SelectChangeSur">'
                        +'<option value="'+result[0].change_surname.id+'">'+result[0].change_surname.filename+'</option></select><br>'
                        +'<form action="/doc_view" method="GET" target="_blank"><input type="hidden" value="'+result[0].change_surname.id+'" name="doc_id">'
                        +'<button type="submit" class="btn btn-lg btn-primary">Просмотр</button></form>'
               $('#change_surname').empty();
               $('#change_surname').append(div);
               $('#tr_changesur').css('visibility', 'visible');
           } else {
               $('#change_surname').empty();
               $('#tr_changesur').css('visibility', 'collapse');
           }
           if (result[0].edu_serial != '') {
               $('#InputSerial').val(result[0].edu_serial);
               $('#tr_eduserial').css('visibility', 'visible');
           } else {
               $('#InputSerial').val();
               $('#tr_eduserial').css('visibility', 'collapse');
           }
           if (result[0].edu_number != '') {
               $('#InputNumber').val(result[0].edu_number);
               $('#tr_edunumber').css('visibility', 'visible');
           } else {
               $('#InputNumber').val();
               $('#tr_edunumber').css('visibility', 'collapse');
           }
           if (result[0].edu_date != null) {
               $('#EduDate').val(result[0].edu_date);
               $('#tr_edudate').css('visibility', 'visible');
           } else {
               $('#EduDate').val();
               $('#tr_edudate').css('visibility', 'collapse');
           }
           if (result[0].type != true) {
            $('input:radio[name="pay"]').filter('[value="False"]').prop('checked', true);
           }
           $('#tr_radio').css('visibility', 'visible');
           if (result[0].cert_mail == true) {
            $('#GetCert').prop('checked', true);
           } else {
            $('#GetCert').prop('checked', false);
           }
           $('#tr_getcert').css('visibility', 'visible');
           if (result[0].address != '') {
              div = '<textarea class="form-control" id="PhysAddr" required>'+result[0].address+'</textarea>'
              $('#cert_addr').empty();
              $('#cert_addr').append(div);
              $('#tr_address').css('visibility', 'visible');
           } else {
              $('#cert_addr').empty();
              $('#tr_address').css('visibility', 'collapse');
           }
        }
     });
     div = '<b style="color:green;">Данные успешно заполнены</b><br><button type="button" class="btn btn-lg btn-primary" onclick="window.location.reload();">'
        +'Сброс формы</button>'
     $('.title').empty();
     $('.title').append(div);
     $('#tr_checkbutton').css('visibility', 'visible');
};
function Initial(){
    $.ajax(
     {
        type: "GET",
        url: "/student/api/regions",
        dataType : "json",
        beforeSend: function() {
            $('#RegionDiv').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
        },
        success: function(result) {
            AutoCompleteFormButton();
            putRegionsData(result);
        }
     });
};
function StrDate(str){
     var dt   = str.substring(8,10);
     var mon  = str.substring(5,7);
     var yr   = str.substring(0,4);
     return dt+'.'+mon+'.'+yr;
};
function putRegionsData(result) {
    select_regions = '<select class="form-control" style="text-align: center;" id="SelectRegion" onchange="SelectRegions();">'
        + '<option value="0">Выберите регион из списка</option>'
    $.each(result, function (index, data) {
        select_regions += '<option value="'+data.id+'">'+data.name+'</option>'
    });
    select_regions += '</select>'
    $('#RegionDiv').empty();
    $('#RegionDiv').append(select_regions);
};
function AcceptForm(){
    if (CheckForm() != false) {
        $('.popup_add').empty();
        $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({width: '10vw', height: '10vw', margin: '0 -64px'}));
        var region = $("#SelectRegion option:selected").text();
        if ($("SelectMo").length) {
            var mo = $("#SelectMo option:selected").text();
        }
        if (!$('#job').is(":checked")) {
            if ($("#ManualOo").length == 0) {
                var oo = $("#Oo option:selected").text();
            } else {
                var oo = $("#ManualOo").val();
            }
            var pos_cat = $("#SelectPosCat option:selected").text();
            var pos = $("#SelectPos option:selected").text();
        } else {
            var oo = 'Без работы'
            var pos_cat = 'Без работы';
            var pos = 'Без работы';
        }
        var edu_level = $("#SelectEduLevels option:selected").text();
        if ($('input[name="pay"]:checked').val() == 'True') {
            var pay = 'Физическое лицо'
        } else {
            var pay = 'Юридическое лицо'
        }
        if (!$('#GetCert').is(":checked")) {
            var get_cert = 'Нет'
        } else {
            var get_cert = 'Да'
        }
        div = '<table class="table_crit" id="CheckTable" style="width: 65vw;"><thead><tr><th colspan="2">Проверьте правильность заполнения данных'
                + '</th></tr></thead><tbody><tr></tr><tr><td style="width: 30%;">Регион:</td><td>'+region+'</td></tr><tr><td>';
        if ($("SelectMo").length) {
                div += 'Муниципальное образование:</td><td>'+mo+'</td></tr><tr><td>';
            }
            div += 'Организация:</td><td>'
            if (oo == null) {
               div += 'Не выбрана'
            } else {
                div += oo
            }
        div += '</td></tr><tr><td>Категория должности:</td><td>'+pos_cat+'</td></tr><tr><td>Должность</td>'
                +'<td>'+pos+'</td></tr>'
        if (edu_level == 'Студент') {
            var edu_cat = $("#SelectEduCats option:selected").text();
            var doc_id = $("#SelectStudyCert option:selected").val();
            div += '<tr><td>Уровень образования:</td><td>'+edu_level+'</td></tr>'
                +'<tr><td>Категория получаемого образования:</td><td>'+edu_cat+'</td></tr>'
                +'<tr><td>Справка об обучении:</td><td><form action="/doc_view" id="show_'+doc_id+'" method="GET" target="_blank">'
                +'<input type="hidden" value="'+doc_id+'" name="doc_id">'
                +'<button type="submit" class="btn btn-lg btn-primary">Просмотр</td></tr>'
                +'<tr><td>Получение удостоверения почтой:</td><td>'+get_cert+'</td></tr>'
            if (get_cert == 'Да') {
                var addr = $('#PhysAddr').val();
                div += '<tr><td>Почтовый адрес для отправки удостоверения:</td><td>'+addr+'</td></tr>'
            }
            div += '<tr><td>Оплата:</td><td>'+pay+'</td></tr><tr><td colspan="2">'
                +'<button type="button" class="btn btn-lg btn-primary" onclick="SaveForm();">'
                +'Отправить заявку</button></td></tr></tbody></table><br><button type="button" class="btn btn-lg btn-primary" onclick="window.location.href=\'#close\'">'
                +'Закрыть</button>'
        } else {
            var doc_id = $("#SelectDiploma option:selected").val();
            var surname = $("#InputSurname").val();
            var serial = $("#InputSerial").val();
            var number = $("#InputNumber").val();
            var edu_date = $("#EduDate").val();
            if ($("#SelectChangeSur").length) {
                var doc_surname_id = $("#SelectChangeSur option:selected").val();
            }
            div += '<tr><td>Уровень образования:</td><td>'+edu_level+'</td></tr>'
                +'<tr><td>Диплом:</td><td><form action="/doc_view" method="GET" target="_blank">'
                +'<input type="hidden" value="'+doc_id+'" name="doc_id">'
                +'<button type="submit" class="btn btn-lg btn-primary">Просмотр</button></form></td></tr>'
                +'<tr><td>Фамилия в дипломе:</td><td>'+surname+'</td></tr>'
            if ($("#SelectChangeSur").length) {
                div += '<tr><td>Документ о смене фамилии:</td><td><form action="/doc_view" method="GET" target="_blank">'
                    +'<input type="hidden" value="'+doc_surname_id+'" name="doc_id">'
                    +'<button type="submit" class="btn btn-lg btn-primary">Просмотр</button></form></td></tr>'
            }
            div += '<tr><td>Серия диплома:</td><td>'+serial+'</td></tr>'
                +'<tr><td>Номер диплома:</td><td>'+number+'</td></tr>'
                +'<tr><td>Дата выдачи диплома:</td><td>'+StrDate($("#EduDate").val())+'</td></tr>'
                +'<tr><td>Оплата:</td><td>'+pay+'</td></tr>'
                +'<tr><td>Получение удостоверения почтой:</td><td>'+get_cert+'</td></tr>'
            if (get_cert == 'Да') {
                var addr = $('#PhysAddr').val();
                div += '<tr><td>Почтовый адрес для отправки удостоверения:</td><td>'+addr+'</td></tr>'
            }
            div += '<tr><td colspan="2"><button type="button" class="btn btn-lg btn-primary" onclick="SaveForm();">'
                +'Отправить заявку</button></td></tr></tbody></table><br><button type="button" class="btn btn-lg btn-primary" onclick="window.location.href=\'#close\'">'
                +'Закрыть</button><div class="accept_info></div>'
        }
        $('.popup_add').empty();
        $('.popup_add').append(div);
        window.location.href='#win';
    }
};
function getCookie(c_name) {
    if (document.cookie.length > 0)
    {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1)
        {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
 };
function SaveForm(){
    if (CheckForm() != false) {
        $('#CheckTable').find('tr:last').remove();
        row = '<tr><td colspan="2"><img src="/static/work/load_full.gif" style="width:10%; height:10%"></td></tr>'
        $('#CheckTable > tbody').append(row);
        var group = id_group;
        var workless = $('#job').is(":checked");
        var region = $("#SelectRegion option:selected").val();
        if ($("#SelectMo").length) {
            var mo = $("#SelectMo option:selected").val();
        } else {
            var mo = null;
        }
        if (!$('#job').is(":checked")) {
            if ($("#ManualOo").length == 0) {
                var oo = $("#Oo option:selected").val();
                var oo_new = null;
            } else {
                var oo = null;
                var oo_new = $("#ManualOo").val();
            }
            var position_cat = $("#SelectPosCat option:selected").val();
            var position = $("#SelectPos option:selected").val();
        } else {
            var oo = null;
            var oo_new = null;
            var position_cat = null;
            var position = null;
        }
        var type = $("input[name=pay]:checked").val();
        var cert_mail = $('#GetCert').is(":checked");
        if (cert_mail == true) {
            var address = $("#PhysAddr").val();
        }
        var data0 = new Object();
        data0.group = group;
        data0.workless = workless;
        data0.region = region;
        data0.mo = mo;
        data0.oo = oo;
        data0.oo_new = oo_new;
        data0.position_cat = position_cat;
        data0.position = position;
        data0.type = type;
        var text_level = $("#SelectEduLevels option:selected").text();
        var edu_level = $("#SelectEduLevels option:selected").val();
        if (text_level == 'Студент') {
            var edu_cat = $("#SelectEduCats option:selected").val();
            var edu_doc = $("#SelectStudyCert option:selected").val();
            data0.edu_level = edu_level;
            data0.edu_cat = edu_cat;
            data0.edu_doc = edu_doc;
            data0.check_surname = '';
            data0.change_surname = null;
            data0.edu_serial = '';
            data0.edu_number = '';
            data0.edu_date = null;
        } else {
            var edu_doc = $("#SelectDiploma option:selected").val();
            var check_surname = $("#InputSurname").val();
            var edu_serial = $("#InputSerial").val();
            var edu_number = $("#InputNumber").val();
            var edu_date = $("#EduDate").val();
            if ($('#SelectChangeSur').length) {
                var change_surname = $('#SelectChangeSur').val();
            } else {
                var change_surname = null;
            }
            data0.edu_level = edu_level;
            data0.edu_doc = edu_doc;
            data0.check_surname = check_surname;
            data0.change_surname = change_surname;
            data0.edu_serial = edu_serial;
            data0.edu_number = edu_number;
            data0.edu_date = edu_date;
        }
        data0.cert_mail = cert_mail;
        data0.address = address;
        $.ajax(
         {
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            type: "POST",
            url: "/student/api/new_courseform",
            data: data0,
            dataType : "json",
            success: function(result) {
                if (result.check == 'ok') {
                    $.ajax(
                     {
                        headers: { "X-CSRFToken": getCookie("csrftoken") },
                        type: "POST",
                        url: "/student/api/new_app",
                        data: {
                            group: group,
                            status: result.status
                        },
                        dataType : "json",
                        success: function(result) {
                            location.href='/student/apps?type='+result.type;
                        }
                     });
                 } else {
                    location.href='/';
                 }
            }
         });
    } else {
        $('.accept_info').append('<b style="color: red;">Не все поля анкеты заполнены</b>')
    }
};
function CheckForm(){
    $('.checkform_info').empty();
    if ($("#SelectRegion option:selected").val() == 0) {
        $('.checkform_info').append('<b style="color: red;">Выберите регион</b><br>');
        check_form = false;
        return check;
    }
    if (!$('#job').is(":checked")) {
        if ($("#SelectRegion option:selected").text() == 'Иркутская область') {
            if ($("#SelectMo option:selected").val() == 0) {
                $('.checkform_info').append('<b style="color: red;">Выберите муниципальное образование</b><br>');
                check_form = false;
            }
            if (!$("#Oo").length) {
                if ($("#ManualOo").length) {
                    if ($("#ManualOo").val()=='') {
                        $('.checkform_info').append('<b style="color: red;">Введите название организации</b><br>');
                        check_form = false;
                    }
                } else {
                    $('.checkform_info').append('<b style="color: red;">Выберите организацию из списка</b><br>');
                    check_form = false;
                }
            }
        } else {
             if ($("#ManualOo").val()=='') {
                $('.checkform_info').append('<b style="color: red;">Введите название организации</b><br>');
                check_form = false;
            }
        }
    }
    if ($("#SelectEduLevels option:selected").val() == 0) {
        $('.checkform_info').append('<b style="color: red;">Выберите уровень образования</b><br>');
        check_form = false;
    } else {
        if ($("#SelectEduLevels option:selected").text() != 'Студент') {
            if ($("#SelectPosCat option:selected").val() == 0) {
                $('.checkform_info').append('<b style="color: red;">Выберите категорию должности</b><br>');
                check_form = false;
            }
            if ($("#SelectPos option:selected").val() == 0) {
                $('.checkform_info').append('<b style="color: red;">Выберите должность</b><br>');
                check_form = false;
            }
            if (!$('#SelectDiploma').length) {
                $('.checkform_info').append('<b style="color: red;">Выберите документ диплома</b><br>');
                check_form = false;
            }
            if ($("#InputSurname").val() == '') {
                $('.checkform_info').append('<b style="color: red;">Заполните поле "Фамилия в дипломе"</b><br>');
                check_form = false;
            } else {
                check_form = CheckFileSurname();
            }
            if ($("#InputSerial").val() == '') {
                $('.checkform_info').append('<b style="color: red;">Заполните поле "Серия диплома"</b><br>');
                check_form = false;
            }
            if ($("#InputNumber").val() == '') {
                $('.checkform_info').append('<b style="color: red;">Заполните поле "Номер диплома"</b><br>');
                check_form = false;
            }
            if ($("#EduDate").val() == '') {
                $('.checkform_info').append('<b style="color: red;">Заполните поле "Дата выдачи диплома"</b><br>');
                check_form = false;
            }
        } else {
            if ($("#SelectEduCats option:selected").val() == 0) {
                $('.checkform_info').append('<b style="color: red;">Выберите категорию получаемого образования</b><br>');
                check_form = false;
            }
            if (!$("#SelectStudyCert").length) {
                $('.checkform_info').append('<b style="color: red;">Выберите документ со справкой об обучении</b><br>');
                check_form = false;
            }
        }
    }
    if ($('#GetCert').is(":checked")) {
        if ($("#PhysAddr").val() == '') {
            $('.checkform_info').append('<b style="color: red;">Заполните поле "Почтовый адрес для отправки удостоверения"</b><br>');
                check_form = false;
        }
    }
    return check_form;
};
function CheckFileSurname(){
$.ajax(
     {
        type: "GET",
        url: "/student/api/check_surname",
        dataType : "json",
        success: function(result) {
            if (result[0].surname != $('#InputSurname').val()) {
                if (!$('#SelectChangeSur').length) {
                    $('.checkform_info').append('<b style="color: red;">Выберите документ о смене фамилии</b><br>');
                    callback(false);
                }
            } else {
                callback(true);
            }
        }
    });
};