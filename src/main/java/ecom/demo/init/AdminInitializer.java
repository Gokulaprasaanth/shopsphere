package ecom.demo.init;

import ecom.demo.entity.User;
import ecom.demo.enums.Role;
import ecom.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository,
                            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (!userRepository.existsByEmail("admin@ecommerce.com")) {

            User admin = new User();

            admin.setFullName("Administrator");
            admin.setEmail("admin@ecommerce.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setPhone("9999999999");
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("=======================================");
            System.out.println("DEFAULT ADMIN CREATED");
            System.out.println("Email : admin@ecommerce.com");
            System.out.println("Password : Admin@123");
            System.out.println("=======================================");
        }
    }
}