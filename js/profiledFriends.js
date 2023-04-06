
$(function(){
    // nếu chưa đăng nhập thì nhảy sang trang login
    if(!isLogin()){
        window.location.replace("http://127.0.0.1:5500/html/login.html");
    }
    getProfileUser();
    getUserMain();
    showAvatarListFriend();
    getNotifications();
})

// lấy userid khi đăng nhập để call api
var idUser = storage.getItem("id");
var idFriend = sessionStorage.getItem("idFriend");

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


// // 
// function getUserMain(){
//     $.ajax({
//         type: "GET",
//         url: "http://localhost:8080/hsocial/users/"+idUser,
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
//         },
//         success: function (data) {
//             $(".user-name").html(data.userName);
//             var avtUrl;
//             if(data.attachmentAvatar == null){
//                 avtUrl = "avtdefault.png";
//             }
//             else{
//                 avtUrl = data.attachmentAvatar.fileName;
//             }
//             $(".avatar-user-main").attr("src", "../HSocial App/HSocial/src/main/resources/static/images/"+avtUrl);
//         }
//     });
// }

// build list posts
function buildListPosts(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/hsocial/posts/"+idFriend,
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

                // hiển thị ng dùng đã like bài viết chưa 
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
        url: "http://localhost:8080/hsocial/users/"+idFriend,
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
        url: "http://localhost:8080/hsocial/users/"+idFriend,
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
        url: "http://localhost:8080/hsocial/friendships/"+idFriend,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function(data){
            console.log(data);
            isFriend(data);
            showListFriends(data);
            var amountFriends = 0;
            // nếu số bạn bè nhiều hơn 4 thì chỉ hiện 4 ảnh bạn bè.
            if(data.length>4){
                var strAvt = "";
                for(var i =0; i<4; i++){
                    // trường hợp bạn ở friend
                    if(data[i].user.userId == idFriend && data[i].status == 'accepted'){
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
                    else if (data[i].user.userId != idFriend && data[i].status == 'accepted'){
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
                var strAvt = "";
                var amountFriends = 0;
                for(var i =0; i<data.length; i++){
                    if(data[i].user.userId == idFriend && data[i].status == 'accepted'){
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
                    else if(data[i].user.userId != idFriend && data[i].status == 'accepted'){
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

function isFriend(data){
    if(data.length == 0){
        $("#is-friend").html("<button onclick = 'sendFriendRequest()' type='button' style='background-color: rgb(170, 158, 158);'>Thêm bạn bè</button>"+
        "<button type='button' style='background-color: blue; color: white;'><i class='fas fa-comment-dots'></i> Nhắn tin</button>");
    }
    else{
        var isFriend = "";
        for(var i = 0; i<data.length; i++){
            // kiểm tra xem đã kết bạn chưa
            if(data[i].user.userId != idUser && data[i].friend.userId != idUser){
                $("#is-friend").html("<button onclick = 'sendFriendRequest()' type='button' style='background-color: rgb(170, 158, 158);'>Thêm bạn bè</button>"+
                "<button type='button' style='background-color: blue; color: white;'><i class='fas fa-comment-dots'></i> Nhắn tin</button>");
            }
            else if((data[i].user.userId == idUser || data[i].friend.userId == idUser) && data[i].status == 'accepted'){
                $("#is-friend").html("<button onclick = 'unfriend("+ data[i].friendshipsId + ")' type='button' style='background-color: rgb(170, 158, 158);'><i class='fas fa-user-check'></i>Bạn bè</button>"+
                "<button type='button' style='background-color: blue; color: white;'><i class='fas fa-comment-dots'></i> Nhắn tin</button>");
                break;
            }
            else if((data[i].user.userId == idUser && data[i].friend.userId == idFriend) && data[i].status == 'pending'){
                $("#is-friend").html("<button onclick = 'unfriend(" + data[i].friendshipsId + ")' type='button' style='background-color: rgb(170, 158, 158);'>Đã gửi lời mời kết bạn</button>"+
                "<button type='button' style='background-color: blue; color: white;'><i class='fas fa-comment-dots'></i> Nhắn tin</button>");
                break;
            }
            else if((data[i].user.userId == idFriend && data[i].friend.userId == idUser) && data[i].status == 'pending'){
                $("#is-friend").html("<button onclick = 'acceptFriednRequest(" + data[i].friendshipsId + ")' type='button' style='background-color: rgb(170, 158, 158);'>Xác nhận</button>"+
                "<button type='button' style='background-color: blue; color: white;'><i class='fas fa-comment-dots'></i> Nhắn tin</button>");
                break;
            }
        }
    }
}
function unfriend(friendShipsId){
    var isUnfriend = confirm("Bạn có muốn huỷ kết bạn?");
    if(isUnfriend){
        $.ajax({
            url: 'http://localhost:8080/hsocial/friendships/'+friendShipsId,
            type: 'DELETE',
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            success: function(){
                getProfileUser();
                showAvatarListFriend();
            }
        });
    }
}
function sendFriendRequest(){
    $.ajax({
        url: 'http://localhost:8080/hsocial/friendships/' + idUser + '/' + idFriend,
        type: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function(){
            getProfileUser();
            showAvatarListFriend();
        }
    })
}
function acceptFriednRequest(friendShipsId){
    $.ajax({
        url: 'http://localhost:8080/hsocial/friendships/'+friendShipsId,
        type: 'PUT',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function(){
            getProfileUser();
            showAvatarListFriend();
        }
    })
}

// hiển thị danh sách bạn bè
function showListFriends(data){
    var strFriends = "";
    for(var i =0; i<data.length; i++){
        if(data[i].user.userId == idFriend && data[i].status == 'accepted'){
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
        else if(data[i].user.userId != idFriend && data[i].status == 'accepted'){
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
        url: "http://localhost:8080/hsocial/users/"+idFriend,
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
            $(".user-name-friends").html(data.userName);
            $("#intro").html(data.description);
            $("#education").html(data.education);
            $("#address").html(data.address);
            $("#date-of-birth").html(formatDate(data.dateOfBirth));
            $("#phone-number-modal").html(data.phoneNumber);
            $("#placeholder-post").attr("placeholder", "Bạn đang nghĩ gì?, "+ data.userName + "?");
            // $("#number-friend").html(data.users.length + " Bạn bè");
            showPhotosUser(data, 6);
            // showAvatarListFriend(data);
            // showListFriends(data);
            buildListPosts();
        }
    });
}



// lấy tên của ảnh sau dấu "/"" và trước dấu "." 
// function getNamePhoto(url){
//     var parts = url.split("/");
//     var fileAvatar = parts[parts.length - 1];
//     var avtNameValueParts = fileAvatar.split(".");
//     var avtNameValue = avtNameValueParts[0];
//     return avtNameValue;
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
//                     avtUrl = "avtdefault.png";
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

// //hide comment box
// function hideCommentBox(){
//     $("#modal-comment").css("display", "none");
//     $("#valueComment").val("");
//     buildListPosts();
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

// delete comment
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
// var sizePage = 5;
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




