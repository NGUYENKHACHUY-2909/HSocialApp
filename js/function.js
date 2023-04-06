//kiểm tra xem đã đăng nhập chưa.
function isLogin(){
    var idUser = storage.getItem("id");
    if(idUser){
        return true;
    }
    else{
        return false;
    }
}
// hàm hiển thị ảnh theo number
function showPhotosUser(data, number){
    var dem = 0;
    var strPhoto = "";
    $.each(data.posts, function(index, item){
        if(item.attachmentFile !== null && item.attachmentFile != ""){
            dem++;
            strPhoto += `<img src="../HSocial App/HSocial/src/main/resources/static/images/${item.attachmentFile}" alt="">`;
        }
        if(dem == number){
            return false;
        }
    })
    $("#photos-user").html(strPhoto);
}

function changeUser(userId){
    sessionStorage.setItem("idFriend", userId);
    if(userId == idUser){
        window.location.href = "http://127.0.0.1:5500/html/profile.html";
    }
    else{
        window.location.href = "http://127.0.0.1:5500/html/profilefriend.html";
    }
}

// format date yyyy--MM-dd
function formatDate(date){
    const dateObject = new Date(date);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}

// lấy tên của ảnh sau dấu "/"" và trước dấu "." 
function getNamePhoto(url){
    var parts = url.split("/");
    var fileAvatar = parts[parts.length - 1];
    var avtNameValueParts = fileAvatar.split(".");
    var avtNameValue = avtNameValueParts[0];
    return avtNameValue;
}

// show comment box
function showCommentBox(postId){
    $("#modal-comment").css("display", "block");
    // call API get comment by postId
    $.ajax({
        url: "http://localhost:8080/hsocial/comments/" + postId,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function(data){
            $("#btn-sent-comment").attr("onclick", "upComment(" + postId + ")");
            var strComment = "";
            $.each(data, function(index, item){
                var avtUrl = '';
                if(item.user.attachment == null){
                    avtUrl = 'avtdefault.png';
                }
                else{
                    avtUrl = item.user.attachment.fileName; 
                }
                strComment += `<div class="card mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex flex-row align-items-center">
                                <img src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="avatar" width="25" height="25" />
                                <p class="small mb-0 ms-2">${item.user.userName}</p>
                            </div>
                            <div class="d-flex flex-row align-items-center">
                            <p class="small text-muted mb-0">${item.createDate}</p>
                          </div>
                          <div class="dropdown">
                          <a class="btn btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                            Tuỳ chọn
                          </a>
                          <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <li onclick = "deleteComment(${item.commentId}, ${postId})"><a class="dropdown-item">Xoá</a></li>
                          </ul>
                        </div>
                        </div>
                        <p style = "margin-top: 15px">${item.contentComment}</p>
                    </div>
                </div>`
            });
            $("#comment-line").html(strComment);
        },
        error: function(){
            alert("Lỗi không lấy được comment!")
        }
    });
}

//hide comment box
function hideCommentBox(){
    $("#modal-comment").css("display", "none");
    $("#valueComment").val("");
    buildListPosts();
}

// up comment
function upComment( postId){
    var valueComment = $("#valueComment").val().trim();
    if(valueComment){
        dataJSON = {
            "contentComment": valueComment,
            "user": {
                "userId": idUser
            },
            "post": {
                "postId": postId
            }
        }
        $.ajax({
            url: "http://localhost:8080/hsocial/comments",
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            data: JSON.stringify(dataJSON),
            contentType: 'application/json; charset=utf-8',
            success: function(){
                showCommentBox(postId);
                $("#valueComment").val("");
                var content = document.getElementById("modal-comment-body");
                content.scrollTop = content.scrollHeight;
            },
            error: function(){
                alert("Bình luận không thành công!");
            }
        })
    }
    else{
        return;
    }
}

// delete comment
function deleteComment(commentId, postId){
    var valueDeleteComment = confirm("Bạn có muốn xoá bình luận không?");
    if(valueDeleteComment == true){
        $.ajax({
            url: "http://localhost:8080/hsocial/comments/"+commentId,
            type: "DELETE",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            success: function(){
                alert("Xoá thành công.");
                showCommentBox(postId);
            },
            error: function(){
                alert("Xoá bình luận không thành công");
            }
        })
    }
}

