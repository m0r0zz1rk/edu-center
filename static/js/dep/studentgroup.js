$(function() {
    $('#SelectType').change(function(){
        $('#tr_formbutton').css('visibility', 'collapse');
        $('#FormButton').prop('disabled', true);
        var val = $(this).val();
        console.log(val);
        $.ajax(
         {
            type: "GET",
            url: "/dep/study/studentgroups/new",
            data:{
                id_type: val
            },
            beforeSend: function() {
                $('.load').text('');
                $('.load').append($("<img src='/static/work/load_full.gif'>").css({width: '20px', height: '20px'}));;
            },
            success: function(data) {
                $('.load').empty();
                console.log(data['type']);
                if (data['voc'] != null) {
                    if (data['type'] == true) {
                        $('#SelectCourse option').remove();
                        $('#SelectCourse').append($('<option>', {
                            value: 'start',
                            text: 'Выберите из списка...'
                        }));
                        $.each(data['voc'], function(index, element) {
                            $('#SelectCourse').append($('<option>', {
                                value: index,
                                text: element
                            }));
                        });
                        $('#tr_event').css('visibility', 'collapse');
                        $('#SelectEvent').prop('disabled', true);
                        $('#tr_course').css('visibility', 'visible');
                        $('#SelectCourse').prop('disabled', false);
                        $('#tr_studentsnumber').css('visibility', 'collapse');
                        $('#StudentsNumber').prop('disabled', true);
                        $('#StudentsNumber').prop('required', false);
                    } else {
                        $('#SelectEvent option').remove();
                        $('#SelectEvent').append($('<option>', {
                            value: 'start',
                            text: 'Выберите из списка...'
                        }));
                        $.each(data['voc'], function(index, element) {
                            $('#SelectEvent').append($('<option>', {
                                value: index,
                                text: element
                            }));
                        });
                        $('#tr_course').css('visibility', 'collapse');
                        $('#SelectCourse').prop('disabled', true);
                        $('#tr_event').css('visibility', 'visible');
                        $('#SelectEvent').prop('disabled', false);
                        $('#tr_studentsnumber').css('visibility', 'visible');
                        $('#StudentsNumber').prop('disabled', false);
                        $('#StudentsNumber').prop('required', true);
                    }
                } else {
                    $('.load').css('color', 'red');
                    $('.load').text('Мероприятия не найдены');
                    $('#tr_event').css('visibility', 'collapse');
                    $('#tr_course').css('visibility', 'collapse');
                    $('#tr_studentsnumber').css('visibility', 'collapse');
                }
            }
        });
    });
    $('#SelectCourse').change(function(){
        if ($(this).val() != 'start') {
            $('#tr_formbutton').css('visibility', 'visible');
            $('#FormButton').prop('disabled', false);
        } else {
            $('#tr_formbutton').css('visibility', 'collapse');
            $('#FormButton').prop('disabled', true);
        }
    });
    $('#SelectEvent').change(function(){
        if ($(this).val() != 'start') {
            $('#tr_formbutton').css('visibility', 'visible');
            $('#FormButton').prop('disabled', false);
        } else {
            $('#tr_formbutton').css('visibility', 'collapse');
            $('#FormButton').prop('disabled', true);
        }
    });
});
function CertListParameters(id_group){
    $('#popup_js').empty();
    $('#popup_js').append($('<img src="/static/work/load_full.gif">').css({margin: '0 -64px', width: '10vh', height: '10vh'}));
    div = '<form method="GET" id="certlist_'+id_group+'"><input type="hidden" name="cert_list" value="'+id_group+'">'
        +'<table class="table_crit"><thead><tr><th colspan="3">Заполните информацию о приказах</th></tr><tr><th>'
        +'Приказ</th><th>Номер приказа</th><th>Дата приказа</th></tr></thead><tbody><tr><td>Приказ о зачислении</td><td>'
        +'<input type="text" class="form-control" style="text-align:center;" name="enroll_number" required></td><td>'
        +'<input type="date" class="form-control" style="text-align:center;" name="enroll_date" required></td>'
        +'</tr><tr><td>Приказ об отчислении</td><td>'
        +'<input type="text" class="form-control" style="text-align:center;" name="expl_number" required></td><td>'
        +'<input type="date" class="form-control" style="text-align:center;" name="expl_date" required></td>'
        +'</tr><tr><td colspan="3"><button type="submit" class="btn btn-lg btn-primary">'
        +'Сформировать ведомость</button></td></tr></tbody></table></form>'
        +'<button type="button" class=" btn btn-lg btn-primary" onclick="window.location.href=\'#close\';">'
        +'Закрыть</button>'
    $('#popup_js').empty();
    $('#popup_js').append(div);
};