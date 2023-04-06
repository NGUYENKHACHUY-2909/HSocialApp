package com.project.hsocial.service;

import com.project.hsocial.entity.User;
import com.project.hsocial.form.UpdateUserForm;
import com.project.hsocial.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService implements IUserService{

    @Autowired
    private IUserRepository userRepository;
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    @Override
    public void updateuser(int userId, UpdateUserForm form) {
        User  user= getUserById(userId);
        user.setUserId(userId);
        user.setAddress(form.getAddress());
        user.setUserName(form.getUserName());
        user.setDateOfBirth(form.getDateOfBirth());
        user.setPhoneNumber(form.getPhoneNumber());
        user.setDescription(form.getDescription());
        user.setEducation(form.getEducation());
        userRepository.save(user);
    }

    @Override
    public User getUserById(int id) {
        return userRepository.findById(id).get();
    }

    @Override
    public List<User> getUserByName(String name) {
        return userRepository.getUserByName(name);
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if(user == null){
            throw new UsernameNotFoundException(email);
        }
        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            AuthorityUtils.createAuthorityList("ADMIN")
        );
    }
    public User getUserByEmail(String email){
        User user = userRepository.findByEmail(email);
        return user;
    }
}
