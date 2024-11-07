package com.auction.backend.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.auction.backend.model.Annex;
import com.auction.backend.model.Message;
import com.auction.backend.repository.MessageRepository;

@Service
public class MessageService {

    private final String uploadDir = "C:/Codes/Mythos/notify/uploads";

    @Autowired
    private MessageRepository messageRepository;

    public Message create(Message message, List<MultipartFile> files) {
        try {
            // Verificar se as listas de turmas e cursos estão populadas corretamente antes
            // de salvar
            System.out.println("Salvando cursos: " + message.getCourse());
            System.out.println("Salvando turmas: " + message.getClassName());

            // Persistir a mensagem e os anexos (se houver)
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    Annex annex = createAnnex(file);
                    message.addAnnex(annex);
                }
            }

            return messageRepository.save(message); // Salvar a mensagem e os dados associados

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
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
            System.out.println("Diretório criado: " + directory.getAbsolutePath());
        }

        Annex annex = new Annex();
        annex.setFileName(file.getOriginalFilename());
        annex.setMimeType(file.getContentType());
        annex.setSize(file.getSize());

        File targetFile = new File(directory, file.getOriginalFilename());
        try {
            System.out.println("Salvando arquivo: " + targetFile.getAbsolutePath());
            file.transferTo(targetFile);
            annex.setPath(targetFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Erro ao salvar arquivo: " + e.getMessage());
            throw new RuntimeException("Erro ao salvar arquivo", e);
        }

        return annex;
    }
}
