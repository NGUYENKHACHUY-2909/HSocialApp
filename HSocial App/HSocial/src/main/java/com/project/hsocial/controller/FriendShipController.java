package com.project.hsocial.controller;

import com.project.hsocial.dto.FriendShipDTO;
import com.project.hsocial.service.IFriendShipsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "hsocial/friendships")
@CrossOrigin(origins = "*")
public class FriendShipController {
    @Autowired
    private IFriendShipsService friendShipsService;
    @GetMapping(value = "/{userId}")
    public List<FriendShipDTO> getFriendsByUserId(@PathVariable (value = "userId") int userID){
        return friendShipsService.getFriendsByUserId(userID);
    }
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> deleteFriendShip(@PathVariable(value = "id") int id){
        friendShipsService.cancelFriendShip(id);
        return new ResponseEntity<>("Huỷ kết bạn thành công.", HttpStatus.OK);
    }

    @PostMapping(value = "/{userId}/{friendId}")
    public ResponseEntity<?> addFriend(@PathVariable(value = "userId") int userId, @PathVariable(value = "friendId") int friendId){
        friendShipsService.sendFriendRequest(userId, friendId);
        return new ResponseEntity<>("Đã gửi lời mời kết bạn", HttpStatus.OK);
    }

    @PutMapping(value = "/{friendShipId}")
    public ResponseEntity<?> updateStatusFriendShip(@PathVariable(value = "friendShipId") int friendShipId){
        friendShipsService.acceptFriendRequest(friendShipId);
        return new ResponseEntity<>("Cập nhật thành công.", HttpStatus.OK);
    }


}
