package com.example.qlsv.infrastructure.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PublicPageController {

    @GetMapping("/register")
    public String registerPage() {
        return "forward:/register/index.html";
    }
}
