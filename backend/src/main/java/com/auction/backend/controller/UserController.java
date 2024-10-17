package com.auction.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.backend.model.User;
import com.auction.backend.service.UserService;

@RestController
@RequestMapping("api/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.create(user);
    }

    @GetMapping("/{id}")
    public User read(@PathVariable("id") Long id) {
        return userService.read(id);
    }
    
    @GetMapping("/{cpf}")
    public User readCpf(@PathVariable("cpf") String cpf) {
        return userService.readCpf(cpf);
    }

    @PutMapping
    public User update(@RequestBody User user) {
        return userService.update(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        userService.delete(id);
    }

    @GetMapping
    public List<User> list() {
        return userService.list();
    }

    @PostMapping("/validate-cpf")
    public UserService.CpfCriteria cpfValidation(@RequestBody String cpf) {
        return userService.cpfValidation(cpf);
    }

    @PostMapping("/validate-email")
    public UserService.EmailCriteria emailValidation(@RequestBody String email) {
        return userService.emailValidation(email);
    }

    @PostMapping("/validate-password")
    public UserService.PasswordCriteria passwordValidation(@RequestBody String password) {
        return userService.passwordValidation(password);
    }

}
