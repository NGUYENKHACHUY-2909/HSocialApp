package com.project.hsocial.service;

import com.project.hsocial.dto.FriendShipDTO;
import com.project.hsocial.entity.Friendships;
import com.project.hsocial.entity.Notifications;
import com.project.hsocial.entity.User;
import com.project.hsocial.repository.IFriendShipsRepository;
import com.project.hsocial.repository.INotificationsRepository;
import com.project.hsocial.repository.IUserRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FriendShipService implements IFriendShipsService{
    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private INotificationsRepository notificationsRepository;

    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private IFriendShipsRepository friendShipsRepository;
    @Override
    public List<FriendShipDTO> getFriendsByUserId(int userId) {
        List<Friendships> friendships =  friendShipsRepository.getFriendsByUserId(userId);
        List<FriendShipDTO> friendShipDTOS = modelMapper.map(friendships, new TypeToken<List<FriendShipDTO>>(){}.getType());
        return friendShipDTOS;
    }

    @Override
    @Transactional
    public void cancelFriendShip(int id) {
        friendShipsRepository.deleteById(id);
    }

    @Override
    @Transactional
    // nguoi gui co id la userId, nguoi nhan co id friendId
    public void sendFriendRequest(int userId, int friendId) {
        Friendships friendships = new Friendships();
        // nguoi gui loi moi ket ban
        User user = userRepository.findById(userId).get();
        friendships.setUser(user);
        User friend = userRepository.findById(friendId).get();
        friendships.setFriend(friend);
        friendships.setStatus(Friendships.Status.pending);
        friendShipsRepository.save(friendships);
        Notifications notifications = new Notifications();
        notifications.setNotificationText(user.getUserName() + " đã gửi cho bạn lời mời kết bạn");
        notifications.setFriend(user);
        // thong bao cua nguoi dung nao?
        notifications.setUser(friend);
        notifications.setIsRead(Boolean.FALSE);
        notificationsRepository.save(notifications);
    }

    @Override
    @Transactional
    // chap nhan loi moi ket ban bang cach thay doi status = accepted
    public void acceptFriendRequest(int fiendShipsId) {
        Friendships friendships = friendShipsRepository.findById(fiendShipsId).get();
        friendships.setStatus(Friendships.Status.accepted);
        // lay ra nguoi gui loi moi ket ban de gui thong bao khi da duoc chap nhan ket ban
        User user = friendships.getUser();
        // lay ten nguoi da chap nhan ket ban
        User friend = friendships.getFriend();
        Notifications notifications = new Notifications();
        notifications.setUser(user);
        notifications.setNotificationText(friend.getUserName() + " đã chấp nhận lời mời kết bạn.");
        notifications.setIsRead(Boolean.FALSE);
        notifications.setFriend(friend);
        friendShipsRepository.save(friendships);
        notificationsRepository.save(notifications);
    }
}
