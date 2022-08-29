function CourseDate(str){
 // str format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
 var dt   = parseInt(str.substring(8,10));
 var mon  = parseInt(str.substring(5,7));
 var yr   = parseInt(str.substring(0,4));
 var date = new Date(yr, mon, dt);
 return date;
}
function compareDate(str){
 // str format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
 var dt   = parseInt(str.substring(8,10));
 var mon  = parseInt(str.substring(5,7));
 var yr   = parseInt(str.substring(0,4));
 var hrs = parseInt(str.substring(11,13));
 var mns = parseInt(str.substring(14,16))
 var date = new Date(yr, mon, dt, hrs, mns);
 return date;
}
function RefreshForm() {
    $("[id^=tr_]").css('visibility', 'collapse');
    $(".err_timestart").empty();
    $(".err_timefinish").empty();
    $("#timestart").val('');
    $("#timefinish").val('');
    $("#LectureHours").val('');
    $("#PracticeHours").val('');
    $("#IndividualHours").val('');
    $("#TeachersList").val('');
    $("#timestart").prop('readonly',false);
    $("#TeachersList").prop('readonly',true);
    $("#butt").attr('disabled',true);
    $('#SelectThemes option:not(:selected)').attr('disabled', false);
    $("#SelectThemes option:selected").prop("selected", false);
    $("#SelectThemes option:first").prop("selected", "selected");
};
function CheckTS() {
    $('#StartErr').css('visibility', 'visible');
    $('.err_timestart').empty();
    $('.err_timestart').append($("<img src='/static/work/load_full.gif'>").css({width: '4vw', height: '4vw'}));
    var time = $('#LessonDay').val()+' '+$('#timestart').val();
     $.ajax(
         {
            type: "GET",
            url: "/dep/study/schedule/course_lessons_"+group_id,
            data:{
                timestart: time
            },
            success: function(data) {
                $('.err_timestart').empty();
                if (data['check_timestart'] == true) {
                    if (data['check_break'] == true) {
                        if (data['check_lunch'] == true) {
                            $('.err_timestart').css('color', 'green');
                            $('.err_timestart').text('Время начала занятия доступно');
                            $('#tr_timefinish').css('visibility', 'visible');
                            $('#timefinish').prop('required',true);
                            $('#timefinish').prop('readonly',false);
                        } else {
                            $('.err_timestart').css('color', 'red');
                            $('.err_timestart').text('Необходим обеденный перерыв на 30 минут (До указанного времени проведено 4 академических часа)');
                            $('#tr_timefinish').css('visibility', 'collapse');
                            $('#timefinish').prop('required',false);
                            $('#timefinish').prop('readonly',true);
                        }
                    } else {
                        $('.err_timestart').css('color', 'red');
                        $('.err_timestart').text('Минимальный переыв между занятием продолжительностью 2 академ. часа - 10 минут');
                        $('#tr_timefinish').css('visibility', 'collapse');
                        $('#timefinish').prop('required',false);
                        $('#timefinish').prop('readonly',true);
                    }
                } else {
                    $('.err_timestart').css('color', 'orange');
                    $('.err_timestart').text('Время совпадает с другим занятием, занятия будут смещены');
                    $('#tr_timefinish').css('visibility', 'visible');
                    $('#timefinish').prop('required',true);
                    $('#timefinish').prop('readonly',false);
                }
            }
    });
};
function CheckTF(){
    var start = $('#timestart').val();
    timestart = compareDate($('#LessonDay').val()+' '+start)
    var time = $('#timefinish').val();
    timefinish = compareDate($('#LessonDay').val()+' '+time);
    if (timestart > timefinish) {
        $('.err_timefinish').css('color', 'red');
        $('.err_timefinish').text('Окончание занятие должно быть позже его начала');
        $('#tr_theme').css('visibility', 'collapse');
        $('#SelectThemes').prop('required',false);
        $('#SelectThemes').prop('readonly',true);
    } else {
        $('#timestart').attr('readonly', 'true');
         $.ajax(
             {
                type: "GET",
                url: "/dep/study/schedule/course_lessons_"+group_id,
                data:{
                    timefinish: $('#LessonDay').val()+' '+time
                },
                beforeSend: function() {
                    $('.err_timefinish').text('');
                    $('.err_timefinish').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));
                },
                success: function(data) {
                    $('.err_timefinish').empty();
                    if (data['check_timefinish'] == true) {
                        $('.err_timefinish').css('color', 'green');
                        $('.err_timefinish').text('Время окончания занятия свободно');
                        $('#tr_theme').css('visibility', 'visible');
                        $('#SelectThemes').prop('required',true);
                        $.ajax(
                            {
                                type: "GET",
                                url: "/dep/study/schedule/course_lessons_"+group_id,
                                data:{
                                    get_themes: 'yes'
                                },
                                success: function (data) {
                                    $.each(data.themes, function(i, element) {
                                        $('#SelectThemes').append($('<option>', {
                                            value: element[0],
                                            text: element[1]
                                        }));
                                    });
                                }
                        });
                    } else {
                        $('.err_timefinish').css('color', 'red');
                        $('.err_timefinish').text('Время совпадает с другим занятием');
                        $('#tr_theme').css('visibility', 'collapse');
                        $('#SelectThemes').prop('required',false);
                    }
                }
         });
    }
};
function SelectTh(){
    $('.choose_teach').empty();
    var theme = $('#SelectThemes').val();
    $.ajax(
         {
            type: "GET",
            url: "/dep/study/schedule/course_lessons_"+group_id,
            data:{
                theme_id: theme
            },
            beforeSend: function() {
                $('.err_theme').text('');
                $('.err_theme').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));;
            },
            success: function(data) {
                $('.err_theme').empty();
                var l = data['lecture'];
                var p = data['practice'];
                var t = data['trainee'];
                var i = data['individual'];
                $('#tr_lecture').css('visibility', 'visible');
                $('#tr_practice').css('visibility', 'visible');
                $('#tr_trainee').css('visibility', 'visible');
                $('#tr_individ').css('visibility', 'visible');
                $('#LectureHours').val('0');
                $('#PracticeHours').val('0');
                $('#TraineeHours').val('0');
                $('#IndividualHours').val('0');
                if (l > 0) {
                    $('.info_lecture').css('color', 'black');
                    $('.info_lecture').text('Лекционных часов (осталось: '+String(l)+')')
                    $('#LectureHours').prop('required',true);
                    $('#LectureHours').prop('readonly',false);
                    $('#LectureHours').attr({
                        "max": l,
                        "min": 0
                    });
                } else {
                    $('.info_lecture').css('color', 'red');
                    $('.info_lecture').text('Нет свободных леционных часов');
                    $('#LectureHours').prop('required',false);
                    $('#LectureHours').prop('readonly',true);
                }
                if (p > 0) {
                    $('.info_practice').css('color', 'black');
                    $('.info_practice').text('Часов практики (осталось: '+String(p)+')')
                    $('#PracticeHours').prop('required',true);
                    $('#PracticeHours').prop('readonly',false);
                    $('#PracticeHours').attr({
                        "max": p,
                        "min": 0
                    });
                } else {
                    $('.info_practice').css('color', 'red');
                    $('.info_practice').text('Нет свободных часов практики');
                    $('#PracticeHours').prop('required',false);
                    $('#PracticeHours').prop('readonly',true);
                }
                if (t > 0) {
                    $('.info_trainee').css('color', 'black');
                    $('.info_trainee').text('Часов стажировок (осталось: '+String(t)+')')
                    $('#TraineeHours').prop('required',true);
                    $('#TraineeHours').prop('readonly',false);
                    $('#TraineeHours').attr({
                        "max": t,
                        "min": 0
                    });
                } else {
                    $('.info_trainee').css('color', 'red');
                    $('.info_trainee').text('Нет свободных часов стажировок');
                    $('#TraineeHours').prop('required',false);
                    $('#TraineeHours').prop('readonly',true);
                }
                if (i > 0) {
                    $('.info_individ').css('color', 'black');
                    $('.info_individ').text('Индивидуальных часов (осталось: '+String(i)+')')
                    $('#IndividualHours').prop('required',true);
                    $('#IndividualHours').prop('readonly',false);
                    $('#IndividualHours').attr({
                        "max": i,
                        "min": 0
                    });
                } else {
                    $('.info_individ').css('color', 'red');
                    $('.info_individ').text('Нет свободных индивидуальных часов');
                    $('#IndividualHours').prop('required',false);
                    $('#IndividualHours').prop('readonly',true);
                }
                if (l == 0 && p == 0 && i == 0 && t == 0) {
                    $('#tr_teacher').css('visibility', 'collapse');
                    $('#TeachersList').prop('required',false);
                    $('#TeachersList').prop('readonly',true);
                    $('#tr_noway').css('visibility', 'visible');
                    $('.noway').css('color', 'red');
                    $('.noway').text('Нет свободных часов для назначения');
                } else {
                    $('#tr_noway').css('visibility', 'collapse');
                    $('#tr_teacher').css('visibility', 'visible');
                    $('.choose_teach').empty();
                    div = '<input type="text" id="TeachersList" list="teachers" Placeholder="Начните вводить имя..."'
                        +' name="teacher" class="form-control" onchange="TeacherChoose();"><datalist id=\'teachers\'>';
                    $.each(data.list_t, function(id, t){
                        div += '<option value="'+t+'">';
                    });
                    div += '</datalist>';
                    $('.choose_teach').append(div);
                }
            }
    });
};
function LectureH(){
  $('#timefinish').attr('readonly', 'true');
  var max = parseInt($('#LectureHours').attr('max'));
  var min = parseInt($('#LectureHours').attr('min'));
  if ($('#LectureHours').val() > max)
  {
      $('#LectureHours').val(max);
  }
  else if ($('#LectureHours').val() < min)
  {
      $('#LectureHours').val(min);
  }
  $('#SelectThemes option:not(:selected)').attr('disabled', true);
};
function PracticeH(){
  $('#timefinish').attr('readonly', 'true');
  var max = parseInt($('#PracticeHours').attr('max'));
  var min = parseInt($('#PracticeHours').attr('min'));
  if ($('#PracticeHours').val() > max)
  {
      $('#PracticeHours').val(max);
  }
  else if ($('#PracticeHours').val() < min)
  {
      $('#PracticeHours').val(min);
  }
  $('#SelectThemes option:not(:selected)').attr('disabled', true);
};
function TraineeH(){
  $('#timefinish').attr('readonly', 'true');
  var max = parseInt($('#TraineeHours').attr('max'));
  var min = parseInt($('#TraineeHours').attr('min'));
  if ($('#TraineeHours').val() > max)
  {
      $('#TraineeHours').val(max);
  }
  else if ($('#TraineeHours').val() < min)
  {
      $('#TraineeHours').val(min);
  }
  $('#SelectThemes option:not(:selected)').attr('disabled', true);
};
function IndividualH(){
  $('#timefinish').attr('readonly', 'true');
  var max = parseInt($('#IndividualHours').attr('max'));
  var min = parseInt($('#IndividualHours').attr('min'));
  if ($('#IndividualHours').val() > max)
  {
      $('#IndividualHours').val(max);
  }
  else if ($('#IndividualHours').val() < min)
  {
      $('#IndividualHours').val(min);
  }
  $('#SelectThemes option:not(:selected)').attr('disabled', true);
};
function TeacherChoose(){
    $('#LectureHours').attr('readonly', 'true');
    $('#PracticeHours').attr('readonly', 'true');
    $('#TraineeHours').attr('readonly', 'true');
    $('#IndividualHours').attr('readonly', 'true');
    var teacher = $('#TeachersList').val();
    id_teacher = teacher.substring(teacher.indexOf(':')+1, teacher.indexOf(')'));
    $.ajax(
         {
            type: "GET",
            url: "/dep/study/schedule/course_lessons_"+group_id,
            data:{
                id_teach: id_teacher,
                time_start: $('#LessonDay').val()+' '+$('#timestart').val(),
                time_finish: $('#LessonDay').val()+' '+$('#timefinish').val(),
            },
            beforeSend: function() {
                $('.err_teach').text('');
                $('.err_teach').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));;
            },
            success: function(data) {
                $('.err_teach').empty();
                $('#tr_teacherinfo').css('visibility', 'visible');
                var fio = data['fio'];
                var email = data['email'];
                var phone = data['phone'];
                if (data['freetime'] == true) {
                    $('.teacherinfo').html('ФИО: '+String(fio)+'<br>Почта: '+email+'<br>Телефон: '+phone+'<br><font color="green">Преподаватель свободен</green>');
                    $('#tr_formbutton').css('visibility', 'visible');
                    $('#butt').attr('disabled', false);
                } else {
                    $('.teacherinfo').html('ФИО: '+String(fio)+'<br>Почта: '+email+'<br>Телефон: '+phone+'<br><font color="red">Преподаватель занят</red>');
                    $('#tr_formbutton').css('visibility', 'collapse');
                    $('#butt').attr('disabled', true);
                }
            }
    });
};
function ChangeStudyForm(group_id) {
    $('#stform_info').empty();
    $('#stform_info').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
    var value = $('#StudyFormSelect').val();
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/schedule/course_lessons_"+group_id,
        data: {
            form_study: value,
            group: group_id
        },
        dataType : "json",
        success: function(result) {
            $('#stform_info').empty();
            $('#stform_info').html('<b style="color: green; margin: 0 auto;">Форма обучения успешно изменена</b>')
        }
    });
};
function GenerationForm(date){
    $('#generate').empty();
    $('#generate').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
    div = '<center><h3 style="margin:0 auto;">Генерация шаблона расписания на основе КУГ</h2><b style="color:red">Внимание!</b><b> При генерации нового шаблона расписания'
        +' все введеные ранее занятия выбранного дня будут безвозвратно удалены!</b></center><table class="table_crit"><thead><tr><th colspan="2">'
        +'Заполните необходимую информацию для запуска процесса генерации шаблона расписания на выбранный день<input type="hidden" name="generate" value="yes"></th></tr></thead><tbody><tr><td>'
        +'Дата занятий:</td><td>'
        +'<input type="date" class="form-control" style="text-align: center;" id="Gen_Day" value="'+date+'" readonly></td></tr><tr><td>Время занятий<br> '
        +'(Время начала первого занятия, в формате: ЧЧ:ММ):</td><td><input type="text" class="form-control" style="text-align: center;" id="Gen_TS" name="time_start" required></td></tr><tr><td>'
        +'Количество академических часов<br>(максимальное количество часов в день - 8):</td><td><input type="number" style="text-align: center;" class="form-control" id="Gen_Count" '
        +'max="8" min="1" required></td></tr>'
        +'<tr><td colspan="2"><button type="button" class=" btn btn-lg btn-primary" '
        +'onclick="if (confirm(\'Вы действительно хотите сгенерировать расписание?\')){PlanningLessons(\''+date+'\');}">'
        +'Сгенерировать</button></td></tr></tbody></table><button type="button" class=" btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
        +'Закрыть</button>'
    $('#generate').empty();
    $('#generate').append(div);
    addGenMask();
};
function PlanningLessons(date){
    $('generate').css('width', '80vw');
    var ts = $('#Gen_Day').val()+' '+$('#Gen_TS').val();
    var count = $('#Gen_Count').val();
    $('#generate').empty();
    $('#generate').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/schedule/course_lessons_"+group_id,
        data: {
            generate: ts,
            count: count
        },
        dataType : "json",
        success: function(result) {
            div = '<h4>Укажите параметры каждого академического часа</h4><br><table class="table_crit"><thead><tr><th>'
                +'Начало</th><th>Окончание</th><th>Тема</th><th>Тип занятия</th><th>ДОТ</th><th>Форма контроля</th>'
                +'<th>Преподаватель</th></tr></thead><tbody>'
            $.each(result.lessons, function(id, lesson){
                div += '<tr><td>'+lesson[1]+'</td><td>'+lesson[2]+'</td><td><input type="text" id="theme_'+lesson[0]+'" list="themes" Placeholder="Начните вводить имя..."'
                    +'class="form-control" onchange="GetThemeChoose(\''+lesson[0]+'\');"><datalist id=\'themes\'>'
                    $.each(result.themes, function(id, theme) {
                        if (theme[2] != 0) {
                            div += '<option value="'+theme[1]+'">'
                        }
                    });
                div += '</datalist><div id="theme_info_'+lesson[0]+'"></div></td><td><div id="type_'+lesson[0]+'"></div></td><td><input type="checkbox" id="format_'+lesson[0]+'"'
                    +'onchange="LesFormatChoose(\''+lesson[0]+'\');"><div id="format_info_'+lesson[0]+'"></div>'
                    +'</td><td><div id="control_'+lesson[0]+'"></div></td><td>'
                    div += '<input type="text" id="TeachersList_'+lesson[0]+'" list="teachers" Placeholder="Начните вводить имя..."'
                        +' name="teacher" class="form-control" onchange="GenTeachChoose(\''+lesson[0]+'\', \''+date+'\', \''+lesson[1]+'\', \''+lesson[2]+'\');"><datalist id=\'teachers\'>';
                    $.each(result.teachers, function(id, t){
                        div += '<option value="'+t+'">';
                    });
                    div += '</datalist><div id="teacher_info_'+lesson[0]+'"></div></td></tr>'
            });
            div += '</tbody></table><br><button type="button" class=" btn btn-lg btn-primary"'
              +'onclick="window.location.href=\'#close\';window.location.reload();">Закрыть</button>'
            $('#generate').empty();
            $('#generate').append(div);
            }
        }
    );
};
function GetThemeChoose(lesson_id){
    $('#theme_info_'+lesson_id).empty();
    $('#control_'+lesson_id).empty();
    $('#type_'+lesson_id).empty();
    $('#control_'+lesson_id).append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '3vh', height: '3vh'}));
    $('#type_'+lesson_id).append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '3vh', height: '3vh'}));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/schedule/course_lessons_"+group_id,
        data: {
            getthemechoose: $('#theme_'+lesson_id).val(),
            lesson: lesson_id
        },
        dataType : "json",
        success: function(result) {
            $('#theme_info_'+lesson_id).html('<b style="color: green;">Тема изменена</b>')
            div = '<select class="form-control" id="selecttype_'+lesson_id+'" style="text-align: center;" onchange="LesTypeChoose(\''+lesson_id+'\');">'
                +'<option value="block">Выберите из списка...</option>'
            if (result.lect_h != 0) {
                div += '<option value="lecture">Лекция</option>'
            }
            if (result.prac_h != 0) {
                div += '<option value="practice">Практика</option>'
            }
            if (result.trai_h != 0) {
                div += '<option value="trainee">Стажировка</option>'
            }
            if (result.indi_h != 0) {
                div += '<option value="individual">Индивидуальное</option>'
            }
            div += '</select><div id="type_info_'+lesson_id+'"></div>'
            $('#type_'+lesson_id).empty();
            $('#type_'+lesson_id).append(div);
            if (result.control != '') {
                div = '<b>'+result.control+'</b>'
                $('#control_'+lesson_id).empty();
                $('#control_'+lesson_id).append(div);
            } else {
                $('#control_'+lesson_id).empty();
            }
        }
    });
};
function LesTypeChoose(lesson_id) {
    $('#type_info_'+lesson_id).empty();
    $('#type_info_'+lesson_id).append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '3vh', height: '3vh'}));
    if ($('#selecttype_'+lesson_id+' option:first').val() == 'block') {
        $('#selecttype_'+lesson_id+' option:first').remove();
    }
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/schedule/course_lessons_"+group_id,
        data: {
            lestypechoose: $('#selecttype_'+lesson_id).val(),
            lesson: lesson_id
        },
        dataType : "json",
        success: function(result) {
            $('#type_info_'+lesson_id).empty();
            $('#type_info_'+lesson_id).html('<b style="color: green">Тип изменен</b>');
        }
    });
};
function LesFormatChoose(lesson_id) {
    $('#format_info_'+lesson_id).empty();
    $('#format_info_'+lesson_id).append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '3vh', height: '3vh'}));
    if ($("#format_"+lesson_id).is(":checked")) {
        var val = 'dot'
    } else {
        var val = 'nodot'
    }
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/schedule/course_lessons_"+group_id,
        data: {
            lesformatchoose: val,
            lesson: lesson_id
        },
        dataType : "json",
        success: function(result) {
            $('#format_info_'+lesson_id).empty();
            $('#format_info_'+lesson_id).html('<b style="color: green">Формат изменен</b>');
        }
    });
};
function GenTeachChoose(lesson_id, date, ts, tf){
    $('#teacher_info_'+lesson_id).empty();
    $('#teacher_info_'+lesson_id).append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '3vh', height: '3vh'}));
    var teacher = $('#TeachersList_'+lesson_id).val();
    id_teacher = teacher.substring(teacher.indexOf(':')+1, teacher.indexOf(')'));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/schedule/course_lessons_"+group_id,
        data:{
            teacher_gen: id_teacher,
            lesson: lesson_id,
            time_start: date+' '+ts,
            time_finish: date+' '+tf
        },
        dataType : "json",
        success: function(result) {
            $('#teacher_info_'+lesson_id).empty();
            if (result.check == true) {
                $('#teacher_info_'+lesson_id).html('<b style="color: green;">Преподаватель назначен</b>');
            } else {
                $('#teacher_info_'+lesson_id).html('<b style="color: red;">Преподаватель занят</b>');
            }
        }
    });
};
function ChangeLesson(id_lesson) {
    $('#editlesson').empty();
    $('#editlesson').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
    $.ajax(
     {
        type: "GET",
        url: "/dep/study/schedule/course_lessons_"+group_id,
        data: {
            change_lesson: id_lesson
        },
        dataType : "json",
        success: function(result) {
            div = '<h3>Редактирование занятия</h3><form method="GET"><table class="table_crit"><thead><input type="hidden" name="save_less" value="'+id_lesson+'">'
                +'<tr><th colspan="2">Внесите изменения в нужные параметры</th></tr><tr>'
                +'<th>Параметр</th><th>Значение</th></tr></thead><tbody><tr><td>Тема/раздел:</td><td>'+result.theme_name+'</td></tr><tr><td>'
                +'Тип занятия:</td><td>'+result.type+'</td></tr><tr><td>ДОТ:</td><td><select style="text-align: center;" class="form-control" name="dist" required>'
            if (result.distance == true) {
                div += '<option value="True" selected>Да</option><option value="False">Нет</option>'
            } else {
                div += '<option value="True">Да</option><option value="False" selected>Нет</option>'
            }
            div += '</select></td></tr><tr><td>Дата проведения занятия:<br>(Сроки курса:'+result.date_s+' - '+result.date_f+')</td><td><input type="date" style="text-align: center;" id="DateLesson" class="form-control" name="date_less" value="'+result.date_start+'"'
                +' onchange="CheckDate('+group_id+');" required>'
                +'<div id="err_date"></div></td></tr><tr><td>Время начала занятия:<br>(в формате: ЧЧ:ММ)</td><td><input type="text" style="text-align: center;" id="t_s" class="form-control" name="time_start" value="'+result.time_start+'"'
                +'onchange="CheckTimeStart('+id_lesson+', '+group_id+');" required>'
                +'<div id="err_start"></div></td></tr><tr><td>Время окончания занятия:<br>(в формате: ЧЧ:ММ)</td><td><input type="text" style="text-align: center;" id="t_f" class="form-control" name="time_finish" value="'+result.time_finish+'"'
                +'onchange="CheckTimeFinish('+id_lesson+', '+group_id+');" required>'
                +'<div id="err_finish"></div></td></tr><tr><td>Форма контроля:</td><td><input type="text" style="text-align: center;" class="form-control" name="control" value="'+result.control+'">'
                +'</td></tr><tr><td>Преподаватель:</td><td><input type="text" id="t_list" list="teachers" placeholder="Начните вводить имя..." name="teacher"'
                +' class="form-control" onchange="CheckTeacher('+group_id+');" value="'+result.current_teacher+'" required><datalist id="teachers">'
            $.each(result.teachers, function(index, teacher) {
                div += '<option value="'+teacher+' (ID:'+index+')">'
            });
            div += '</datalist><div id="teacher_info"></div></td></tr>'
                +'<tr><td colspan="2"><button class="btn btn-lg btn-primary" type="submit" id="AcceptButt">Сохранить изменения</button></td></tr></tbody></table></form>'
                +'<button type="button" class=" btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
                +'Закрыть</button>'
            $('#editlesson').empty();
            $('#editlesson').append(div);
            addEditMask();
        }
    });
};
function CheckTimeStart(id_lesson) {
    if ($('#DateLesson').val() == '') {
        $('#AcceptButt').attr('disabled', true);
        $('#err_date').html('<b style="color:red;">Выберите дату проведения занятия</b>');
    } else {
        $('#AcceptButt').attr('disabled', false);
        $('#err_date').empty();
    }
    if (!(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test($('#t_s').val()))) {
        $('#AcceptButt').attr('disabled', true);
        $('#err_start').html('<b style="color:red;">Некорректный формат времени</b>');
    } else {
        $('#AcceptButt').attr('disabled', false);
        $('#err_start').empty();
        var s = $('#DateLesson').val()+' '+$('#t_s').val();
        $.ajax(
         {
            type: "GET",
            url: "/dep/study/schedule/course_lessons_"+group_id,
            data:{
                timestart: s,
                lesson: id_lesson
            },
            beforeSend: function() {
                $('#err_start').empty();
                $('#err_start').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));
            },
            success: function(data) {
                $('.err_start').empty();
                    if (data['check_timestart'] == true) {
                        if (data['check_break'] == true) {
                            if (data['check_lunch'] == true) {
                                $('#err_start').css('color', 'green');
                                $('#err_start').html('<b>Время начала занятия доступно</b>');
                                $('#t_f').val(data.tf);
                                $('#AcceptButt').attr('disabled', false);
                            } else {
                                $('#err_start').css('color', 'red');
                                $('#err_start').html('<b>Необходим обеденный перерыв на 30 минут (До указанного времени проведено 4 академических часа)</b>');
                                $('#AcceptButt').attr('disabled', true);
                            }
                        } else {
                            $('#err_start').css('color', 'red');
                            $('#err_start').html('<b>Минимальный переыв между занятием продолжительностью 2 академ. часа - 10 минут</b>');
                            $('#AcceptButt').attr('disabled', true);
                        }
                    } else {
                        $('#err_start').css('color', 'orange');
                        $('#err_start').html('<b>Время совпадает с другим занятием.<br>Будет произведено изменение времени начала других занятий</b>');
                        $('#t_f').val(data.tf);
                    }
                }
        });
    }
};
function CheckTimeFinish(id_lesson) {
    if ($('#DateLesson').val() == '') {
        $('#AcceptButt').attr('disabled', true);
        $('#err_date').html('<b style="color:red;">Выберите дату проведения занятия</b>');
    } else {
        $('#AcceptButt').attr('disabled', false);
        $('#err_date').empty();
    }
    if (!(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test($('#t_f').val()))) {
        $('#AcceptButt').attr('disabled', true);
        $('#err_finish').html('<b style="color:red;">Некорректный формат времени</b>');
    } else {
        $('#AcceptButt').attr('disabled', false);
        $('#err_finish').empty();
        if (!(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test($('#t_s').val()))) {
            $('#AcceptButt').attr('disabled', true);
            $('#err_start').html('<b style="color:red;">Некорректный формат времени</b>');
        } else {
            var t = $('#DateLesson').val()+' '+$('#t_s').val();
            var s = $('#DateLesson').val()+' '+$('#t_f').val();
            if (compareDate(t) >= compareDate(s)) {
                $('#AcceptButt').attr('disabled', true);
                $('#err_finish').html('<b style="color:red;">Дата начала занятия не может быть позже даты окончания</b>');
            } else {
                $('#AcceptButt').attr('disabled', false);
                $('#err_finish').empty();
                $.ajax(
                 {
                    type: "GET",
                    url: "/dep/study/schedule/course_lessons_"+group_id,
                    data:{
                        timefinish: s,
                        lesson: id_lesson
                    },
                    beforeSend: function() {
                        $('#err_finish').empty();
                        $('#err_finish').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));
                    },
                    success: function(data) {
                        $('#err_finish').empty();
                        if (data['check_timefinish'] == true) {
                            $('#err_finish').css('color', 'green');
                            $('#err_finish').html('<b>Время окончания занятия свободно</b>');
                            $('#AcceptButt').attr('disabled', false);
                        } else {
                            $('#err_finish').css('color', 'red');
                            $('#err_finish').html('<b>Время совпадает с другим занятием</b>');
                            $('#AcceptButt').attr('disabled', true);
                        }
                    }
                });
            }
        }
    }
};
function CheckTeacher(){
    var teacher = $('#t_list').val();
    id_teacher = teacher.substring(teacher.indexOf(':')+1, teacher.indexOf(')'));
    $.ajax(
         {
            type: "GET",
            url: "/dep/study/schedule/course_lessons_"+group_id,
            data:{
                id_teach: id_teacher,
                time_start: $('#DateLesson').val()+' '+$('#t_s').val(),
                time_finish: $('#DateLesson').val()+' '+$('#t_f').val(),
            },
            beforeSend: function() {
                $('#teacher_info').text('');
                $('#teacher_info').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));;
            },
            success: function(data) {
                $('#teacher_info').empty();
                var fio = data['fio'];
                var email = data['email'];
                var phone = data['phone'];
                if (data['freetime'] == true) {
                    $('#teacher_info').html('ФИО: '+String(fio)+'<br>Почта: '+email+'<br>Телефон: '+phone+'<br><font color="green">Преподаватель свободен</green>');
                    $('#AcceptButt').attr('disabled', false);
                } else {
                    $('.teacherinfo').html('ФИО: '+String(fio)+'<br>Почта: '+email+'<br>Телефон: '+phone+'<br><font color="red">Преподаватель занят</red>');
                    $('#AcceptButt').attr('disabled', true);
                }
            }
    });
};
function CheckDate(){
    if ($('#DateLesson').val() == '') {
        $('#AcceptButt').attr('disabled', true);
        $('#err_date').html('<b style="color:red;">Выберите дату проведения занятия</b>');
    } else {
        $('#AcceptButt').attr('disabled', false);
        $('#err_date').empty();
        $.ajax(
         {
            type: "GET",
            url: "/dep/study/schedule/course_lessons_"+group_id,
            data:{
                check_date: $('#DateLesson').val(),
            },
            beforeSend: function() {
                $('#err_date').text('');
                $('#err_date').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));;
            },
            success: function(data) {
                $('#err_date').empty();
                if (data.check == true) {
                    $('#err_date').html('<b style="color:green;">Дата указана верно</b>')
                    $('#t_s').val('');
                    $('#t_f').val('');
                } else {
                    $('#err_date').html('<b style="color:red;">Указанная дата вне сроков проведения курса</b>')
                }
                $('#AcceptButt').attr('disabled', true);
            }
        });
    }
};
function getCookie(c_name){
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
function compareDate(str){
 // str format should be dd/mm/yyyy. Separator can be anything e.g. / or -. It wont effect
 var dt   = parseInt(str.substring(8,10));
 var mon  = parseInt(str.substring(5,7));
 var yr   = parseInt(str.substring(0,4));
 var hrs = parseInt(str.substring(11,13));
 var mns = parseInt(str.substring(14,16))
 var date = new Date(yr, mon, dt, hrs, mns);
 return date;
}
function HiddenLessons(index) {
    $("#shhid_"+index).html('<a href="#/" onclick="ShowLessons('+index+');"><i class="fa fa-plus-square fa-2x"></i></a>');
    $('[id^=lesson_'+index+']').css('visibility', 'collapse');
};
function ShowLessons(index) {
    $("#shhid_"+index).html('<a href="#/" onclick="HiddenLessons('+index+');"><i class="fa fa-minus-square fa-2x"></i></a>');
    $('[id^=lesson_'+index+']').css('visibility', 'visible');
};
function NewDayLesson(date) {
    $('.popup').append($('<img src="/static/work/load_full.gif">').css({width: '5vw', height: '5vw', margin: '0 -64px'}));
    div = '<form method="POST"><input type="hidden" name="csrfmiddlewaretoken" value="'+getCookie('csrftoken')+'">'
        +'<input type="hidden" id="GroupId" value="'+group_id+'"><table class="table_crit"><thead><tr><th colspan="2">'
        +'Новое занятие <a href="#win_newlesson" onclick="RefreshForm();"><i class="fa fa-refresh"></i></a></th></tr></thead>'
        +'<tbody><tr><td style="width: 20vw;">Дата проведения занятия</td><td><input type="date" id="LessonDay" name="lesson_day" class="form-control"'
        +' value="'+date+'" style="text-align:center;" readonly></td></tr><tr><td>Начало занятия<br>(в формате: ЧЧ:ММ)</td><td><input type="text"'
        +' class="form-control" id="timestart" style="text-align: center;" name="lesson_time_start" onchange="CheckTS();"><div class="err_timestart">'
        +'</div></td></tr><tr id="tr_timefinish" style="visibility: collapse;"><td>Окончание занятия:<br>(в формате: ЧЧ:ММ)</td><td>'
        +'<input type="text" class="form-control" id="timefinish" style="text-align: center;" name="lesson_time_finish" onchange="CheckTF();" readonly>'
        +'<div class="err_timefinish"></div></td></tr><tr id="tr_theme" style="visibility: collapse;"><td>Раздел/тема:</td><td>'
        +'<select id="SelectThemes" name="stschedule" class="form-control" onchange="SelectTh();"><option selected>Выберите из списка...</option>'
        +'</select><div class="err_theme"></div></td></tr><tr id="tr_lecture" style="visibility: collapse;"><td>'
        +'<div class="info_lecture"></div></td><td><input type="number" class="form-control" id="LectureHours"'
        +' name="lecture_hours" style="text-align: center;" onchange="LectureH();" readonly></td></tr><tr id="tr_practice" style="visibility: collapse;">'
        +'<td><div class="info_practice"></div></td><td><input type="number" class="form-control" id="PracticeHours"'
        +'name="practice_hours" style="text-align: center;" onchange="PracticeH();" readonly></td></tr><tr id="tr_trainee" style="visibility: collapse;">'
        +'<td><div class="info_trainee"></div></td><td><input type="number" class="form-control" id="TraineeHours"'
        +' name="trainee_hours" style="text-align: center;" onchange="TraineeH();" readonly></td></tr><tr id="tr_individ" style="visibility: collapse;"><td>'
        +'<div class="info_individ"></div></td><td><input type="number" class="form-control" id="IndividualHours"'
        +' name="individual_hours" style="text-align: center;" onchange="IndividualH();" readonly></td></tr><tr id="tr_noway" style="visibility: collapse;">'
        +'<td colspan="2"><div class="noway"></div></td></tr><tr id="tr_teacher" style="visibility: collapse;"><td>Преподаватель:'
        +'</td><td><div class="choose_teach"></div><div class="err_teach"></div></td><tr id="tr_teacherinfo"'
        +' style="visibility: collapse;"><td colspan="2"><div class="teacherinfo" style="text-align: center;"></div></td></tr>'
        +'<tr id="tr_formbutton" style="visibility: collapse;"><td colspan="2"><button type="submit" id="butt" class=" btn btn-lg btn-primary"'
        +'onclick="window.location.href=\'#close\';" disabled>Добавить занятие</button></td></tr></tbody></table></form><br>'
        +'<button type="button" class=" btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">Закрыть</button>'
    $('.popup').empty();
    $('.popup').append(div);
    addMask();
};
function addEditMask(){
    $.mask.definitions['H'] = "[0-2]";
    $.mask.definitions['h'] = "[0-9]";
    $.mask.definitions['M'] = "[0-5]";
    $.mask.definitions['m'] = "[0-9]";
    $('#t_s').mask("Hh:Mm");
    $('#t_f').mask("Hh:Mm");
};
function addGenMask(){
    $.fn.setCursorPosition = function(pos) {
      if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
      } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    };
    $.mask.definitions['H'] = "[0-2]";
    $.mask.definitions['h'] = "[0-9]";
    $.mask.definitions['M'] = "[0-5]";
    $.mask.definitions['m'] = "[0-9]";
    $('#Gen_TS').click(function(){
      $(this).setCursorPosition(0);
    }).mask("Hh:Mm");
};
function addMask() {
    $.fn.setCursorPosition = function(pos) {
      if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
      } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    };
    $.mask.definitions['H'] = "[0-2]";
    $.mask.definitions['h'] = "[0-9]";
    $.mask.definitions['M'] = "[0-5]";
    $.mask.definitions['m'] = "[0-9]";
    $('#timestart').click(function(){
      $(this).setCursorPosition(0);
    }).mask("Hh:Mm");
    $('#timefinish').click(function(){
      $(this).setCursorPosition(0);
    }).mask("Hh:Mm");
}