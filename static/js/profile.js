$(function() {
    $("#gif_load").fadeOut(100);
    function validateEmail($email) {
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      return emailReg.test( $email );
    }
    $("#SelectState").change(function() {
        if ($("#SelectState option:selected").text() == "Россия") {
            $("#InputSnils").prop('disabled',false);
            $("#InputSnils").prop('required',true);
        } else {
            $("#InputSnils").val("");
            $("#InputSnils").prop('disabled',true);
            $("#InputSnils").prop('required',false);
        }
    });
    $("#InputEmail").bind('blur', function(){
        if(!validateEmail($(this).val())) {
            $(".err_email").text('Введен некорректный адрес электронной почты')
            $(this).val('');
        } else {
            $(".err_email").empty();
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
      var value = $(this).val();
      if(value.split('_').length>1) {
        $(this).val('');
        $('.err_snils').text('СНИЛС был введен не полностью');
      } else {
        $('.err_snils').empty();
      }
    });
    $('#InputPhone').bind('blur', function(){
      var value = $(this).val();
      if(value.split('_').length>1) {
        $('.err_phone').text('Номер телефона был указан не полностью');
        $(this).val('');
      } else {
        $('.err_phone').empty();
      }
    });
    $("#ShowHide1 a").on('click', function(event) {
        event.preventDefault();
        if($('#Pass').attr("type") == "text"){
            $('#Pass').attr('type', 'password');
            $('#ShowHide1 img').attr('src', '/static/work/showpass.png');
        }else if($('#Pass').attr("type") == "password"){
            $('#Pass').attr('type', 'text');
            $('#ShowHide1 img').attr('src', '/static/work/hidepass.png');
        }
    });
    $("#ShowHide2 a").on('click', function(event) {
        event.preventDefault();
        if($('#PassConfirm').attr("type") == "text"){
            $('#PassConfirm').attr('type', 'password');
            $('#ShowHide2 img').attr('src', '/static/work/showpass.png');
        }else if($('#PassConfirm').attr("type") == "password"){
            $('#PassConfirm').attr('type', 'text');
            $('#ShowHide2 img').attr('src', '/static/work/hidepass.png');
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
        $('#Reg').show();
        $('.err_confirmpass').empty();
      }
    });
    $('#download_form').submit(function(){
        $("#gif_load").fadeIn(100);
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
    $("#InputSnils").mask("999-999-999 99");
    $("#InputPhone").mask("+7 (999) 999-99-99");
    $.mask.definitions['h'] = "[А-Я]";
    $.mask.definitions['z'] = "[а-я]";
    $("#InputSurname").mask("hz?zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",{placeholder:" "});
    $("#InputName").mask("hz?zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",{placeholder:" "});
    $("#InputPatronymic").mask("hz?zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",{placeholder:" "});
});