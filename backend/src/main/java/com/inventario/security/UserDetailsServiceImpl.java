package com.inventario.security;

import com.inventario.model.User;
import com.inventario.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado: " + username));

        if (!user.getAtivo()) {
            throw new DisabledException("Usuario desativado: " + username);
        }

        String authority = user.getPerfil() != null ? user.getPerfil().getAuthority() : "ROLE_USUARIO";

        return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getSenha(),
            List.of(new SimpleGrantedAuthority(authority))
        );
    }
}
