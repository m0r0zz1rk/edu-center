function StrDate(str){
     var dt   = str.substring(8,10);
     var mon  = str.substring(5,7);
     var yr   = str.substring(0,4);
     return dt+'.'+mon+'.'+yr;
};
function SwitchToCourses(){
    div = '<b>Мероприятия <a href="#" onclick="Initial();"><i class="fa fa-toggle-on fa-2x"></i></a> Курсы</b>'
    $('#choose').empty();
    $('#choose').append(div);
    $('#main').empty();
    $('#main').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
    $.ajax(
     {
        type: "GET",
        url: "/student/api/archive",
        dataType : "json",
        success: function(result) {
            div = '<table class="table_crit"><thead><tr><th>Дата подачи заявки</th><th>Тип мероприятия</th><th>Название мероприятия (Объем, часов) </th>'
                + '<th>Сроки проведения</th><th>Скан удостоверения</th></tr></thead><tbody>'
            $.each(result, function(index, data) {
                if (data.group.event == null) {
                    div += '<tr><td>'+StrDate(data.date_create)+'</td><td>'+data.group.course.program.type_dpp+'</td><td>'+data.group.course.program.name+' ('+data.group.course.program.duration+')</td>'
                    +'<td>'+StrDate(data.group.course.date_start)+' - '+StrDate(data.group.course.date_finish)+'</td>'
                    +'<td><button type="button" class="btn btn-lg btn-primary" onclick="window.open(\'/doc_view/?doc_id='+data.certificate_id+'\');">'
                    +'Просмотр</button></td></tr>';
                }
            });
            div += '</tbody></table>'
            $('#main').empty();
            $('#main').append(div);
        }
     });
};
function Initial(){
    div = '<b>Мероприятия <a href="#" onclick="SwitchToCourses();"><i class="fa fa-toggle-off fa-2x"></i></a> Курсы</b>'
    $('#choose').empty();
    $('#choose').append(div);
    $('#main').empty();
    $('#main').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
    $.ajax(
     {
        type: "GET",
        url: "/student/api/archive",
        dataType : "json",
        success: function(result) {
            div = '<table class="table_crit"><thead><tr><th>Дата подачи заявки</th><th>Тип мероприятия</th><th>Название мероприятия (Объем, часов)</th>'
                + '<th>Сроки проведения</th></tr></thead><tbody>'
            $.each(result, function(index, data) {
                if (data.group.course == null) {
                    div += '<tr><td>'+StrDate(data.date_create)+'</td><td>'+data.group.event.type+'</td><td>'+data.group.event.name+' ('+data.group.event.duration+')</td>'
                    +'<td>'+StrDate(data.group.event.date_start)+'<br>-<br>'+StrDate(data.group.event.date_finish)+'</td></tr>';
                }
            });
            div += '</tbody></table>'
            $('#main').empty();
            $('#main').append(div);
        }
     });
};