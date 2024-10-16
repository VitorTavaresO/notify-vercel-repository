package com.auction.backend.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.auction.backend.model.User;
import com.auction.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User create(User user) {
        User userSaved = userRepository.save(user);
        Context context = new Context();
        context.setVariable("name", userSaved.getName());

        return userSaved;
    }

    public User read(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public User update(User user) {
        User savedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        savedUser.setName(user.getName());
        return userRepository.save(savedUser);
    }

    public void delete(Long id) {
        User savedUser = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        userRepository.delete(savedUser);
    }

    public List<User> list() {
        return userRepository.findAll();
    }

    // --------------- CPF VALIDATION ---------------
    private boolean isRepeatedSequence(String cpf) {
        return cpf.equals("11111111111") || cpf.equals("22222222222") ||
                cpf.equals("33333333333") || cpf.equals("44444444444") ||
                cpf.equals("55555555555") || cpf.equals("66666666666") ||
                cpf.equals("77777777777") || cpf.equals("88888888888") ||
                cpf.equals("99999999999");
    }

    private boolean isValidCpf(String cpf) {
        int sum = 0;
        int weight = 10;

        for (int i = 0; i < 9; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * weight--;
        }

        int firstDigit = calculateVerifierDigit(sum);
        if (firstDigit != Character.getNumericValue(cpf.charAt(9))) {
            return false;
        }

        sum = 0;
        weight = 11;
        for (int i = 0; i < 10; i++) {
            sum += Character.getNumericValue(cpf.charAt(i)) * weight--;
        }

        int secondDigit = calculateVerifierDigit(sum);
        return secondDigit == Character.getNumericValue(cpf.charAt(10));
    }

    private int calculateVerifierDigit(int sum) {
        int remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }

    void cpfValidation(String cpf) {
        cpf = cpf.replaceAll("\\D", "");
    
        if (cpf == null || !cpf.matches("\\d{11}")) {
            throw new IllegalArgumentException("CPF deve conter 11 dígitos.");
        }

        if (isRepeatedSequence(cpf)) {
            throw new IllegalArgumentException("CPF não pode ser uma sequência repetitiva.");
        }

        if (!isValidCpf(cpf)) {
            throw new IllegalArgumentException("CPF inválido.");
        }
    }

    // --------------- EMAIL VALIDATION ---------------
    private static final String EMAIL_REGEX = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    public void emailValidation(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email não pode ser nulo ou vazio.");
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Email inválido.");
        }
    }
}
