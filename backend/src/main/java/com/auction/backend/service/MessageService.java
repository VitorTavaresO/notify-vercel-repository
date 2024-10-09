package com.auction.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.auction.backend.model.Message;
import com.auction.backend.repository.MessageRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message create (Message message) {
        return messageRepository.save(message);
    }

    public Message update (Message message) {
        Message messageSaved = messageRepository.findById(message.getId())
            .orElseThrow(() -> new RuntimeException("Message not found"));
        messageSaved.setTitle(message.getTitle());
        messageSaved.setAuthor(message.getAuthor());
        messageSaved.setCategory(message.getCategory());
        messageSaved.setRecipient(message.getRecipient());
        messageSaved.setMessage(message.getMessage());
        messageSaved.setLink(message.getLink());
        messageSaved.setDate(message.getDate());
        messageSaved.setURLImagem(message.getURLImagem());
        return messageRepository.save(messageSaved);
    }

    public void delete (Long id) {
        messageRepository.deleteById(id);
    }

    public Message findById (Long id) {
        return messageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Message not found"));
    }

    public Iterable<Message> findAll () {
        return messageRepository.findAll();
    }

}
