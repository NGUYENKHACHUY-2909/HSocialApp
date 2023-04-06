
$(function(){
    // nếu chưa đăng nhập thì nhảy sang trang login
    if(!isLogin()){
        window.location.replace("http://127.0.0.1:5500/html/login.html");
    }
    getProfileUser();
    showAvatarListFriend();
    getNotifications();
})

// lấy userid khi đăng nhập để call api
var idUser = storage.getItem("id");

// //kiểm tra xem đã đăng nhập chưa.
// function isLogin(){
//     var idUser = storage.getItem("id");
//     console.log(idUser);
//     if(idUser){
//         return true;
//     }
//     else{
//         return false;
//     }
// }

var userSettings = document.querySelector(".user-settings");
var darkBtn = document.getElementById("dark-button");
var LoadMoreBackground =document.querySelector(".btn-LoadMore");

// show option menu
function UserSettingToggle(){
    userSettings.classList.toggle("user-setting-showup-toggle");
}


// build list posts
function buildListPosts(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/hsocial/posts/"+idUser,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function (data) {
            var temp;
            for(var i = 0; i<data.length; i++){
                for(var j = i+1; j< data.length; j++){
                    if(data[i].createDate < data[j].createDate){
                        temp = data[i];
                        data[i] = data[j];
                        data[j] = temp;
                    }
                }
            }
            // get posts
            var strPost = "";
            $.each(data, function(index, item){
                var avt = "";
                if(item.user.attachment == null){
                    avt = "avtdefault.png";
                }
                else{
                    avt = item.user.attachment.fileName;
                }
                var imagePost = '';
                if(item.attachmentFile){
                    imagePost = "../HSocial App/HSocial/src/main/resources/static/images/" + item.attachmentFile;
                }
                strPost += `<div class="status-field-container write-post-container">
                <div class="user-profile-box">
                    <div class="user-profile">
        
                        <img src='../HSocial App/HSocial/src/main/resources/static/images/${avt}' class="avatar-user" alt="">
                        <div>
                            <p>${item.user.userName}</p>
                            <small>${item.createDate}</small>
                        </div>
                    </div>
                    <div class="dropdown">
                    <a class="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                      Tuỳ chọn
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <li onclick = "showModalUpdatePost(${item.postId})"><a class="dropdown-item" href="#">Chỉnh sửa</a></li>
                      <li onclick = "deletePost(${item.postId})"><a class="dropdown-item">Xoá</a></li>
                    </ul>
                  </div>
                </div>
                <div class="status-field">
                    <p>${item.content}</p>
                    <img src="${imagePost}" alt="">
                </div>
                <div class="post-reaction">
                    <div class="activity-icons">
                        <div><i onclick = "handleLike(${index}, ${item.postId})" id = "like-posts-${index}" class="fas fa-thumbs-up"></i> <p style = "margin-bottom: 0px"> ${item.likes.length}  </p> lượt thích</div>
                        <div onclick = "showCommentBox(${item.postId})"><img src="../images/comments.png" alt="" >${item.comments.length} lượt bình luận</div>
                    </div>
                    <div class="post-profile-picture">
                        <img src='../HSocial App/HSocial/src/main/resources/static/images/${avt}' alt=""> <i class=" fas fa-caret-down"></i>
                    </div>
                </div>
                </div>`;

                // hiển thị ng dùng đã like bài viết chưa và xử lí like và huỷ like
                $.each(item.likes, function(indexLike, likeItem){
                    // call api get userId dựa vào likeId
                    // dựa vào đó kiểm tra xem user đã like bài viết của mình chưa. nếu rồi thì icon like hiện màu xanh.
                    if(item.likes.length >0){
                        $.ajax({
                            url: "http://localhost:8080/hsocial/likes/"+likeItem.likeId,
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
                            },
                            type: "GET",
                            success: function(userId){
                                if(userId == idUser){
                                    $("#like-posts-"+index).css("color", "blue");
                                }
                            }
                        });
                    }
                    else{
                        $("#like-posts-"+index).css("color", "grey");
                    }
                });
            });
            $("#list-post").html(strPost);
        }
    });
 
}

