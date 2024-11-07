package com.auction.backend.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("index/")
public class Index {
    
    @GetMapping("/")
    public String index() {
        return "Hello World!";
    }
    
    @PostMapping
    public String post() {
        return "Success";
    }
}
