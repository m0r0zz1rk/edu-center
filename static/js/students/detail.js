function CheckExist(id) {
    $.ajax(
         {
            type: "GET",
            async: false,
            url: "/student/api/check_app",
            data: {
                id_group: id
            },
            dataType : "json",
            success: function(result) {
                res = result.length
            }
    });
    return res
}
function StrDate(str){
     var dt   = str.substring(8,10);
     var mon  = str.substring(5,7);
     var yr   = str.substring(0,4);
     return dt+'.'+mon+'.'+yr;
};
function Initial(){
    console.log(group);
    $.ajax(
     {
        type: "GET",
        url: "/student/api/detail",
        data: {
            pk: group
        },
        dataType : "json",
        beforeSend: function() {
            $('#main').empty();
            $('#main').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px'}));
        },
        success: function(result) {
            var data =result.data;
            console.log(data);
            if (data.event == null) {
                course = '<div class="add">'
                        + '<table border="0" style="width: 100%;">'
                        + '<tr><td colspan="4"><b>'+data.course.program.name+'</b></td></tr>'
                        + '<tr><td style="white-space: nowrap;"><br>Шифр группы:<br><b>'+data.code+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Тип программы:<br><b>'+data.course.program.type_dpp+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Сроки обучения:<br><b>'+StrDate(data.course.date_start)+' - '+StrDate(data.course.date_finish)+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Объем (часов):<br><b>'+data.course.program.duration+'</b></td></tr><tr>'
                        + '<td style="width: 20%;"><br>Структурное подразделение:<br><b>'+data.course.program.department+'</b></td>';
                if (data.curator != null) {
                        var str = data.curator;
                        var fio = str.substring(0, str.indexOf(':'));
                        var phone = str.substring(str.indexOf(':')+1, str.indexOf('&'));
                        var email = str.substr(str.indexOf('&')+1);
                        course += '<td style="white-space: nowrap;"><br>Руководитель группы:<br><b>'+fio+'</b></td>'
                            + '<td style="white-space: nowrap;"><br>Контактный телефон:<br><b>'+phone+'</b></td>'
                            + '<td style="white-space: nowrap;"><br>Email:<br><b>'+email+'</b></td>';
                }
                if (CheckExist(data.id) == 1) {
                        course += '</tr><tr><td colspan="4">'
                            + '<b style="color: red";>Вы уже подавали заявку на участие в этом курсе</b></td></tr></table>';
                    } else {
                        if (data.status != 'Идет регистрация') {
                            course += '</tr><tr><td colspan="4">'
                            + '<b style="color: red";>Регистрация на курс завершена</b></td></tr></table>';
                        } else {
                            course += '</tr><tr><td colspan="4">'
                            + '<form action="/student/course_reg" method="GET">'
                            + '<input type="hidden" name="group" value="'+group+'">'
                            + '<button type="submit" class="btn btn-lg btn-primary" onclick="window.location.href=\'#\'">'
                            + 'Оставить заявку</button></form></td></tr></table>';
                        }
                    }
                title = '<h2>Информация о курсе "'+data.course.program.name+'"</h2>';
                $('#main').empty();
                $('#main').append(course);
            } else {
                event = '<div class="add">'
                        + '<table border="0" style="width: 100%;">'
                        + '<tr><td colspan="4"><b>'+data.event.name+'</b></td></tr>'
                        + '<tr><td style="white-space: nowrap;"><br>Шифр группы:<br><b>'+data.code+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Тип мероприятия:<br><b>'+data.event.type+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Объем (часов):<br><b>'+data.event.duration+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Дата проведения:<br><b>'+StrDate(data.event.date_start)+'</b></td></tr><tr>'
                        + '<td style="width: 20%;"><br>Структурное подразделение:<br><b>'+data.event.department+'</b></td>';
                if (data.curator != null) {
                    var str = data.curator;
                    var fio = str.substring(0, str.indexOf(':'));
                    var phone = str.substr(str.indexOf(':')+1);
                    event += '<td style="white-space: nowrap;"><br>Руководитель группы:<br><b>'+fio+'</b></td>'
                        + '<td style="white-space: nowrap;"><br>Контактный телефон:<br><b>'+phone+'</b></td>';
                }
                if (CheckExist(data.id) == 1) {
                    event += '</tr><tr><td colspan="4">'
                        + '<b style="color: red";>Вы уже подавали заявку на участие в этом мероприятии</b></td></tr></table>';
                } else {
                    if (data.status != 'Идет регистрация') {
                        event += '</tr><tr><td colspan="4">'
                        + '<b style="color: red";>Регистрация на '+data.event.type+' завершена</b></td></tr></table>';
                    } else {
                        event += '</tr><tr><td colspan="4">'
                        + '<form action="/student/event_reg" method="GET">'
                        + '<input type="hidden" name="group" value="'+group+'">'
                        + '<button type="submit" class="btn btn-lg btn-primary" onclick="window.location.href=\'#\'">'
                        + 'Оставить заявку</button></form></td></tr></table>';
                    }
                }
            $('#main').empty();
            $('#main').append(event);
            }
        }
     });
};