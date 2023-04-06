package com.project.hsocial.service;

import com.project.hsocial.dto.FriendShipDTO;

import java.util.List;

public interface IFriendShipsService {
    List<FriendShipDTO> getFriendsByUserId(int userId);
    void cancelFriendShip(int id);
    void sendFriendRequest(int userId, int friendId);
    void acceptFriendRequest(int fiendShipsId);
}
