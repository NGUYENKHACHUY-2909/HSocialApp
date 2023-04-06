package com.project.hsocial.service;

import com.project.hsocial.entity.Like;
import com.project.hsocial.entity.Notifications;
import com.project.hsocial.entity.Post;
import com.project.hsocial.entity.User;
import com.project.hsocial.form.CreateLikeForm;
import com.project.hsocial.repository.INotificationsRepository;
import com.project.hsocial.repository.IPostRepository;
import com.project.hsocial.repository.IUserRepository;
import com.project.hsocial.repository.LikeRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LikeService implements ILikeService{

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private INotificationsRepository notificationsRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IPostRepository postRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Override
    public void likePosts(CreateLikeForm form) {
        Like like = modelMapper.map(form, Like.class);
        likeRepository.save(like);
        Notifications notifications = new Notifications();
        int userId = form.getUser().getUserId();
        User user = userRepository.findById(userId).get();
        int postId = form.getPost().getPostId();
        Post post = postRepository.findById(postId).get();
        notifications.setNotificationText(user.getUserName() + " đã thích bài viết của bạn.'" +  post.getContent() + "'");
        // thong bao cua nguoi dung nao?
        notifications.setUser(post.getUser());
        notifications.setIsRead(Boolean.FALSE);
        notifications.setFriend(user);
        if(form.getUser().getUserId() != post.getUser().getUserId()){
            notificationsRepository.save(notifications);
        }
    }

    @Override
    public int getUserIdByLikeId(int likeId) {
        return likeRepository.getUserByLikeId(likeId);
    }

    @Override
    public void cancelLike(int userId, int postId) {
        likeRepository.cancelLikeByUserIdAndPostId(userId, postId);
    }

}