// like và huỷ like
function handleLike(index, postId){
    if($("#like-posts-"+index).css("color") == "rgb(0, 0, 255)"){
        $.ajax({
            url: "http://localhost:8080/hsocial/likes/"+idUser+"/"+postId,
            type: "DELETE",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            success: function(){
                buildListPosts();
                // $("#like-posts-"+index).css("color", "grey");
            }
        })
    }
    else{
        var createLikeData = {
            "user": {
                "userId": idUser
            },
            "post": {
                "postId": postId
            }
        }
        $.ajax({
            url: "http://localhost:8080/hsocial/likes",
            type: "POST",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            data: JSON.stringify(createLikeData),
            contentType: 'application/json; charset=utf-8',
            success: function(){
                buildListPosts();
                // $("#like-posts-"+index).css("color", "blue");
            }
        })
    }
}
// hiển thị kết quả tìm kiếm
function sugesstionsSearch(){
    $("#sugesstions").css("display", "block");
    var searchValue = $("#search-value").val();
    if(searchValue != ""){
        $.ajax({
            url: "http://localhost:8080/hsocial/users/search?name="+searchValue,
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            success: function(data){
                if(data == ""){
                    $("#list-suggestions").html("Không tìm thấy kết quả.");
                }
                else{
                    var searchStr = "";
                    $.each(data, function(index, item){
                        var avt = "";
                        if(item.attachmentAvatar == null){
                            avt = "avtdefault.png";
                        }
                        else{
                            avt = item.attachmentAvatar.fileName;
                        }
                        searchStr += `<li onclick = "changeUser(${item.userId})" style="margin-bottom: 10px; cursor: pointer;"><img src="../HSocial App/HSocial/src/main/resources/static/images/${avt}" alt="" style="width: 40px; height: 40px; margin-right: 20px; border-radius: 50% 50%;">${item.userName}</li>`
                    })
                    $("#list-suggestions").html(searchStr);
                }
            }
        })
    }
}
// ẩn ô tìm kiếm 
function hideSearch(){
    $("#sugesstions").css("display", "none");
    $("#notifications").css("display", "none");
    currentPage = 1;
}

// hien thi thong bao
var currentPage = 1;
var sizePage = 5;
function pagingNotifications(pageAmount){
    var pagingStr ="";
    if(pageAmount>1 && currentPage >1){
        pagingStr+= `<li class="page-item" onclick="previousPage()"><a class="page-link" href="#">Previous</a></li>`;
    }
    for(i=0; i<pageAmount; i++){
        pagingStr+= '<li class="page-item" onclick="changePage('+(i+1)+')"><a style="background-color: '+(currentPage==(i+1)?"yellow":"" )+'" class="page-link" href="#">'+(i+1)+'</a></li>';
        // if(currentPage == i+1){
        //     $(".page-link").css("background", "yellow");
        // }
    }
    if(pageAmount > 1 && currentPage < pageAmount){
        pagingStr+= `<li class="page-item" onclick="nextPage(${pageAmount})"><a class="page-link" href="#">Next</a></li>`;
    }
    if(pageAmount == 1){
        pagingStr ='';
    }
    else{
        $("#paging-notifications").empty();
        $("#paging-notifications").html(pagingStr);
    }
}

function getNotifications(){
    $.ajax({
        url: 'http://localhost:8080/hsocial/notifications/' + idUser + '?page=' + currentPage + '&size=' + sizePage + '&sort=createdAt,desc',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function(data){
            pagingNotifications(data.totalPages);
            if(data.content.length > 0){
                $("#show-amount-notifications").css("display", "block");
                var amountNotifications = 0;
                var notificationStr = '';
                $.each(data.content, function(index, item){
                    if(!item.isRead){
                        amountNotifications ++;
                    }
                    var avtUrl = '';
                    if(item.friend.attachment == null){
                        avtUrl = 'avtdefault.png';
                    }
                    else{
                        avtUrl = item.friend.attachment.fileName;
                    }
                    notificationStr += `<li onclick = 'changeUser(${item.friend.userId})' style="margin-bottom: 10px; cursor: pointer; border-bottom: 1px solid black;">
                                            <div style = "display: flex; align-items: center;">
                                                <img src="../HSocial App/HSocial/src/main/resources/static/images/${avtUrl}" alt="" style="width: 40px; height: 40px; margin-right: 20px; border-radius: 50% 50%;">
                                                <p style="margin: 0;">${item.notificationText}</p>
                                            </div>
                                        </li>`;
                })
                $("#list-notifications").html(notificationStr);
                if(amountNotifications == 0){
                    $("#show-amount-notifications").css("display", "none");
                }
                else{
                    $(".amount-notification").html(amountNotifications);
                }
            }
            else{
                $("#show-amount-notifications").css("display", "none");
                $("#list-notifications").html("Chưa có thông báo nào.");
            }
        }
    })
}

