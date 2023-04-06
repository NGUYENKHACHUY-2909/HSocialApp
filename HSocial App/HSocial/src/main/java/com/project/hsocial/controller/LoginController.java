package com.project.hsocial.controller;

import com.project.hsocial.dto.LoginDTO;
import com.project.hsocial.dto.UserDTO;
import com.project.hsocial.entity.User;
import com.project.hsocial.service.IUserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping(value = "hsocial/login")
@CrossOrigin(origins = "*")
public class LoginController {
    @Autowired
    private IUserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<?> login(Principal principal){
        String email = principal.getName();
        User user = userService.getUserByEmail(email);
        LoginDTO loginDTO = modelMapper.map(user, LoginDTO.class);
        return new ResponseEntity<>(loginDTO, HttpStatus.OK);
    }
}
