$(function(){
    // nếu chưa đăng nhập thì nhảy sang trang login
    if(!isLogin()){
        window.location.replace("http://127.0.0.1:5500/html/login.html");
    }
    // getProfileUser();
    // showAvatarListFriend();
    getUserMain();
    getNotifications();
    buildListPosts();
})

// lấy userid khi đăng nhập để call api
var idUser = storage.getItem("id");

var userSettings = document.querySelector(".user-settings");
var darkBtn = document.getElementById("dark-button");
var LoadMoreBackground =document.querySelector(".btn-LoadMore");

// show option menu
function UserSettingToggle(){
    userSettings.classList.toggle("user-setting-showup-toggle");
}

// reload lại trang
function reload(){
    location.reload();
}

// var currentPagePosts = 1;
// var sizePagePosts = 3;
// build list posts
function buildListPosts(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/hsocial/posts/friendsPosts/" + idUser,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function (data) {
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
                    <div class = "dropdown" id = "dropdown-${index}"></div>`;
                    if(item.user.userId == idUser){
                        strPost += `<a class="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">Tuỳ chọn</a>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <li onclick = "showModalUpdatePost(${item.postId})"><a class="dropdown-item" href="#">Chỉnh sửa</a></li>
                                <li onclick = "deletePost(${item.postId})"><a class="dropdown-item">Xoá</a></li>
                            </ul>`;
                    }
                    strPost +=`</div>
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
