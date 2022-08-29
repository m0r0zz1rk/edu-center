function CheckboxJob() {
    if ($('#job').is(":checked")) {
        $('#tr_oo').css('visibility', 'collapse');
        if ($('#ManualO').length) {
            $('#ManualO').val();
            $('#ManualO').prop('disabled', false);
            $('#OoButton').attr('onclick', 'SaveManualOo();');
            $('#OoButton').text('Сохранить организацию');
            $('#SelectRegion option[value="0"]').attr("disabled", false);
            $('#SelectRegion option[value="0"]').prop('selected', true);
        }
        $('#tr_radio').css('visibility', 'collapse');
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
        $('#MoDiv').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
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
            $('#tr_radio').css('visibility', 'visible');
            $('#tr_checkbutton').css('visibility', 'visible');
        }
    }
};
function SelectMos() {
    $('#SelectMo option[value="0"]').remove();
    if (!$('#job').is(":checked")) {
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
                $('#popup_add').empty();
                $('#popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
                modal = '<table border="0" style="width: 60vw;"><tr><td style="width: 50%; align: center;"><button type="button" class="m-auto btn btn-lg btn-primary" onclick="ManualOo();window.location.href=\'#close\';">'
                    + 'Моей организации нет в списке</button></td><td style="align: center;"><button type="button" class="m-auto w-100 btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
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
                    $('#tr_oo').css('visibility', 'visible');
                }
            }
         });
     } else {
       $('#tr_radio').css('visibility', 'visible');
        $('#tr_checkbutton').css('visibility', 'visible');
     }
};
function SearchOo() {
    $('#OosTable').find("tr:gt(0)").remove();
    row = '<tr><td colspan="5"><img src="/static/work/load_full.gif" style="width:10vw; height:10vw"></td></tr>';
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
   $('#oo_div').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
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
                + '</select><br><button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#win\'">'
                + 'Изменить орагнизацию</button>'
            $('#oo_div').empty();
            $('#oo_div').append(div);
        }
    });
    if ($('#job').is(":checked")) {
        $('#tr_radio').css('visibility', 'visible');
        $('#tr_checkbutton').css('visibility', 'visible');
    } else {
        $('#tr_poscat').css('visibility', 'visible');
        PosCatData();
    }
};
function ManualOo(){
    $('#tr_oo').css('visibility', 'visible');
    $('#oo_div').empty();
    $('#oo_div').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
    div = '<textarea class="form-control" id="ManualO" placeholder="Впишите название своей организации..." name="OoManual" required></textarea><br>'
        + '<button type="button" id="OoButton" class="m-auto w-50 btn btn-lg btn-primary" onclick="SaveManualOo();">'
        + 'Сохранить организацию</button>'
    $('#oo_div').empty();
    $('#oo_div').append(div);
};
function SaveManualOo(){
    if ($('#ManualO').val().length == 0) {
        $('#oo_div').append('<br><b id="OoError" style="color: red;">Заполните название организации</b>');
    } else {
        if ($('#OoError').length) {
            $('#OoError').remove();
        }
        $('#ManualO').prop('disabled', true);
        if ($("#SelectRegion option:selected").text() == 'Иркутская область') {
            $('#OoButton').attr('onclick', 'window.location.href=\'#win\';');
        } else {
            $('#OoButton').attr('onclick', 'ManualOo();');
        }
        $('#OoButton').text('Изменить организацию');
        if ($('#job').is(":checked")) {
            $('#tr_radio').css('visibility', 'visible');
            $('#tr_checkbutton').css('visibility', 'visible');
        } else {
            $('#tr_poscat').css('visibility', 'visible');
            PosCatData();
    }
    }
};
function PosCatData(){
    $('#tr_poscat').css('visibility', 'visible');
    $('#oo_poscat').empty();
    $('#oo_poscat').append($('<img src="/static/work/load_full.gif">').css({width: '5vw', height: '5vw', margin: '0 -64px'}));
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
    $('#oo_pos').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
    var id = $('#SelectPosCat').val();
    if (id != 0) {
        $.ajax(
         {
            type: "GET",
            url: "/student/api/positions",
            data:{
                id_cat: id
            },
            dataType : "json",
            success: function(result) {
                select = '<select class="form-control" id="SelectPos" style="text-align: center;" onchange="SelectP();" name="pos" required>'
                    +'<option value="0">Выберите должность</option>'
                $.each(result, function(index, data) {
                    select += '<option value="'+data.id+'">'+data.name+'</option>'
                });
                select += '</select>'
                $('#oo_pos').empty();
                $('#oo_pos').append(select);
                $('#tr_radio').css('visibility', 'visible');
                $('#tr_checkbutton').css('visibility', 'visible');
            }
         });
    }
};
function SelectP(){
    $('#SelectPos option[value="0"]').remove();
};
function AutoCompleteFormButton(){
  $.ajax(
     {
        type: "GET",
        url: "/student/api/getlast_event",
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
        url: "/student/api/getlast_event",
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
           if (result[0].type == true) {
            $('input:radio[name="pay"]').filter('[value="True"]').attr('checked', true);
           } else {
            $('input:radio[name="pay"]').filter('[value="False"]').attr('checked', true);
           }
           $('#tr_radio').css('visibility', 'visible');
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
            $('#RegionDiv').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
        },
        success: function(result) {
            AutoCompleteFormButton();
            putRegionsData(result);
        }
     });
};
function putRegionsData(result) {
    function StrDate(str){
     var dt   = str.substring(8,10);
     var mon  = str.substring(5,7);
     var yr   = str.substring(0,4);
     return dt+'.'+mon+'.'+yr;
    }
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
    if (CheckForm() == true) {
        $('.popup_add').empty();
        $('.popup_add').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
        var region = $("#SelectRegion option:selected").text();
        if ($("SelectMo").length) {
            var mo = $("#SelectMo option:selected").text();
        }
        if (!$('#job').is(":checked")) {
            if ($("#ManualO").length == 0) {
                var oo = $("#Oo option:selected").text();
            } else {
                var oo = $("#ManualO").val();
            }
            var pos_cat = $("#SelectPosCat option:selected").text();
            var pos = $("#SelectPos option:selected").text();
        } else {
            var oo = 'Без работы';
            var pos_cat = 'Без работы';
            var pos = 'Без работы';
        }
        if ($('input[name="pay"]:checked').val() == 'True') {
            var pay = 'Физическое лицо';
        } else {
            var pay = 'Юридическое лицо';
        }
        div = '<table class="table_crit" id="CheckTable" style="width: 65vw;"><thead><tr><th colspan="2">Проверьте правильность заполнения данных'
            + '</th></tr></thead><tbody><tr></tr><tr><td>Регион:</td><td>'+region+'</td></tr><tr><td>';
        if ($("SelectMo").length) {
            dvi += 'Муниципальное образование:</td><td>'+mo+'</td></tr><tr><td>';
        }
        div += 'Организация:</td><td>'
        if (oo == null) {
           div += 'Не выбрана'
        } else {
            div += oo
        }
        div += '</td></tr><tr><td>Категория должности:</td><td>'+pos_cat+'</td></tr><tr><td>Должность:</td><td>'
        div += pos+'</td></tr><tr><td>Оплата:</td><td>'+pay+'</td></tr><tr><td colspan="2">'
        div += '<button type="button" class="btn btn-lg btn-primary" onclick="SaveForm();">'
        div += 'Отправить заявку</button></td></tr></tbody></table><br><button type="button" class="btn btn-lg btn-primary" onclick="window.location.href=\'#close\'">'
        div += 'Закрыть</button><div class="accept_info"></div>'
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
    if (CheckForm() == false) {
        $('.accept_info').append('<b style="color: red;">Не все поля анкеты заполнены</b>')
    } else {
        $('#CheckTable').find('tr:last').remove();
        row = '<tr><td colspan="2"><img src="/static/work/load_full.gif" style="width:10vw; height:10vw"></td></tr>'
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
            if ($("#ManualO").length == 0) {
                var oo = $("#Oo option:selected").val();
                var oo_new = null;
            } else {
                var oo = null;
                var oo_new = $("#ManualO").val();
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
        $.ajax(
         {
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            type: "POST",
            url: "/student/api/new_eventform",
            data: {
                group: group,
                workless: workless,
                region: region,
                mo: mo,
                oo: oo,
                oo_new: oo_new,
                position_cat: position_cat,
                position: position,
                type: type
            },
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
    }
};
function CheckForm(){
    check = true;
    $('.checkform_info').empty();
    if ($("#SelectRegion option:selected").val() == 0) {
        $('.checkform_info').append('<b style="color: red;">Выберите регион</b><br>');
        check = false;
        return check;
    }
    if (!$('#job').is(":checked")) {
        if ($("#SelectRegion option:selected").text() == 'Иркутская область') {
            if ($("#SelectMo option:selected").val() == 0) {
                $('.checkform_info').append('<b style="color: red;">Выберите муниципальное образование</b><br>');
                check = false;
            }
            if (!$("#Oo").length) {
                if ($("#ManualO").length) {
                    if ($("#ManualO").val()=='') {
                        $('.checkform_info').append('<b style="color: red;">Введите название организации</b><br>');
                        check = false;
                    }
                } else {
                    $('.checkform_info').append('<b style="color: red;">Выберите организацию из списка</b><br>');
                    check = false;
                }
            }
        } else {
             if ($("#ManualO").val()=='') {
                $('.checkform_info').append('<b style="color: red;">Введите название организации</b><br>');
                check = false;
            }
        }
        if ($("#SelectPosCat option:selected").val() == 0) {
            $('.checkform_info').append('<b style="color: red;">Выберите категорию должности</b><br>');
            check = false;
        }
        if ($("#SelectPos option:selected").val() == 0) {
            $('.checkform_info').append('<b style="color: red;">Выберите должность</b><br>');
            check = false;
        }
    }
    return check;
};