// // hàm hiển thị ảnh theo number
// function showPhotosUser(data, number){
//     var dem = 0;
//     var strPhoto = "";
//     $.each(data.posts, function(index, item){
//         if(item.attachmentFile !== null && item.attachmentFile != ""){
//             dem++;
//             strPhoto += `<img src="../HSocial App/HSocial/src/main/resources/static/images/${item.attachmentFile}" alt="">`;
//         }
//         if(dem == number){
//             return false;
//         }
//     })
//     $("#photos-user").html(strPhoto);
// }

// hiển thị tất cả ảnh
function showAllPhotosUser(){
    $("#hide-list-post").css("display", "block");
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/hsocial/users/"+idUser,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function (data) {
            // get posts
            var temp = data.posts[0];
            for(var i = 0; i< data.posts.length - 1; i++){
                for(var j = i + 1; j< data.posts.length; j++){
                    if(data.posts[i].createDate < data.posts[j].createDate){
                        temp = data.posts[j];
                        data.posts[j] = data.posts[i];
                        data.posts[i] = temp;
                    }
                }
            }
            // show photos
            showPhotosUser(data, data.posts.length);
        }
    });
 
}

//ẩn bớt ảnh
function hideListPhotos(){
    $("#hide-list-post").css("display", "none");
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/hsocial/users/"+idUser,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function (data) {

            // get posts
            var temp = data.posts[0];
            for(var i = 0; i< data.posts.length - 1; i++){
                for(var j = i + 1; j< data.posts.length; j++){
                    if(data.posts[i].createDate < data.posts[j].createDate){
                        temp = data.posts[j];
                        data.posts[j] = data.posts[i];
                        data.posts[i] = temp;
                    }
                }
            }
            // show photos
            showPhotosUser(data, 6);
        }
    });
}

// show 4 ảnh đại diện của list friends
function showAvatarListFriend(){
    $.ajax({
        url: "http://localhost:8080/hsocial/friendships/"+idUser,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function(data){
            console.log(data);
            showListFriends(data);
            $("#number-friend").html(data.length + " Bạn bè");

            // nếu số bạn bè nhiều hơn 4 thì chỉ hiện 4 ảnh bạn bè.
            if(data.length>4){
                var amountFriends = 0;
                var strAvt = "";
                for(var i =0; i<4; i++){
                    // trường hợp bạn ở friend
                    if(data[i].user.userId == idUser && data[i].status == 'accepted'){
                        amountFriends++;
                        var avtUrl = "";
                        if(data[i].friend.attachment == null){
                            avtUrl = "avtdefault.png";
                        }
                        else{
                            avtUrl = data[i].friend.attachment.fileName;
                        }
                        strAvt += `<img style = "width: 30px; height: 30px; border-radius: 100%;" onclick = "changeUser(${data[i].friend.userId})" src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="">`
                    }
                    // trường hợp bạn ở user
                    else if(data[i].user.userId != idUser && data[i].status == 'accepted'){
                        amountFriends++;
                        if(data[i].user.attachment == null){
                            avtUrl = "avtdefault.png";
                        }
                        else{
                            avtUrl = data[i].user.attachment.fileName;
                        }
                        strAvt += `<img style = "width: 30px; height: 30px; border-radius: 100%;" onclick = "changeUser(${data[i].user.userId})" src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="">`
                    }
                }
                $("#number-friend").html(amountFriends + " Bạn bè");
                $("#avt-list-friends").html(strAvt);
            }

            // nếu số ảnh nhỏ hơn 4 thì hiện hết bạn bè
            else{
                var amountFriends = 0;
                var strAvt = "";
                for(var i =0; i<data.length; i++){
                    if(data[i].user.userId == idUser && data[i].status == 'accepted'){
                        amountFriends++;
                        var avtUrl = "";
                        if(data[i].friend.attachment == null){
                            avtUrl = "avtdefault.png";
                        }
                        else{
                            avtUrl = data[i].friend.attachment.fileName;
                        }
                        strAvt += `<img style = "width: 30px; height: 30px; border-radius: 100%;" onclick = "changeUser(${data[i].friend.userId})" src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="">`;
                    }
                    else if(data[i].user.userId != idUser && data[i].status == 'accepted'){
                        amountFriends++;
                        if(data[i].user.attachment == null){
                            avtUrl = "avtdefault.png";
                        }
                        else{
                            avtUrl = data[i].user.attachment.fileName;
                        }
                        strAvt += `<img style = "width: 30px; height: 30px; border-radius: 100%;" onclick = "changeUser(${data[i].user.userId})" src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="">`;
                    }
                }
                $("#number-friend").html(amountFriends + " Bạn bè");
                $("#avt-list-friends").html(strAvt);
            }
        }
    })

}

