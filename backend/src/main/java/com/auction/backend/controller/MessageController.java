package com.auction.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.backend.model.Message;
import com.auction.backend.service.MessageService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;

    @PostMapping
    public Message create(@RequestBody Message message) {
        return messageService.create(message);
    }
    
    @PutMapping
    public Message update(@RequestBody Message message) {
        return messageService.update(message);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        messageService.delete(id);
    }

    @GetMapping("/{id}")
    public Message findById(@PathVariable Long id) {
        return messageService.findById(id);
    }

    @GetMapping
    public Iterable<Message> findAll() {
        return messageService.findAll();
    }
}
