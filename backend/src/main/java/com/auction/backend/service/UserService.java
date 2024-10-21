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
        cpfValidation(user.getCpf());
        emailValidation(user.getEmail());
        passwordValidation(user.getPassword());

        User userSaved = userRepository.save(user);
        Context context = new Context();
        context.setVariable("name", userSaved.getName());

        return userSaved;
    }

    public User read(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public User readCpf(String cpf) {
        return userRepository.findByCpf(cpf).orElseThrow(() -> new NoSuchElementException("CPF not found"));
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

    public static class CpfCriteria {
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
    }

    public CpfCriteria cpfValidation(String cpf) {
        cpf = cpf.replaceAll("\\D", "");

        if (userRepository.findByCpf(cpf).isPresent()) {
            throw new IllegalArgumentException("CPF já está cadastrado.");
        }

        CpfCriteria criteria = new CpfCriteria();

        if (cpf == null || !cpf.matches("\\d{11}")) {
            throw new IllegalArgumentException("CPF deve conter 11 dígitos.");
        }

        if (criteria.isRepeatedSequence(cpf)) {
            throw new IllegalArgumentException("CPF não pode ser uma sequência repetitiva.");
        }

        if (!criteria.isValidCpf(cpf)) {
            throw new IllegalArgumentException("CPF inválido.");
        }

        return criteria;
    }

    // --------------- EMAIL VALIDATION ---------------
    public static class EmailCriteria {
        private static final String EMAIL_REGEX = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

        public boolean isValidEmail(String email) {
            return email != null && EMAIL_PATTERN.matcher(email).matches();
        }
    }

    public EmailCriteria emailValidation(String email) {
        if (email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email não pode ser nulo ou vazio.");
        }

        EmailCriteria criteria = new EmailCriteria();

        // Verifica se o email é válido
        if (!criteria.isValidEmail(email)) {
            throw new IllegalArgumentException("Email inválido.");
        }

        return criteria;
    }

    // --------------- PASSWORD VALIDATION ---------------
    public static class PasswordCriteria {
        private boolean minLength;
        private boolean hasUpperCase;
        private boolean hasLowerCase;
        private boolean hasNumber;
        private boolean hasSpecialChar;

        public boolean isMinLength() {
            return minLength;
        }

        public void setMinLength(boolean minLength) {
            this.minLength = minLength;
        }

        public boolean isHasUpperCase() {
            return hasUpperCase;
        }

        public void setHasUpperCase(boolean hasUpperCase) {
            this.hasUpperCase = hasUpperCase;
        }

        public boolean isHasLowerCase() {
            return hasLowerCase;
        }

        public void setHasLowerCase(boolean hasLowerCase) {
            this.hasLowerCase = hasLowerCase;
        }

        public boolean isHasNumber() {
            return hasNumber;
        }

        public void setHasNumber(boolean hasNumber) {
            this.hasNumber = hasNumber;
        }

        public boolean isHasSpecialChar() {
            return hasSpecialChar;
        }

        public void setHasSpecialChar(boolean hasSpecialChar) {
            this.hasSpecialChar = hasSpecialChar;
        }
    }

    private boolean isValidPassword(PasswordCriteria criteria) {
        return criteria.isMinLength() && criteria.isHasUpperCase() &&
                criteria.isHasLowerCase() && criteria.isHasNumber() &&
                criteria.isHasSpecialChar();
    }

    public PasswordCriteria passwordValidation(String password) {
        PasswordCriteria criteria = new PasswordCriteria();

        criteria.setMinLength(password.length() >= 6);
        criteria.setHasUpperCase(Pattern.compile("[A-Z]").matcher(password).find());
        criteria.setHasLowerCase(Pattern.compile("[a-z]").matcher(password).find());
        criteria.setHasNumber(Pattern.compile("[0-9]").matcher(password).find());
        criteria.setHasSpecialChar(Pattern.compile("[!@#$%^&*(),.?\":{}|<>_\\-\\\\]").matcher(password).find());

        if (!isValidPassword(criteria)) {
            throw new IllegalArgumentException("Senha inválida. Certifique-se de que atende a todos os critérios.");
        }
        
        return criteria;
    }
}