// function changeUser(userId){
//     sessionStorage.setItem("idFriend", userId);
//     if(userId == idUser){
//         window.location.href = "http://127.0.0.1:5500/html/profile.html";
//     }
//     else{
//         window.location.href = "http://127.0.0.1:5500/html/profilefriend.html";
//     }
// }

// hiển thị danh sách bạn bè
function showListFriends(data){
    var strFriends = "";
    for(var i =0; i<data.length; i++){
        if(data[i].user.userId == idUser && data[i].status == 'accepted'){
            var avtUrl = "";
            if(data[i].friend.attachment == null){
                avtUrl = "avtdefault.png";
            }
            else{
                avtUrl = data[i].friend.attachment.fileName;
            }
            strFriends += `<div class="first-friend">
                                <img onclick = "changeUser(${data[i].friend.userId})" style = "width: 80px; height: 80px" src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="">
                                <p>${data[i].friend.userName}</p>
                            </div>`
        }
        else if(data[i].user.userId != idUser && data[i].status == 'accepted'){
            var avtUrl = "";
            if(data[i].user.attachment == null){
                avtUrl = "avtdefault.png";
            }
            else{
                avtUrl = data[i].user.attachment.fileName;
            }
            strFriends += `<div class="first-friend">
                                <img onclick = "changeUser(${data[i].user.userId})" style = "width: 80px; height: 80px" src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="">
                                <p>${data[i].user.userName}</p>
                            </div>`
        }
    }
    $("#list-friends").html(strFriends);
}

// // format date yyyy--MM-dd
// function formatDate(date){
//     const dateObject = new Date(date);
//     const year = dateObject.getFullYear();
//     const month = String(dateObject.getMonth() + 1).padStart(2, '0');
//     const day = String(dateObject.getDate()).padStart(2, '0');
//     const formattedDate = `${year}-${month}-${day}`;
//     return formattedDate
// }

// load thông tin user lên trang user
function getProfileUser(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/hsocial/users/"+idUser,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function (data) {
            console.log(data);
            if(data.attachmentAvatar == null){
                $(".avatar-user").attr("src", "../images/avtdefault.png");
            }
            else{
                $(".avatar-user").attr("src", "../HSocial App/HSocial/src/main/resources/static/images/"+data.attachmentAvatar.fileName);
            }
            if(data.attachmentBackground == null){
                $("#background-user").attr("src","../images/bg-default.jpg");
            }
            else{
                $("#background-user").attr("src", "../HSocial App/HSocial/src/main/resources/static/images/"+data.attachmentBackground.fileName);
            }
            $(".user-name").html(data.userName);
            $("#intro").html(data.description);
            $("#education").html(data.education);
            $("#address").html(data.address);
            $("#date-of-birth").html(formatDate(data.dateOfBirth));
            $("#phone-number-modal").html(data.phoneNumber);
            $("#placeholder-post").attr("placeholder", "What's on your mind, "+ data.userName + "?");
            // $("#number-friend").html(data.users.length + " Bạn bè");
            showPhotosUser(data, 6);
            // showAvatarListFriend(data);
            // showListFriends(data);
            buildListPosts();
        }
    });
}

