package com.auction.backend.exception;

public class UserException extends RuntimeException {
    public UserException(String message) {
        super(message);
    }
}