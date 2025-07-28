package web.project.chewytta.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import web.project.chewytta.mapper.UserMapper;
import web.project.chewytta.model.User;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        String authority = "ROLE_" + user.getRole().toUpperCase();
        System.out.println("Loading user: " + username + ", role: " + user.getRole() + ", authority: " + authority);
        System.out.println("User authorities will be: [" + authority + "]");

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(authority) // 确保权限为大写
                .build();
    }
}
