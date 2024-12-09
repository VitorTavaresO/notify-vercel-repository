package com.auction.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auction.backend.model.User;
import com.auction.backend.model.dto.UserAuthRequestDTO;
import com.auction.backend.model.dto.UserAuthResponseDTO;
import com.auction.backend.model.dto.UserChangePasswordDTO;
import com.auction.backend.repository.UserRepository;
import com.auction.backend.model.dto.PasswordResetDTO;
import com.auction.backend.model.dto.PasswordResetValidateDTO;
import com.auction.backend.security.JwtService;
import com.auction.backend.service.UserService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("api/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/id/{id}")
    public User read(@PathVariable("id") Long id) {
        return userService.read(id);
    }

    @GetMapping("/cpf/{cpf}")
    public User readCpf(@PathVariable("cpf") String cpf) {
        return userService.readCpf(cpf);
    }

    @GetMapping("/siape/{siape}")
    public User readSiape(@PathVariable("siape") String siape) {
        return userService.readSiape(siape);
    }

    @GetMapping("/email-validation/{email}/{code}")
    public boolean emailCodeValidation(@PathVariable String email, @PathVariable String code) {
        return userService.emailCodeValidation(email, code);
    }
    

    @PostMapping("/login")
    public UserAuthResponseDTO authenticateUser(@Valid @RequestBody UserAuthRequestDTO authRequest) {
        User user = userRepository.findBySiape(authRequest.getSiape()).orElseThrow(() -> new NoSuchElementException("User not found"));
        if(!user.isActive()){
            throw new NoSuchElementException("Usuário Inativo");
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getSiape(), authRequest.getPassword()));
        String token = jwtService.generateToken(authentication.getName());
        String role = user.getRoleName().toString();
        return new UserAuthResponseDTO(authRequest.getSiape(), token, role);
    }

    @GetMapping("/getUserRole")
    public String getUserRole(@RequestParam String siape) {
        User user = userRepository.findBySiape(siape).orElseThrow(() -> new NoSuchElementException("User not found"));
        return userService.getUserRole(user);
    }
    
    @GetMapping("/is-admin")
    public boolean isAdmin(@RequestParam String siape) {
        User user = userRepository.findBySiape(siape).orElseThrow(() -> new NoSuchElementException("User not found"));
        return userService.isAdmin(user);
    }

    @GetMapping("/is-announcement-issuer")
    public boolean isAnnouncementIssuer(@RequestParam String siape) {
        User user = userRepository.findBySiape(siape).orElseThrow(() -> new NoSuchElementException("User not found"));
        return userService.isAnnouncementIssuer(user);
    }

    @PostMapping("/password-reset-request")
    public ResponseEntity<?> passwordResetRequest(@RequestBody UserAuthRequestDTO userAuthRequestDTO) {
        userService.passwordCodeRequest(userAuthRequestDTO);
        return ResponseEntity.ok("Código de validação enviado para o email.");
    }

    @PostMapping("/password-reset-validate")
    public ResponseEntity<?> passwordResetValidate(@RequestBody PasswordResetValidateDTO passwordResetValidateDTO) {
        userService.validatePasswordResetCode(passwordResetValidateDTO);
        return ResponseEntity.ok("Código de validação verificado.");
    }

    @PostMapping("/password-reset")
    public ResponseEntity<?> passwordReset(@RequestBody PasswordResetDTO passwordResetDTO) {
        userService.resetPassword(passwordResetDTO);
        return ResponseEntity.ok("Senha redefinida com sucesso.");
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.create(user);
    }

    @PutMapping
    public User update(@RequestBody User user) {
        return userService.update(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        userService.delete(id);
    }

    @GetMapping
    public List<User> list() {
        return userService.list();
    }

    @PostMapping("/validate-cpf")
    public UserService.CpfCriteria cpfValidation(@RequestBody String cpf) {
        return userService.cpfValidation(cpf);
    }

    @PostMapping("/validate-email")
    public UserService.EmailCriteria validatePasswordResetCode(@RequestBody String email) {
        return userService.validatePasswordResetCode(email);
    }

    @PostMapping("/validate-password")
    public UserService.PasswordCriteria passwordValidation(@RequestBody String password) {
        return userService.passwordValidation(password);
    }

    @PutMapping("/update-contact/{siape}")
    public ResponseEntity<User> updateEmailAndPhone(
            @PathVariable("siape") String siape,
            @RequestBody User updatedUser) {
        try {
            User existingUser = userService.readSiape(siape);

            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()) {
                existingUser.setEmail(updatedUser.getEmail());
            }

            if (updatedUser.getPhone() != null && !updatedUser.getPhone().isEmpty()) {
                existingUser.setPhone(updatedUser.getPhone());
            }

            User updated = userService.update(existingUser);

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/update-role/{siape}")
    public ResponseEntity<User> updateUserRole(
            @PathVariable("siape") String siape,
            @RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            if (role == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            User updatedUser = userService.updateUserRole(siape, role);
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/update-permission/{siape}")
    public ResponseEntity<User> updatePermission(
            @PathVariable("siape") String siape,
            @RequestBody Map<String, String> body) {
        try {
            String role = body.get("role");
            if (role == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            User updatedUser = userService.updateUserRole(siape, role);
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/recover-email")
    public String recoverSendEmail(@RequestBody Map<String, String> json){
        String email = json.get("email");
        return userService.recoverSendEmail(email);
    }

    @PostMapping("/recover-code")
    public User recoverVerifyCode(@RequestBody Map<String, String> request){
        String validationCode = request.get("validationCode");
        return userService.recoverVerifyCode(validationCode);
    }

    @PostMapping("/recover-change")
    public User recoverChangePassword(@RequestBody UserChangePasswordDTO dto){

        System.out.println(dto.getEmail());
        System.out.println(dto.getPassword());
        return userService.recoverChangePassword(dto);
    }
}
