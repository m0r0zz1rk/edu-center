$(function(){
    $('.TeachersList').change(function(){
        var teacher = $(this).val();
        id_teacher = teacher.substring(teacher.indexOf(':')+1, teacher.indexOf(')'));
        if (id_teacher == '') {
            $('.teacher_info').empty();
            $('.teacher_info').html('<b style="color: red">Пользователь не найден!</b>');
        } else {
            $.ajax(
                 {
                    type: "GET",
                    url: "/centre/study/studentgroups",
                    data:{
                        id_teach: id_teacher,
                    },
                    beforeSend: function() {
                        $('.teacher_info').text('');
                        $('.teacher_info').append($("<img src='/static/work/load_full.gif'>").css({width: '10vh', height: '10vh'}));;
                    },
                    success: function(data) {
                        if (data) {
                            var fio = data['fio']
                            var email = data['email']
                            var phone = data['phone']
                            $('.teacher_info').empty();
                            $('.teacher_info').html('ФИО: '+String(fio)+'<br>Почта: '+email+'<br>Телефон: '+phone);
                            $('.tr_formbutton').css('visibility', 'visible');
                            $('.FormButton').prop('disabled', false);
                        }
                    }
            });
        }
    });
});