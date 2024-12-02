package com.auction.backend.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import com.auction.backend.exception.LoginException;
import com.auction.backend.model.User;
import com.auction.backend.model.dto.PasswordResetDTO;
import com.auction.backend.model.dto.PasswordResetValidateDTO;
import com.auction.backend.model.dto.UserAuthRequestDTO;
import com.auction.backend.repository.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.persistence.Transient;
import jakarta.validation.ConstraintViolationException;

@Service
public class UserService implements UserDetailsService {

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Transient
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    
    private String generateRandomCode() {
        String code;
        do {
            StringBuilder codeBuilder = new StringBuilder(CODE_LENGTH);
            for (int i = 0; i < CODE_LENGTH; i++) {
                codeBuilder.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
            }
            code = codeBuilder.toString();
        } while (userRepository.existsByValidationCode(code));
        return code;
    }

    public User create(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ConstraintViolationException("Email já está em uso", null);
        }
        if (userRepository.findBySiape(user.getSiape()).isPresent()) {
            throw new ConstraintViolationException("Siape já cadastrado", null);
        }
        if (userRepository.findByCpf(user.getCpf()).isPresent()) {
            throw new ConstraintViolationException("CPF já cadastrado", null);
        }

        cpfValidation(user.getCpf());
        validatePasswordResetCode(user.getEmail());
        passwordValidation(user.getPassword());

        user.setValidationCode(generateRandomCode());

        User userSaved = userRepository.save(user);
        Context context = new Context();

        context.setVariable("name", userSaved.getName());
        context.setVariable("link", "http://localhost:3000/email-validation/" + userSaved.getEmail() + "/"
                + userSaved.getValidationCode());
        context.setVariable("year", LocalDateTime.now().getYear());
        try {
            emailService.sendTemplateEmail(userSaved.getEmail(), "Cadastro realizado com sucesso", context,
                    "emailWelcome");
        } catch (MessagingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return userSaved;
    }

    public void emailValidation(String email, String code) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User userDatabase = user.get();
            if (code.equals(userDatabase.getValidationCode())) {
                userDatabase.setActive(true);
                userDatabase.setValidationCode(null);
                userRepository.save(userDatabase);
            } else {
                throw new IllegalArgumentException("Código de validação inválido ou expirado.");
            }
        } else {
            throw new NoSuchElementException("Usuário não encontrado.");
        }
    }

    @Override
    public UserDetails loadUserByUsername(String userIdentification) throws UsernameNotFoundException {
        return userRepository.findBySiape(
                userIdentification).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public void passwordCodeRequest(UserAuthRequestDTO userAuthRequestDTO) {
        Optional<User> user = userRepository.findBySiape(userAuthRequestDTO.getSiape());
        if (user.isPresent()) {
            User userDatabase = user.get();
            // Gera um código de 6 dígitos:
            userDatabase.setValidationCode(generateRandomCode());
            // 10 minutos de validade:
            userDatabase.setValidationCodeValidity(LocalDateTime.now().plusMinutes(5));

            Context context = new Context();
            context.setVariable("validationCode", userDatabase.getValidationCode());
            try {
                emailService.sendTemplateEmail(
                        userDatabase.getEmail(),
                        "Código de Validação para Redefinição de Senha",
                        context,
                        "passwordResetCode");
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
    }

    public void resetPassword(PasswordResetDTO passwordResetDTO) {
        Optional<User> user = userRepository.findByEmail(passwordResetDTO.getEmail());
        if (user.isPresent()) {
            User userDatabase = user.get();
            userDatabase.setPassword(passwordEncoder.encode(passwordResetDTO.getNewPassword()));
            userDatabase.setValidationCode(null);
            userDatabase.setValidationCodeValidity(null);
            userRepository.save(userDatabase);
        } else {
            throw new NoSuchElementException("Usuário não encontrado.");
        }
    }

    public void validatePasswordResetCode(PasswordResetValidateDTO passwordResetValidateDTO) {
        Optional<User> user = userRepository.findByEmail(passwordResetValidateDTO.getEmail());
        if (user.isPresent()) {
            User userDatabase = user.get();
            if (userDatabase.getValidationCode().equals(userDatabase.getValidationCode()) &&
                    userDatabase.getValidationCodeValidity().isAfter(LocalDateTime.now())) {
                // Código válido
            } else {
                throw new IllegalArgumentException("Código de validação inválido ou expirado.");
            }
        } else {
            throw new NoSuchElementException("Usuário não encontrado.");
        }
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

    public EmailCriteria validatePasswordResetCode(String email) {
        if (email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email não pode ser nulo ou vazio.");
        }

        EmailCriteria criteria = new EmailCriteria();

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

    // --------------- LOGIN VALIDATION ---------------
    public User authenticate(String siape, String password) throws LoginException {
        User user = userRepository.findBySiape(siape)
                .orElseThrow(() -> new LoginException("Siape não cadastrado"));

        if (user == null) {
            throw new LoginException("Usuario nulo");
        }

        if (!user.getPassword().equals(password)) {
            throw new LoginException("Credenciais inválidas");
        }

        return user;
    }

    public User read(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("User not found"));
    }

    public User readCpf(String cpf) {
        return userRepository.findByCpf(cpf).orElseThrow(() -> new NoSuchElementException("CPF not found"));
    }

    public User readSiape(String siape) {
        return userRepository.findBySiape(siape).orElseThrow(() -> new NoSuchElementException("Email not found"));
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
}
