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

    // Para requisições JSON simples, sem arquivos
    @PostMapping(consumes = "application/json")
    public Message createJson(@RequestBody Message message) {
        return messageService.create(message, List.of()); // Lista vazia para arquivos
    }

    @PostMapping(consumes = "multipart/form-data")
    public Message createMultipart(
            @RequestPart("message") String messageJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files)
            throws JsonMappingException, JsonProcessingException {
        // Converter o JSON recebido como String para um objeto Message
        ObjectMapper objectMapper = new ObjectMapper();
        Message message = objectMapper.readValue(messageJson, Message.class);

        for (MultipartFile file : files) {
            System.out.println("Nome do Arquivo: " + file.getOriginalFilename());
            System.out.println("Tipo MIME: " + file.getContentType());
        }

        // Chamar o serviço com a mensagem e os arquivos
        return messageService.create(message, files != null ? files : List.of());
    }

    // Para requisições JSON simples, sem arquivos
    @PutMapping(consumes = "application/json")
    public Message updateJson(@RequestBody Message message) {
        return messageService.update(message, List.of()); // Lista vazia para arquivos
    }

    // Para requisições multipart/form-data, com arquivos
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

    @GetMapping
    public Iterable<Message> findAll() {
        return messageService.findAll();
    }
}
