$(function() {
    $("input[name='select']").change(function(){
        $('.parameters').empty();
        $('.parameters').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
        if (this.value == 'dpp') {
            div = '<b style="font-size: 14pt">Фомирование перечня дополнительных профессиональных программ <br>(Учебная деятельность -> Перечень ДПП)</b>'
                +'<form method="GET"><b style="font-size: 14pt">Год <a href="#" onclick="SwitchToMonthDPP();">'
                +'<i class="fa fa-toggle-off fa-2x"></i></a> Месяц</b><br><br>'
                +'<input type="number" class="form-control w-25 m-auto" min="2022" placeholder="Введите год" class="form-control" name="dpp_year" required>'
                +'<br><button type="submit" class="m-auto btn btn-lg btn-primary">Сформировать перечень</button></form>'
            $('.parameters').empty();
            $('.parameters').append(div);
        } else if (this.value == 'service_sch') {
            div = '<b style="font-size: 14pt"> Формирование графика оказания платных образовательных услуг<br> за определенный период:</b><br><br>'
                +'<form method="GET"><b style="font-size: 14pt">Год <a href="#" onclick="SwitchToMonth();">'
                +'<i class="fa fa-toggle-off fa-2x"></i></a> Месяц</b><br><br>'
                +'<input type="number" class="form-control w-25 m-auto" min="2022" placeholder="Введите год" class="form-control" name="sch_year" required>'
                +'<br><button type="submit" class="m-auto btn btn-lg btn-primary">Сформировать отчет</button></form>'
            $('.parameters').empty();
            $('.parameters').append(div);
        } else if (this.value == 'pk-1') {
            $.ajax(
             {
                type: "GET",
                url: "/centre/reports",
                data: {
                    user_pk1: user_id,
                },
                dataType : "json",
                success: function(result) {
                    div = '<b style="font-size: 14pt">Фомирование отчета со сведениями о деятельности организации,<br> осуществляющей образовательную деятельность '
                        +'по<br>дополнительным профессиональным программам:</b><br><br>'
                        +'<form method="GET">'
                        +'<input type="number" class="form-control w-25 m-auto" min="2022" placeholder="Введите год" class="form-control" name="pk-1" required>'
                        +'<br><button type="submit" class="m-auto btn btn-lg btn-primary">Сформировать отчет</button></form><br>'
                        +'<table class="table_crit"><thead><tr><th colspan="3">Крайний запрос на формирование отчета</th></tr><tr><th>'
                        +'Запрос создан</th><th>Отчет сформирован</th><th>'
                        +'Отчет</th></tr></thead><tbody><tr>'
                    if (result.no_reports) {
                        div += '<td colspan="3">Записей не найдено</td>'
                    } else {
                        div += '<td>'+result.date_start+'</td><td>'+result.date_finish+'</td>'
                        if (result.id_report == '-') {
                            div += '<td>-</td>'
                        } else {
                            div += '<td><form method="GET"><input type="hidden" value="'+result.id_report+'"'
                                +' name="get_report"><button type="submit" class="m-auto btn btn-lg btn-primary">'
                                +'Скачать</button></form></td>'
                        }
                    }
                    div += '</tr></tbody></table>'
                    $('.parameters').empty();
                    $('.parameters').append(div);
                }
            });
        } else {
            $.ajax(
             {
                type: "GET",
                url: "/centre/reports",
                data: {
                    fis_frdo: user_id,
                },
                dataType : "json",
                success: function(result) {
                    div = '<b style="font-size: 14pt">Фомирование отчета со сведениями о документах об образовании,<br> выданных ГАУ ИО ЦОПМКиМКО:</b><br><br>'
                            +'<select class="form-control w-25 m-auto" style="text-align: center;" id="frdo_month">'
                            +'<option value="1">Январь</option>'
                            +'<option value="2">Февраль</option>'
                            +'<option value="3">Март</option>'
                            +'<option value="4">Апрель</option>'
                            +'<option value="5">Май</option>'
                            +'<option value="6">Июнь</option>'
                            +'<option value="7">Июль</option>'
                            +'<option value="8">Август</option>'
                            +'<option value="9">Сентябрь</option>'
                            +'<option value="10">Октябрь</option>'
                            +'<option value="11">Ноябрь</option>'
                            +'<option value="12">Декабрь</option>'
                            +'</select><br>'
                            +'<button type="button" class="m-auto btn btn-lg btn-primary" onclick="FrdoGroups();window.location.href=\'#win\';">Выбрать группы</button><br>'
                            +'<br><table class="table_crit"><thead><tr><th colspan="3">Крайний запрос на формирование отчета</th></tr><tr><th>'
                            +'Запрос создан</th><th>Отчет сформирован</th><th>'
                            +'Отчет</th></tr></thead><tbody><tr>'
                    if (result.no_reports) {
                        div += '<td colspan="3">Записей не найдено</td>'
                    } else {
                        div += '<td>'+result.date_start+'</td><td>'+result.date_finish+'</td>'
                        if (result.id_report == '-') {
                            div += '<td>-</td>'
                        } else {
                            div += '<td><form method="GET"><input type="hidden" value="'+result.id_report+'"'
                                +' name="get_report"><button type="submit" class="m-auto btn btn-lg btn-primary">'
                                +'Скачать</button></form></td>'
                        }
                    }
                    div += '</tr></tbody></table>'
                    $('.parameters').empty();
                    $('.parameters').append(div);
            }
            });
        }
    });
});
function FrdoGroups() {
    $('.popup').empty();
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({height: '5vh', width: '5vh', margin: '0 -64px'}));
    var mnth = $('#frdo_month').val();
     $.ajax(
         {
            type: "GET",
            url: "/centre/reports",
            data: {
                groups_frdo: mnth,
            },
            dataType : "json",
            success: function(result) {
                modal = '<center><h3>Выберите группы для формирования отчета</h3></center>'
                    + '<form method="POST"><input type="hidden" name="csrfmiddlewaretoken" value="'+getCookie('csrftoken')+'"><input type="hidden" name="get_frdo" value="yes">'
                    + '<table class="table_crit" id="OosTable">'
                    + '<thead><th>Шифр группы</th><th>Название мероприятия</th>'
                    + '<th>Сроки проведения</th><th>Выбор</th></thead><tbody>'
                if (result.no_groups) {
                    modal += '<tr><td colspan="4" style="text-align: center;"><b style="color: red;">Группы не найдены</b></td></tr></tbody></table><br>'
                        + '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                        + 'Закрыть</button>'
                } else {
                    $.each(result.groups, function(index, data){
                    modal += '<tr><td style="white-space: nowrap;">'+data[0]+'</td><td>'+data[1]+'</td><td style="white-space: nowrap;">'+data[2]+'</td>'
                        + '<td><input type="checkbox" name="ChoosenGroups" value="'+index+'"></td></tr>'
                    });
                    modal += '<tr><td colspan="4"><button type="submit" class="m-auto btn btn-lg btn-primary">Сформировать отчет</button></td></tr></tbody></table><br>'
                        + '<button type="button" class="m-auto btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                        + 'Закрыть</button>'
                }
                $('.popup').empty();
                $('.popup').append(modal);
            }
        });
};
function SwitchToMonth(){
   div = '<b style="font-size: 14pt"> Формирование графика оказания платных образовательных услуг<br> за определенный период:</b><br><br>'
    +'<form method="GET"><b style="font-size: 14pt">Год <a href="#" onclick="SwitchToYear();">'
    +'<i class="fa fa-toggle-on fa-2x"></i></a> Месяц</b><br><br>'
    +'<td style="border: 0;" colspan="2">'
    +'<select class="form-control w-25 m-auto" style="text-align: center;" name="sch_month">'
    +'<option value="1">Январь</option>'
    +'<option value="2">Февраль</option>'
    +'<option value="3">Март</option>'
    +'<option value="4">Апрель</option>'
    +'<option value="5">Май</option>'
    +'<option value="6">Июнь</option>'
    +'<option value="7">Июль</option>'
    +'<option value="8">Август</option>'
    +'<option value="9">Сентябрь</option>'
    +'<option value="10">Октябрь</option>'
    +'<option value="11">Ноябрь</option>'
    +'<option value="12">Декабрь</option>'
    +'</select><br>'
    +'<button type="submit" class="m-auto btn btn-lg btn-primary">Сформировать отчет</button></form>'
    $('.parameters').empty();
    $('.parameters').append(div);
};
function SwitchToMonthDPP(){
   div = '<b style="font-size: 14pt">Фомирование перечня дополнительных профессиональных программ <br>(Учебная деятельность -> Перечень ДПП)</b>'
    +'<form method="GET"><b style="font-size: 14pt">Год <a href="#" onclick="window.location.reload();">'
    +'<i class="fa fa-toggle-on fa-2x"></i></a> Месяц</b><br><br>'
    +'<td style="border: 0;" colspan="2">'
    +'<select class="form-control w-25 m-auto" style="text-align: center;" name="dpp_month">'
    +'<option value="1">Январь</option>'
    +'<option value="2">Февраль</option>'
    +'<option value="3">Март</option>'
    +'<option value="4">Апрель</option>'
    +'<option value="5">Май</option>'
    +'<option value="6">Июнь</option>'
    +'<option value="7">Июль</option>'
    +'<option value="8">Август</option>'
    +'<option value="9">Сентябрь</option>'
    +'<option value="10">Октябрь</option>'
    +'<option value="11">Ноябрь</option>'
    +'<option value="12">Декабрь</option>'
    +'</select><br>'
    +'<button type="submit" class="m-auto btn btn-lg btn-primary">Сформировать перечень</button></form>'
    $('.parameters').empty();
    $('.parameters').append(div);
};
function SwitchToYear() {
    div = '<b style="font-size: 14pt"> Формирование графика оказания платных образовательных услуг<br> за определенный период:</b><br><br>'
        +'<form method="GET"><b style="font-size: 14pt">Год <a href="#" onclick="SwitchToMonth();">'
        +'<i class="fa fa-toggle-off fa-2x"></i></a> Месяц</b><br><br>'
        +'<input type="number" class="form-control w-25 m-auto" min="2022" placeholder="Введите год" class="form-control" name="sch_year" required>'
        +'<br><button type="submit" class="m-auto btn btn-lg btn-primary">Сформировать отчет</button></form>'
    $('.parameters').empty();
    $('.parameters').append(div);
};
function getCookie(c_name)
{
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