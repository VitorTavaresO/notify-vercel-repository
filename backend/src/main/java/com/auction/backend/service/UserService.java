package com.auction.backend.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.auction.backend.model.User;
import com.auction.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User create(User user) {
        User userSaved = userRepository.save(user);
        Context context = new Context();
        context.setVariable("name", userSaved.getName());

        return userSaved;
    }

    public User read(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public User update(User user) {
        User savedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        savedUser.setName(user.getName());
        return userRepository.save(savedUser);
    }

    public void delete(Long id) {
        User savedUser = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        userRepository.delete(savedUser);
    }

    public List<User> list() {
        return userRepository.findAll();
    }
}
