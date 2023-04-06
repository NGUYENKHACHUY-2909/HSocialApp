package com.project.hsocial.controller;

import com.project.hsocial.dto.UserDTO;
import com.project.hsocial.entity.User;
import com.project.hsocial.form.UpdateUserForm;
import com.project.hsocial.service.IUserService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(value = "hsocial/users")
@Validated
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private IUserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUsers(){
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOS = modelMapper.map(users, new TypeToken<List<UserDTO>>(){}.getType());
        return new ResponseEntity<>(userDTOS, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<?> updateUser(@PathVariable(value = "id") int id, @RequestBody @Valid UpdateUserForm form){
        userService.updateuser(id, form);
        return new ResponseEntity<>("Update Success!", HttpStatus.OK);
    }
    @GetMapping(value = "/{id}")
    public ResponseEntity<?> getUserById(@PathVariable (value = "id") int id){
        User user = userService.getUserById(id);
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

    @GetMapping(value = "search")
    public ResponseEntity<?> getUserByName(@RequestParam(value = "name") String name){
        List<User> users = userService.getUserByName(name);
        List<UserDTO> userDTOS = modelMapper.map(users, new TypeToken<List<UserDTO>>(){}.getType());
        return new ResponseEntity<>(userDTOS, HttpStatus.OK);
    }
}
