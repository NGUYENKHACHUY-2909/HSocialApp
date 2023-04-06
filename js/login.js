$(function(){
    var isRememberMe = storage.getRememberMe();
    $("#input-check").attr("checked", isRememberMe);
})
function login(){
    var email = $("#email").val();
    var password = $("#password").val();
    if(email && password){
        $.ajax({
            type: 'Get',
            url: 'http://localhost:8080/hsocial/login',
            dataType: 'json',
            // dataType: 'json'
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(email + ":" + password));
            },
            success: function(data, textStatus, xhr){
                var isRememberMe =document.getElementById("input-check").checked;
                storage.saveRememberMe(isRememberMe);
                window.location.replace("http://127.0.0.1:5500/html/index.html");
                storage.setItem("email", email);
                // storage.setItem("fullName", data.fullName);
                storage.setItem("id", data.userId);
                storage.setItem("password", password);
            },
            error(jqXhR, textStatus, errorThrow){
                if(jqXhR.status == 401){
                    showErrorMessageLogin("Login Fail!");
                    return;
                }
                alert("Error System!!!");
                // return;
                // console.log(textStatus);
            }
        });
    }

}

function logOut(){
    storage.removeItem("email");
    storage.removeItem("id");
    storage.removeItem("password");
    window.location.replace("http://127.0.0.1:5500/html/login.html");
}
function showErrorMessageLogin(message){
    $("#error-message").html(message);
}
