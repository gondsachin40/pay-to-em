package com.Testing.rest_service.controller;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.Testing.rest_service.Errors.*;
import com.Testing.rest_service.entity.User;
import com.Testing.rest_service.repository.*;

@RestController
public class UserController{
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/hello/{id}")
    public String sayHello(@PathVariable int id) {
     
        return "Hello";        
    }
    
    @PostMapping("/adduser")
    public ResponseEntity<?> createUser(@RequestBody User user){
        try{
            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        }catch(DataIntegrityViolationException e){
            ErrorResponse error = new ErrorResponse("Email Aldready Exist" , HttpStatus.CONFLICT.value());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }catch(Exception e){
            ErrorResponse error = new ErrorResponse("Something went wrong" , 
                    HttpStatus.INTERNAL_SERVER_ERROR.value());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/getusers")
    public List<User> getUsers(){
        return userRepository.findAll();
    }

}
