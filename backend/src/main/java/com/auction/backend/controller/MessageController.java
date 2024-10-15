package com.auction.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.auction.backend.model.Message;
import com.auction.backend.service.MessageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping(consumes = "application/json")
    public Message createJson(@RequestBody Message message) {
        return messageService.create(message, List.of());
    }

    @PostMapping(consumes = "multipart/form-data")
    public Message createMultipart(
            @RequestPart("message") String messageJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files)
            throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Message message = objectMapper.readValue(messageJson, Message.class);
        return messageService.create(message, files != null ? files : List.of());
    }

    @PutMapping(consumes = "application/json")
    public Message updateJson(@RequestBody Message message) {
        return messageService.update(message, List.of());
    }

    @PutMapping(consumes = "multipart/form-data")
    public Message updateMultipart(
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

    @GetMapping("/author/{author}")
    public Message findByAuthor(@PathVariable String author) {
        return messageService.findByAuthor(author);
    }

    @GetMapping
    public Iterable<Message> findAll() {
        return messageService.findAll();
    }
}

