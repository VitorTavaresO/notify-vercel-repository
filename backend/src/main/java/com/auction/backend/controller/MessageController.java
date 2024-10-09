package com.auction.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.auction.backend.model.Message;
import com.auction.backend.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;

    @PostMapping
    public Message create(
            @RequestPart("message") Message message,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        return messageService.create(message, files != null ? files : List.of());
    }
    
    @PutMapping
    public Message update(
            @RequestPart("message") Message message,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        return messageService.update(message, files != null ? files : List.of());
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