// // ẩn modal edit profile
// function hideModalEidtPrifile(){
//     $("#modal").hide();
//     $("body").css("overflow","auto");
//     hideEditProfile();
// }

// show edit profile và get data hiển thị lên input
function showEditProfile(){
    $("#modal").show();
    $("body").css("overflow","hidden");
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/hsocial/users/"+idUser,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function (data) {
            if(data.attachmentAvatar == null){
                $("#img-avt").attr("src", "../images/avtdefault.png");
            }
            else{
                $("#img-avt").attr("src", "../HSocial App/HSocial/src/main/resources/static/images/"+data.attachmentAvatar.fileName);
            }
            if(data.attachmentBackground == null){
                $("#img-bg").attr("src","../images/bg-default.jpg");
            }
            else{
                $("#img-bg").attr("src", "../HSocial App/HSocial/src/main/resources/static/images/"+data.attachmentBackground.fileName);
            }
            $("#intro-edit").html(data.description);
            $("#education-info").html(data.education);
            $("#address-info").html(data.address);
            $("#user-name-modal").html(data.userName);
            $("#date-of-birth-info").html(formatDate(data.dateOfBirth));
            $("#phone-number-info").html(data.phoneNumber);
        }
    });
}

// hiển thị option để chỉnh sửa phần giới thiệu
function showEditIntro(){
    $("#intro-edit-value").css("display","block");
    $("#intro-edit").css("display","none");
    $("#intro-edit-value").val($("#intro-edit").text());
    $("#exit-intro").css("display", "block");
    $("#save-intro").css("display", "block");
}

// ẩn tất cả các option edit
function hideEditProfile(){

    $("#user-name-modal").css("display","block");
    $("#user-name-modal-value").css("display","none");

    $(".show-infor").css("display","none");
    $(".options-infor").css("display","block");

    $("#intro-edit-value").css("display","none");
    $("#intro-edit").css("display","block");

    $("#exit-intro").css("display", "none");
    $("#exit-infor").css("display", "none");
    $("#exit-userName").css("display", "none");
    $("#save-userName").css("display", "none");
    $("#save-intro").css("display", "none");
    $("#save-infor").css("display", "none");

    $("#control-btn-avt").css("display", "none");
    $('#input-file-avt').val(null);
    $("#control-btn-background").css("display", "none");
    $('#input-file-background').val(null);

    hideValidation();
    
}

// hiển thị option để chỉnh sửa thông tin giới thiệu
function showEditInfor(){
    $(".options-infor").css("display","none");
    $(".show-infor").css("display","block");
    $("#intro-edit-value").val($("#intro-edit").text());
    $("#education-info-value").val($("#education-info").text());
    $("#address-info-value").val($("#address-info").text());
    $("#date-of-birth-info-value").val($("#date-of-birth-info").text());
    $("#phone-number-info-value").val($("#phone-number-info").text());
    $("#exit-infor").css("display", "block");
    $("#save-infor").css("display", "block");

}

// hiển thị phần options để chỉnh sửa tên username
function showEditUserName(){
    $("#user-name-modal").css("display", "none");
    $("#user-name-modal-value").css("display", "block");
    $("#user-name-modal-value").val($("#user-name-modal").html());
    $("#exit-userName").css("display", "block");
    $("#save-userName").css("display", "block");
}

// // lấy tên của ảnh sau dấu "/"" và trước dấu "." 
// function getNamePhoto(url){
//     var parts = url.split("/");
//     var fileAvatar = parts[parts.length - 1];
//     var avtNameValueParts = fileAvatar.split(".");
//     var avtNameValue = avtNameValueParts[0];
//     return avtNameValue;
// }

