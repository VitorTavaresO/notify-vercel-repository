package com.auction.backend.controller;

import java.util.List;
import java.util.Map;

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

import com.auction.backend.enums.RoleName;
import com.auction.backend.model.User;
import com.auction.backend.model.UserAuthRequestDTO;
import com.auction.backend.model.UserAuthResponseDTO;
import com.auction.backend.model.UserRecoveryPasswordDTO;
import com.auction.backend.security.JwtService;
import com.auction.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("api/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

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
    public boolean emailValidation(@PathVariable String email, @PathVariable String code) {
        return userService.emailValidation(email, code);
    }

    @PostMapping("/login")
    public UserAuthResponseDTO authenticateUser(@Valid @RequestBody UserAuthRequestDTO authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getSiape(), authRequest.getPassword()));
        return new UserAuthResponseDTO(authRequest.getSiape(), jwtService.generateToken(authentication.getName()));
    }

    @PostMapping("/send-validation-code")
    public String sendValidationCode(@RequestBody Map<String, String> json) {
        String email = json.get("email");
        return userService.sendValidationCode(email);
    }

    @PostMapping("/recovery-password")
    public boolean recoveryPassword(@RequestBody UserRecoveryPasswordDTO userRecoveryPasswordDTO) {
        return userService.recoveryPassword(userRecoveryPasswordDTO);
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
    public UserService.EmailCriteria emailValidation(@RequestBody String email) {
        return userService.emailValidation(email);
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

    @PutMapping("/update-permission/{siape}")
    public ResponseEntity<User> updatePermission(
            @PathVariable("siape") String siape,
            @RequestBody Map<String, String> body) {
        try {
            User user = userService.readSiape(siape);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            String roleName = body.get("role");
            try {
                user.setRoleName(RoleName.valueOf(roleName.toUpperCase()));

            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }

            User updatedUser = userService.update(user);
            return ResponseEntity.ok(updatedUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
