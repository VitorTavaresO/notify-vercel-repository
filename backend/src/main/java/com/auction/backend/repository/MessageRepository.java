package com.auction.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.auction.backend.model.Message;

public interface MessageRepository extends JpaRepository<Message, Long> {

    Message findByAuthor(String author);

    

    List<Message> findByCourseContaining(String course);

    List<Message> findByClassNameContaining(String className);

    @Query("SELECT m FROM Message m WHERE :course MEMBER OF m.course")
    List<Message> findMessagesByCourse(String course);
}