// lưu thông tin khi update profile
function saveUpdateProfile(){
    var avatarValue = $("#img-avt").attr("src");
    var avtNameValue = getNamePhoto(avatarValue);
    if($("#intro-edit-value").val()){
        var intro = $("#intro-edit-value").val();
    }
    else{
        var intro = $("#intro-edit").html();
    }
    if($("#address-info-value").val()){
        var address = $("#address-info-value").val();
        var education = $("#education-info-value").val();
        var dateOfBirth = $("#date-of-birth-info-value").val();
        var phoneNumber = $("#phone-number-info-value").val();
    }
    else{
        var address = $("#address-info").html();
        var education = $("#education-info").html();
        var dateOfBirth = $("#date-of-birth-info").html();
        var phoneNumber = $("#phone-number-info").html();
    }
    if($("#user-name-modal-value").val()){
        var userName = $("#user-name-modal-value").val();
    }
    else{
        var userName = $("#user-name-modal").html();
    }
    var bgValue = $("#img-bg").attr("src");
    var newBackground = getNamePhoto(bgValue);
    data =  {
                "userName": userName,
                "avatar": avtNameValue,
                "address": address,
                "dateOfBirth": dateOfBirth,
                "phoneNumber": phoneNumber,
                "background": newBackground,
                "description": intro,
                "education": education
            };
    $.ajax({
        url: "http://localhost:8080/hsocial/users/"+idUser,
        type: 'put',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        data: JSON.stringify(data),
        headers : {'Content-Type': 'application/json', 'charset': 'utf-8'},
        // dataType: 'json',
        success: function(message){
            alert(message);
            showEditProfile();
            getProfileUser();
            hideEditProfile();
        },
        error: function(error){
            console.log(error.responseJSON.userName);
            $("#validation-user-name").html(error.responseJSON.userName);
        }
    });
}
function exitEditIntro(){
    $("#intro-edit-value").css("display","none");
    $("#intro-edit").css("display","block");
    $("#exit-intro").css("display", "none");
    $("#save-intro").css("display", "none");
}
function exitEditInfor(){
    $("#exit-infor").css("display", "none");
    $(".show-infor").css("display","none");
    $(".options-infor").css("display","block");
    $("#save-infor").css("display", "none");
}
function exitEditUserName(){
    $("#exit-userName").css("display", "none");
    $("#user-name-modal").css("display","block");
    $("#user-name-modal-value").css("display","none");
    $("#save-userName").css("display", "none");
    $("#validation-user-name").html();
}
function showInputAttachment(){
    $("#control-btn-avt").css("display", "block");
}
function saveAvt(){
    $('#control-btn-avt').submit(function(event) {
        event.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: 'http://localhost:8080/upload/'+idUser,
            type: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                alert("Cập nhật ảnh đại diện thành công.");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Cập nhật ảnh đại diện không thành công!!!");
            }
        });
    });
}
function cancleEditAvt(){
    $("#control-btn-avt").css("display", "none");
    $('#input-file-avt').val(null);
}
function hideValidation(){
    $("#validation-user-name").html();
}
function showUpdateBackground(){
    $("#control-btn-background").css("display", "block");
}
function cancleEditBackground(){
    $("#control-btn-background").css("display", "none");
    $('#input-file-background').val(null);
}
function saveBackground(){
    $("#control-btn-background").submit(function(event){
        event.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: "http://localhost:8080/background/"+idUser,
            type: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(){
                alert("Cập nhật ảnh đại diện thành công!!!");
            },
            error: function(){
                alert("Cập nhật ảnh bìa không thành công!!!!");
            }
        });
    });
}

//Post
// //ShowModalPost
// function showModalPost(){
//     $("#modal-post").css("display", "block");
// }

// //hide modal Post()
// function hideModalPost(){
//     $("#modal-post").css("display", "none");
//     $("#content-post-value").val("");
//     $("#attachemt-file-post").val(null);

