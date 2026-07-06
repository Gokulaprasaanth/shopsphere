package ecom.demo.controller;

import ecom.demo.entity.User;
import ecom.demo.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ==========================
    // Get All Users
    // ==========================
    @GetMapping
    public List<User> getUsers() {

        return userService.getAllUsers();
    }

}