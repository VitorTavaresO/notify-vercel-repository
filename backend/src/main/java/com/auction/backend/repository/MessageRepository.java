package com.auction.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.auction.backend.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Message findByAuthor(String author);
}
