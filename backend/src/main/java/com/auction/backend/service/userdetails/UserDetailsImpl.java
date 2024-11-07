package com.auction.backend.service.userdetails;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.auction.backend.enums.RoleName;
import com.auction.backend.model.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Collection;

@Getter
public class UserDetailsImpl implements UserDetails {

    private User user;

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    @Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    
    List<GrantedAuthority> authorities = new ArrayList<>();

    if (user.getRoleName() != null) {
        authorities.add(new SimpleGrantedAuthority(user.getRoleName().name()));  

        if (user.getRoleName() == RoleName.UNDEFINED) {
            
            authorities.clear(); 
        } else {
            if (user.getRoleName() == RoleName.ADMIN) {
                authorities.add(new SimpleGrantedAuthority(RoleName.USER.name()));
            }
        }
    }

    return authorities;
}

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    } 

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}