// }
// //onclick create Post
// function createPost(){
//     if($("#attachemt-file-post").val()){
//         $("#create-post-form").submit(function(event){
//             event.preventDefault();
//             var formData = new FormData(this);
//             $.ajax({
//                 url: "http://localhost:8080/hsocial/posts/"+idUser,
//                 type: 'POST',
//                 beforeSend: function (xhr) {
//                     xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//                 },
//                 data: formData,
//                 processData: false,
//                 contentType: false,
//                 success: function(reponse){
//                     alert("Tạo bài viết thành công!!!");
//                     buildListPosts();
//                 },
//                 error: function(jqXHR){
//                     alert("Tạo bài viết không thành công!!!!");
//                 }
//             });
//             this.reset();
//             event.preventDefault();
//         });
//     }
//     else{
//         return;
//     }
// }

// // show modal update post
// function showModalUpdatePost(postId){
//     $("#modal-update-post").css("display", "block");
//     $.ajax({
//         url: "http://localhost:8080/hsocial/posts/postId/" + postId,
//         type: "GET",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//         },
//         success: function(data){
//             if(!data.content){
//                 $("#content-update-post-value").attr("placeholder", "Thêm nội dung bài viết.");
//             }else{
//                 $("#content-update-post-value").val(data.content);
//             }
//             $("#btn-update-post").attr("onclick", "updatePost(" + data.postId + ")" )

//             if(data.attachmentFile){
//                 $("#show-photo-edit-post").attr("src", "../HSocial App/HSocial/src/main/resources/static/images/"+data.attachmentFile);
//             }
//         },
//         error: function(){

//         }
//     });
// }

// hide modal-update-post
// function hideModaUpdatelPost(){
//     $("#modal-update-post").css("display", "none");
// }

// // update Post
// function updatePost(postId){
//     $("#update-post-form").submit(function(event){
//         event.preventDefault();
//         var formData = new FormData(this);
//         $.ajax({
//             url: "http://localhost:8080/hsocial/posts/"+ postId,
//             type: "PUT",
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//             },
//             data: formData,
//             processData: false,
//             contentType: false,
//             success: function(response){
//                 alert("Cập nhật bài viết thành công");
//                 buildListPosts();
//                 hideModaUpdatelPost();
//             },
//             error: function(response){

//             }
//         })
//     })
// }

// // delete Post
// function deletePost(postId){
//     var deletePostValue = confirm("Bạn có chắc muốn xoá bài viết không?");
//     if(deletePostValue == true){
//         $.ajax({
//             url: "http://localhost:8080/hsocial/posts/" + postId,
//             type: "DELETE",
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//             },
//             success: function(){
//                 getProfileUser();
//                 alert("Xoá bài viết thành công");
//             },
//             error: function(){
//                 alert("Xoá bài viết không thành công.");
//             }
//         })
//     }
// }

// // show comment box
// function showCommentBox(postId){
//     $("#modal-comment").css("display", "block");
//     // call API get comment by postId
//     $.ajax({
//         url: "http://localhost:8080/hsocial/comments/" + postId,
//         type: "GET",
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//         },
//         success: function(data){
//             $("#btn-sent-comment").attr("onclick", "upComment(" + postId + ")");
//             var strComment = "";
//             $.each(data, function(index, item){
//                 var avtUrl = '';
//                 if(item.user.attachment == null){
//                     avtUrl = 'avtdefault.png';
//                 }
//                 else{
//                     avtUrl = item.user.attachment.fileName; 
//                 }
//                 strComment += `<div class="card mb-4">
//                     <div class="card-body">
//                         <div class="d-flex justify-content-between">
//                             <div class="d-flex flex-row align-items-center">
//                                 <img src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="avatar" width="25" height="25" />
//                                 <p class="small mb-0 ms-2">${item.user.userName}</p>
//                             </div>
//                             <div class="d-flex flex-row align-items-center">
//                             <p class="small text-muted mb-0">${item.createDate}</p>
//                           </div>
//                           <div class="dropdown">
//                           <a class="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
//                             Tuỳ chọn
//                           </a>
//                           <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
//                             <li onclick = "deleteComment(${item.commentId}, ${postId})"><a class="dropdown-item">Xoá</a></li>
//                           </ul>
//                         </div>
//                         </div>
//                         <p style = "margin-top: 15px">${item.contentComment}</p>
//                     </div>
//                 </div>`
//             });
//             $("#comment-line").html(strComment);
//         },
//         error: function(){
//             alert("Lỗi không lấy được comment!")
//         }
//     });
// }