function changePage(page){
    if(page == currentPage){
        return;
    }
    currentPage = page;
    getNotifications();
}
function previousPage(){
        
    if(currentPage == 1){
        currentPage = 1;
    }
    else{
        currentPage = currentPage -1;
    }
    getNotifications();
}
function nextPage(pageAmount){
    
    if(currentPage == pageAmount){
        currentPage = pageAmount;
    }
    else{
        currentPage = currentPage +1;
    }
    getNotifications();
}

// đọc thông báo
function readNotifications(){
    $("#notifications").css("display", "block");
    $.ajax({
        url: 'http://localhost:8080/hsocial/notifications/' + idUser,
        type: 'PUT',
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function(){
            getNotifications();
        }
    })
}

// sau 5 phút thì tải thông báo 1 lần
setInterval(function(){
    getNotifications();
}, 300000)

// call api của user đang login
function getUserMain(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/hsocial/users/"+idUser,
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function (data) {
            $(".user-name").html(data.userName);
            var avtUrl;
            if(data.attachmentAvatar == null){
                avtUrl = "avtdefault.png";
            }
            else{
                avtUrl = data.attachmentAvatar.fileName;
            }
            $("#placeholder-post").attr("placeholder", "Bạn đang nghĩ gì, "+ data.userName + "?")
            $(".avatar-user").attr("src", "../HSocial App/HSocial/src/main/resources/static/images/"+avtUrl);
            $(".avatar-user-main").attr("src", "../HSocial App/HSocial/src/main/resources/static/images/"+avtUrl);
        }
    });
}

// show modal update post
function showModalUpdatePost(postId){
    $("#modal-update-post").css("display", "block");
    $.ajax({
        url: "http://localhost:8080/hsocial/posts/postId/" + postId,
        type: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
        },
        success: function(data){
            if(!data.content){
                $("#content-update-post-value").attr("placeholder", "Thêm nội dung bài viết.");
            }else{
                $("#content-update-post-value").val(data.content);
            }
            $("#btn-update-post").attr("onclick", "updatePost(" + data.postId + ")" )

            if(data.attachmentFile){
                $("#show-photo-edit-post").attr("src", "../HSocial App/HSocial/src/main/resources/static/images/"+data.attachmentFile);
            }
        },
        error: function(){

        }
    });
}

//ShowModalPost
function showModalPost(){
    $("#modal-post").css("display", "block");
}

//hide modal Post()
function hideModalPost(){
    $("#modal-post").css("display", "none");
    $("#content-post-value").val("");
    $("#attachemt-file-post").val(null);

}
//onclick create Post
function createPost(){
    if($("#attachemt-file-post").val()){
        $("#create-post-form").submit(function(event){
            event.preventDefault();
            var formData = new FormData(this);
            $.ajax({
                url: "http://localhost:8080/hsocial/posts/"+idUser,
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
                },
                data: formData,
                processData: false,
                contentType: false,
                success: function(reponse){
                    alert("Tạo bài viết thành công!!!");
                    buildListPosts();
                },
                error: function(jqXHR){
                    alert("Tạo bài viết không thành công!!!!");
                }
            });
            this.reset();
            event.preventDefault();
        });
    }
    else{
        return;
    }
}

function hideModaUpdatelPost(){
    $("#modal-update-post").css("display", "none");
}

// update Post
function updatePost(postId){
    $("#update-post-form").submit(function(event){
        event.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: "http://localhost:8080/hsocial/posts/"+ postId,
            type: "PUT",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function(response){
                alert("Cập nhật bài viết thành công");
                buildListPosts();
                hideModaUpdatelPost();
            },
            error: function(response){

            }
        })
    })
}

// delete Post
function deletePost(postId){
    var deletePostValue = confirm("Bạn có chắc muốn xoá bài viết không?");
    if(deletePostValue == true){
        $.ajax({
            url: "http://localhost:8080/hsocial/posts/" + postId,
            type: "DELETE",
            beforeSend: function (xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + btoa(storage.getItem("email") + ":" + storage.getItem("password")));
            },
            success: function(){
                buildListPosts();
                alert("Xoá bài viết thành công");
            },
            error: function(){
                alert("Xoá bài viết không thành công.");
            }
        })
    }
}

function goHomePage(){
    location.href = "http://127.0.0.1:5500/html/index.html#";
}