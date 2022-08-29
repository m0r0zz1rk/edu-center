function GenerateCerts() {
    if (confirm('Вы действительно хотите сгенерировать реквизиты удостоверений? Все имеющиеся реквизиты будут удалены')){
        $('#reg_err').empty();
        $('#blser_err').empty();
        $('#blnum_err').empty();
        var reg = $('#RegNumber').val();
        var ser = $('#BlankSerial').val();
        var numb = $('#BlankNumber').val();
        if (reg.length == 0) {
            $('#reg_err').html('<b style="color: red;">Заполните информацию</b>');
        } else if (ser.length == 0) {
            $('#blser_err').html('<b style="color: red;">Заполните информацию</b>');
        } else if (numb.length == 0) {
            $('#blnum_err').html('<b style="color: red;">Заполните информацию</b>');
        } else {
            $('#Load').html('<b>Подождите, идет генерация данных...</b><br>');
            $('#Load').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '5vh', height: '5vh'}));
            $('#Load').append($('<br>'));
            $.ajax(
             {
                type: "GET",
                url: "/centre/study/studentgroups",
                data:{
                    generate_certs: group_id,
                    reg: reg,
                    ser: ser,
                    numb: numb
                },
                success: function(data) {
                    location.reload();
                }
            });
        }
    };
};
function ChangeReg(id_stud) {
    $('#inforeg_'+id_stud).empty();
    var val = $('#Reg_'+id_stud).val();
    if (val.length == 0) {
       $('#inforeg_'+id_stud).html('<b style="color: red;">Поле не может быть пустым</b>')
    } else {
        $('#inforeg_'+id_stud).append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '2vh', height: '2vh'}));
        $.ajax(
             {
                type: "GET",
                url: "/centre/study/studentgroups",
                data:{
                    change_certreg: id_stud,
                    group: group_id,
                    reg: val
                },
                error: function(data) {
                    $('#infoser_'+id_stud).empty();
                    $('#infoser_'+id_stud).html('<b style="color: red;">Нарушение уникальности составного ключа</b>')
                },
                success: function(data) {
                    $('#inforeg_'+id_stud).empty();
                    $('#inforeg_'+id_stud).html('<b style="color: green;">Значение успешно изменено</b>')
                }
            });
    }
};
function ChangeSer(id_stud) {
    $('#infoser_'+id_stud).empty();
    var val = $('#Serial_'+id_stud).val();
    if (val.length == 0) {
       $('#infoser_'+id_stud).html('<b style="color: red;">Поле не может быть пустым</b>')
    } else {
        $('#infoser_'+id_stud).append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '2vh', height: '2vh'}));
        $.ajax(
             {
                type: "GET",
                url: "/centre/study/studentgroups",
                data:{
                    change_certser: id_stud,
                    group: group_id,
                    ser: val
                },
                error: function(data) {
                    $('#infoser_'+id_stud).empty();
                    $('#infoser_'+id_stud).html('<b style="color: red;">Нарушение уникальности составного ключа</b>')
                },
                success: function(data) {
                    $('#infoser_'+id_stud).empty();
                    $('#infoser_'+id_stud).html('<b style="color: green;">Значение успешно изменено</b>')
                }
            });
    }
};
function ChangeNumb(id_stud) {
    $('#infonumb_'+id_stud).empty();
    var val = $('#Number_'+id_stud).val();
    if (val.length == 0) {
       $('#infonumb_'+id_stud).html('<b style="color: red;">Поле не может быть пустым</b>')
    } else {
        $('#infonumb_'+id_stud).append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '2vh', height: '2vh'}));
        $.ajax(
             {
                type: "GET",
                url: "/centre/study/studentgroups",
                data:{
                    change_certnumb: id_stud,
                    group: group_id,
                    numb: val
                },
                error: function(data) {
                    $('#infonumb_'+id_stud).empty();
                    $('#infonumb_'+id_stud).html('<b style="color: red;">Нарушение уникальности составного ключа</b>')
                },
                success: function(data) {
                    $('#infonumb_'+id_stud).empty();
                    $('#infonumb_'+id_stud).html('<b style="color: green;">Значение успешно изменено</b>')
                }
            });
    }
};