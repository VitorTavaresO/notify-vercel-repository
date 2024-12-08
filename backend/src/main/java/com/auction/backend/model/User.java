package com.auction.backend.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.auction.backend.enums.RoleName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Entity
@Table(name = "user")
@Data
@JsonIgnoreProperties({ "authorities", "accountNonExpired", "accountNonLocked", "credentialsNonExpired", "enabled" })
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "{name.required}")
    private String name;

    @NotBlank(message = "{cpf.required}")
    private String cpf;

    @NotBlank(message = "{siape.required}")
    private String siape;

    @NotBlank(message = "{position.required}")
    private String position;

    @NotBlank(message = "{email.required}")
    @Email(message = "{email.invalid}")
    private String email;

    @NotBlank(message = "{phone.required}")
    private String phone;

    @NotBlank(message = "{password.required}")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", length = 21) 
    private RoleName roleName;

    @JsonIgnore
    @Column(name = "validation_code", unique = true)
    private String validationCode;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime validationCodeValidity;

    private boolean active;

    @Transient
    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @OneToMany(mappedBy = "user", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Setter(value = AccessLevel.NONE)
    private List<UserProfile> userProfile;

    public void setUserProfile(List<UserProfile> listUserProfile) {
        for (UserProfile profile : listUserProfile) {
            profile.setUser(this);
        }
        userProfile = listUserProfile;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return userProfile.stream()
                .map(userRole -> new SimpleGrantedAuthority(userRole.getProfile().getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return siape;
    }

    public void setPassword(String password) {
        this.password = passwordEncoder.encode(password);
    }
}