// // up comment
// function upComment( postId){
//     var valueComment = $("#valueComment").val().trim();
//     if(valueComment){
//         dataJSON = {
//             "contentComment": valueComment,
//             "user": {
//                 "userId": idUser
//             },
//             "post": {
//                 "postId": postId
//             }
//         }
//         $.ajax({
//             url: "http://localhost:8080/hsocial/comments",
//             type: "POST",
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//             },
//             data: JSON.stringify(dataJSON),
//             contentType: 'application/json; charset=utf-8',
//             success: function(){
//                 showCommentBox(postId);
//                 $("#valueComment").val("");
//                 var content = document.getElementById("modal-comment-body");
//                 content.scrollTop = content.scrollHeight;
//             },
//             error: function(){
//                 alert("Bình luận không thành công!");
//             }
//         })
//     }
//     else{
//         return;
//     }
// }

// // delete comment
// function deleteComment(commentId, postId){
//     var valueDeleteComment = confirm("Bạn có muốn xoá bình luận không?");
//     if(valueDeleteComment == true){
//         $.ajax({
//             url: "http://localhost:8080/hsocial/comments/"+commentId,
//             type: "DELETE",
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//             },
//             success: function(){
//                 alert("Xoá thành công.");
//                 showCommentBox(postId);
//             },
//             error: function(){
//                 alert("Xoá bình luận không thành công");
//             }
//         })
//     }
// }

// // like và huỷ like
// function handleLike(index, postId){
//     if($("#like-posts-"+index).css("color") == "rgb(0, 0, 255)"){
//         $.ajax({
//             url: "http://localhost:8080/hsocial/likes/"+idUser+"/"+postId,
//             type: "DELETE",
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//             },
//             success: function(){
//                 $("#like-posts-"+index).css("color", "grey");
//                 buildListPosts();
//             }
//         })
//     }
//     else{
//         var createLikeData = {
//             "user": {
//                 "userId": idUser
//             },
//             "post": {
//                 "postId": postId
//             }
//         }
//         $.ajax({
//             url: "http://localhost:8080/hsocial/likes",
//             type: "POST",
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//             },
//             data: JSON.stringify(createLikeData),
//             contentType: 'application/json; charset=utf-8',
//             success: function(){
//                 $("#like-posts-"+index).css("color", "blue");
//                 buildListPosts();
//             }
//         })
//     }
// }
// // hiển thị kết quả tìm kiếm
// function sugesstionsSearch(){
//     $("#sugesstions").css("display", "block");
//     var searchValue = $("#search-value").val();
//     if(searchValue != ""){
//         $.ajax({
//             url: "http://localhost:8080/hsocial/users/search?name="+searchValue,
//             type: "GET",
//             beforeSend: function (xhr) {
//                 xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//             },
//             success: function(data){
//                 if(data == ""){
//                     $("#list-suggestions").html("Không tìm thấy kết quả.");
//                 }
//                 else{
//                     var searchStr = "";
//                     $.each(data, function(index, item){
//                         var avt = "";
//                         if(item.attachmentAvatar == null){
//                             avt = "avtdefault.png";
//                         }
//                         else{
//                             avt = item.attachmentAvatar.fileName;
//                         }
//                         searchStr += `<li onclick = "changeUser(${item.userId})" style="margin-bottom: 10px; cursor: pointer;"><img src="../HSocial App/HSocial/src/main/resources/static/images/${avt}" alt="" style="width: 40px; height: 40px; margin-right: 20px; border-radius: 50% 50%;">${item.userName}</li>`
//                     })
//                     $("#list-suggestions").html(searchStr);
//                 }
//             }
//         })
//     }
// }
// // ẩn ô tìm kiếm 
// function hideSearch(){
//     $("#sugesstions").css("display", "none");
//     $("#notifications").css("display", "none");
//     currentPage = 1;
// }


