package com.auction.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        try {
            System.out.println("JSON recebido: " + messageJson); // Verifica o JSON recebido

            ObjectMapper objectMapper = new ObjectMapper();
            Message message = objectMapper.readValue(messageJson, Message.class); // Desserializa o JSON

            // Verifica se as listas foram corretamente populadas
            System.out.println("Cursos recebidos: " + message.getCourse());
            System.out.println("Turmas recebidas: " + message.getClassName());

            // Chama o serviço para criar a mensagem e salva anexos, se houver
            return messageService.create(message, files != null ? files : List.of());

        } catch (JsonMappingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de JSON inválido", e);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erro de processamento de JSON", e);
        }
    }

    @PutMapping(consumes = "application/json")
    public Message updateJson(@RequestBody Message message) {
        return messageService.update(message, List.of());
    }

    @PutMapping(consumes = "multipart/form-data")
    public Message updateMultipart(
            @RequestPart("message") String messageJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files)
            throws JsonMappingException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Message message = objectMapper.readValue(messageJson, Message.class);
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
        return messageService.findAll(); // Simplesmente retorna a lista, Spring converte para JSON automaticamente
    }
}
