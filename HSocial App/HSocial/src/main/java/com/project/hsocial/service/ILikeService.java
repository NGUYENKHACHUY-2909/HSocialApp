package com.project.hsocial.service;

import com.project.hsocial.form.CreateLikeForm;

public interface ILikeService {
     void likePosts(CreateLikeForm form);
     int getUserIdByLikeId(int likeId);

     void cancelLike(int userId, int postId);

}
