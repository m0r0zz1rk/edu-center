$(function() {
    function validateEmail($email) {
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailReg.test( $email );
    }
    $("input[name='select']").change(function(){
        if (this.value == 'phone') {
            $('#floatingInput').empty();
            $('#floatingInput').click(function(){
              $(this).setCursorPosition(4);
            }).mask("+7 (999) 999-99-99");
            $('#input_login').text("Телефон");
        } else if (this.value == 'snils') {
            $('#floatingInput').empty();
            $('#floatingInput').click(function(){
              $(this).setCursorPosition(0);
            }).mask("999-999-999 99");
            $('#input_login').text("СНИЛС");
        } else {
            $('#floatingInput').empty();
            $('#floatingInput').unmask();
            $('#input_login').text("Почта");
        }
    });
    $("#InputEmail").bind('blur', function(){
        $(".err_email").empty();
        if(!validateEmail($(this).val())) {
            $(".err_email").text('Введен некорректный адрес электронной почты')
            $(this).val('');
        } else {
            var value = $(this).val();
            console.log(value);
            $.ajax(
             {
                type: "GET",
                url: "/check_data",
                data: {
                    check_email: value,
                },
                dataType : "json",
                success: function(result) {
                    if (result.email_exists == 'no') {
                        $('.err_email').empty();
                    } else {
                        $('.err_email').text('Указанный адрес уже зарегистрирован в системе');
                        $("#InputEmail").val('');
                    }
                }
            });
        }
    });
    $("#SelectState").change(function(){
        if ($("#SelectState option:selected").text() == "Россия") {
            $("#DivSnils").fadeIn(500);
            $("#InputSnils").prop('required',true);
        }
        else {
            $("#DivSnils").fadeOut(500);
            $("#InputSnils").val('');
            $("#InputSnils").prop('required',false);
        }
    });
    $('.rotate-btn').click(function(){
        $('.switch-form').toggleClass('start-anim');
        if ($('#form_reg').css('display') == 'none') {
            $("#form_reg").css('display', 'block');
            $("#form_log").css('display', 'none');
        } else {
            $("#form_log").css('display', 'block');
            $("#form_reg").css('display', 'none');
        }
    });
    $("#showhide_login a").on('click', function(event) {
        event.preventDefault();
        if($('#floatingPassword').attr("type") == "text"){
            $('#floatingPassword').attr('type', 'password');
            $('#showhide_login img').attr('src', 'static/work/showpass.png');
        }else if($('#floatingPassword').attr("type") == "password"){
            $('#floatingPassword').attr('type', 'text');
            $('#showhide_login img').attr('src', 'static/work/hidepass.png');
        }
    });
    $("#RegistrShowHide2 a").on('click', function(event) {
        event.preventDefault();
        if($('#RegistrPassConfirm').attr("type") == "text"){
            $('#RegistrPassConfirm').attr('type', 'password');
            $('#RegistrShowHide2 img').attr('src', 'static/work/showpass.png');
        }else if($('#RegistrPassConfirm').attr("type") == "password"){
            $('#RegistrPassConfirm').attr('type', 'text');
            $('#RegistrShowHide2 img').attr('src', 'static/work/hidepass.png');
        }
    });
    $("#Reg").on('click', function(event) {
        $("#formbutton").prop('disabled', false);
    });
    $("#closepersonal").on('click', function(event) {
        $("#formbutton").prop('disabled', true);
    });
    $("#RegistrShowHide1 a").on('click', function(event) {
        event.preventDefault();
        if($('#RegistrPass').attr("type") == "text"){
            $('#RegistrPass').attr('type', 'password');
            $('#RegistrShowHide1 img').attr('src', 'static/work/showpass.png');
        }else if($('#RegistrPass').attr("type") == "password"){
            $('#RegistrPass').attr('type', 'text');
            $('#RegistrShowHide1 img').attr('src', 'static/work/hidepass.png');
        }
    });
    $('#InputBirthday').bind('blur', function(){
      var d = new Date();
      var InputVal = $(this).val().split('-')[0];
      var ThisYear = d.getFullYear();
      if(ThisYear-InputVal<18) {
        $('.err_birthdate').text('Некорректно указан год рождения');
        $(this).val('');
      } else {
        $('.err_birthdate').empty();
      }
    });
    $('#InputSnils').bind('blur', function(){
      $('.err_phone').empty();
      var value = $(this).val();
      if(value.split('_').length>1) {
        $(this).val('');
        $('.err_snils').text('СНИЛС был введен не полностью');
      } else {
        $.ajax(
         {
            type: "GET",
            url: "/check_data",
            data: {
                check_snils: value,
            },
            dataType : "json",
            success: function(result) {
                if (result.snils_exists == 'no') {
                    $('.err_snils').empty();
                } else {
                    $('.err_snils').text('Указанный СНИЛС уже зарегистрирован в системе');
                    $('#InputSnils').val('');
                }
            }
        });
      }
    });
    $('#InputPhone').bind('blur', function(){
      $('.err_phone').empty();
      var value = $(this).val();
      console.log(value);
      if(value.split('_').length>1) {
        $('.err_phone').text('Номер телефона был указан не полностью');
        $(this).val('');
      } else {
        $.ajax(
         {
            type: "GET",
            url: "/check_data",
            data: {
                check_phone: value,
            },
            dataType : "json",
            success: function(result) {
                if (result.phone_exists == 'no') {
                    $('.err_phone').empty();
                } else {
                    $('.err_phone').text('Указанный номер телефона уже зарегистрирован в системе');
                    $('#InputPhone').val('');
                }
            }
        });
      }
    });
    $('#RegistrPass').change(function(){
        if ($(this).val().length<6) {
            $(this).val('');
            $('.err_pass').text('Минимальная длина пароля - 6 символов')
        } else {
            $('.err_pass').empty();
        }
    });
    $('#RegistrPassConfirm').change(function(){
      if($(this).val()!=$('#RegistrPass').val()) {
        $(this).val('');
        $('.err_confirmpass').text('Введенные пароли не совпадают');
      } else {
        $('#tr_reg').css('visibility', 'visible');
        $('#Reg').attr('disabled', false);
        $('.err_confirmpass').empty();
      }
    });
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
    $("#InputSnils").click(function(){
      $(this).setCursorPosition(0);
    }).mask("999-999-999 99");
    $("#InputPhone").click(function(){
      $(this).setCursorPosition(4);
    }).mask("+7 (999) 999-99-99");
    $.mask.definitions['h'] = "[А-Я]";
    $.mask.definitions['z'] = "[а-я]";
    $("#InputSurname").click(function(){
      $(this).setCursorPosition(0);
    }).mask("hz?zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",{placeholder:" "});
    $("#InputName").click(function(){
      $(this).setCursorPosition(0);
    }).mask("hz?zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",{placeholder:" "});
    $("#InputPatronymic").click(function(){
      $(this).setCursorPosition(0);
    }).mask("hz?zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",{placeholder:" "});
});