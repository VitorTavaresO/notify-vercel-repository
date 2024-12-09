package com.auction.backend.service;

import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.auction.backend.model.Annex;
import com.auction.backend.model.Message;
import com.auction.backend.repository.MessageRepository;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message create(Message message, List<MultipartFile> files) {
        try {
            System.out.println("Salvando cursos: " + message.getCourse());
            System.out.println("Salvando turmas: " + message.getClassName());

            // Persistir a mensagem e os anexos (se houver)
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    Annex annex = createAnnex(file);
                    message.addAnnex(annex);
                }
            }

            return messageRepository.save(message);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar a mensagem", e);
        }
    }

    public Message update(Message message, List<MultipartFile> newFiles) {
        try {
            Message messageSaved = messageRepository.findById(message.getId())
                    .orElseThrow(() -> new RuntimeException("Message not found"));

            messageSaved.setEmail(message.getEmailList());
            messageSaved.setCourse(message.getCourseList());
            messageSaved.setClassName(message.getClassNameList());
            messageSaved.setTitle(message.getTitle());
            messageSaved.setAuthor(message.getAuthor());
            messageSaved.setData(message.getData());
            messageSaved.setMessage(message.getMessage());

            if (newFiles != null && !newFiles.isEmpty()) {
                for (MultipartFile file : newFiles) {
                    Annex annex = createAnnex(file);
                    messageSaved.addAnnex(annex);
                }
            }

            return messageRepository.save(messageSaved);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao processar a mensagem", e);
        }
    }

    public void delete(Long id) {
        messageRepository.deleteById(id);
    }

    public Message findById(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));
    }

    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    public Message findByAuthor(String author) {
        return messageRepository.findByAuthor(author);
    }

    private Annex createAnnex(MultipartFile file) {
        Annex annex = new Annex();
        annex.setFileName(file.getOriginalFilename());
        annex.setMimeType(file.getContentType());
        annex.setSize(file.getSize());

        try {
            annex.setContent(file.getBytes());
        } catch (IOException e) {
            System.err.println("Erro ao salvar o conteúdo do arquivo no banco de dados: " + e.getMessage());
            throw new RuntimeException("Erro ao salvar conteúdo do arquivo", e);
        }

        return annex;
    }

    public ByteArrayResource downloadAnnex(Long messageId, Long annexId) {
        Annex annex = findAnnexById(messageId, annexId); 

        return new ByteArrayResource(annex.getContent()) {
            @Override
            public String getFilename() {
                return annex.getFileName(); 
            }
        };
    }

    private Annex findAnnexById(Long messageId, Long annexId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        return message.getAnnexes().stream()
                .filter(annex -> annex.getId().equals(annexId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Annex not found"));
    }
}