// // hien thi thong bao
// var currentPage = 1;
// var sizePage = 3;
// function pagingNotifications(pageAmount){
//     var pagingStr ="";
//     if(pageAmount>1 && currentPage >1){
//         pagingStr+= `<li class="page-item" onclick="previousPage()"><a class="page-link" href="#">Previous</a></li>`;
//     }
//     for(i=0; i<pageAmount; i++){
//         pagingStr+= '<li class="page-item" onclick="changePage('+(i+1)+')"><a style="background-color: '+(currentPage==(i+1)?"yellow":"" )+'" class="page-link" href="#">'+(i+1)+'</a></li>';
//         // if(currentPage == i+1){
//         //     $(".page-link").css("background", "yellow");
//         // }
//     }
//     if(pageAmount > 1 && currentPage < pageAmount){
//         pagingStr+= `<li class="page-item" onclick="nextPage(${pageAmount})"><a class="page-link" href="#">Next</a></li>`;
//     }
//     if(pageAmount == 1){
//         pagingStr ='';
//     }
//     else{
//         $("#paging-notifications").empty();
//         $("#paging-notifications").html(pagingStr);
//     }
// }

// function getNotifications(){
//     $.ajax({
//         url: 'http://localhost:8080/hsocial/notifications/' + idUser + '?page=' + currentPage + '&size=' + sizePage + '&sort=createdAt,desc',
//         type: 'GET',
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//         },
//         success: function(data){
//             pagingNotifications(data.totalPages);
//             if(data.content.length > 0){
//                 $("#show-amount-notifications").css("display", "block");
//                 var amountNotifications = 0;
//                 var notificationStr = '';
//                 $.each(data.content, function(index, item){
//                     if(!item.isRead){
//                         amountNotifications ++;
//                     }
//                     var avtUrl = '';
//                     if(item.friend.attachment == null){
//                         avtUrl = 'avtdefault.png';
//                     }
//                     else{
//                         avtUrl = item.friend.attachment.fileName;
//                     }
//                     notificationStr += `<li onclick = 'changeUser(${item.friend.userId})' style="margin-bottom: 10px; cursor: pointer; border-bottom: 1px solid black;">
//                                             <div style = "display: flex; align-items: center;">
//                                                 <img src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="" style="width: 40px; height: 40px; margin-right: 20px; border-radius: 50% 50%;">
//                                                 <p style="margin: 0;">${item.notificationText}</p>
//                                             </div>
//                                         </li>`;
//                 })
//                 $("#list-notifications").html(notificationStr);
//                 if(amountNotifications == 0){
//                     $("#show-amount-notifications").css("display", "none");
//                 }
//                 else{
//                     $(".amount-notification").html(amountNotifications);
//                 }
//             }
//             else{
//                 $("#show-amount-notifications").css("display", "none");
//                 $("#list-notifications").html("Chưa có thông báo nào.");
//             }
//         }
//     })
// }

// function changePage(page){
//     if(page == currentPage){
//         return;
//     }
//     currentPage = page;
//     getNotifications();
// }
// function previousPage(){
        
//     if(currentPage == 1){
//         currentPage = 1;
//     }
//     else{
//         currentPage = currentPage -1;
//     }
//     getNotifications();
// }
// function nextPage(pageAmount){
    
//     if(currentPage == pageAmount){
//         currentPage = pageAmount;
//     }
//     else{
//         currentPage = currentPage +1;
//     }
//     getNotifications();
// }

// // đọc thông báo
// function readNotifications(){
//     $("#notifications").css("display", "block");
//     $.ajax({
//         url: 'http://localhost:8080/hsocial/notifications/' + idUser,
//         type: 'PUT',
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//         },
//         success: function(){
//             getNotifications();
//         }
//     })
// }

// // sau 5 phút thì tải thông báo 1 lần
// setInterval(function(){
//     getNotifications();
// }, 300000)


