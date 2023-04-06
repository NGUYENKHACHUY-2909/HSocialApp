package com.project.hsocial.service;

import com.project.hsocial.entity.User;
import com.project.hsocial.form.UpdateUserForm;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;


public interface IUserService extends UserDetailsService {
     List<User> getAllUsers();
     void updateuser(int userId, UpdateUserForm form);
     User getUserById(int id);

     List<User> getUserByName(String name);

     User getUserByEmail(String email);



}
