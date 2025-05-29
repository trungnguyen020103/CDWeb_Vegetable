package com.example.demo.service;

import com.example.demo.dto.ChangePassDto;
import com.example.demo.dto.UserSignUpDto;
import com.example.demo.google.GoogleSignUpDto;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    public User getUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }
    public Long getUserIdByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            return (long) userOptional.get().getId();
        }
        return null;
    }
    public User changePassword(ChangePassDto changePassDto) {
        User user = userRepository.findById(changePassDto.getId())
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với ID: " + changePassDto.getId()));

        if (!changePassDto.getNewPassword().equals(changePassDto.getConfirmPassword())) {
            throw new ValidationException("Xác nhận mật khẩu không khớp với mật khẩu mới");
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(changePassDto.getNewPassword());

        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }
    public User registerFromGoogle(GoogleSignUpDto googleDto) {
        User user = new User();
        user.setEmail(googleDto.getEmail());
        user.setFullname(googleDto.getFullname());
        user.setPassword("GoogleLogin@123");
        user.setRole(1);

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User register(UserSignUpDto dto) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User user = new User();

        user.setEmail(dto.getEmail());
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setFullname(dto.getFullname());
        user.setAddress(dto.getAddress());
        user.setPhonenumber(dto.getPhonenumber());
        user.setRole(1);

        return userRepository.save(user);
    }

    public boolean deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return false;
        }
        userRepository.deleteById(id);
        return true;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(user.getRole() == 0 ? "ROLE_ADMIN" : "ROLE_USER")
        );

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }

}
