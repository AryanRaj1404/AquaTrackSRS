package com.aquatrack.aquatrack.seeder;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo-data")
public class DemoDataSeederController {

    private final DemoDataSeederService demoDataService;

    public DemoDataSeederController(DemoDataSeederService demoDataService) {
        this.demoDataService = demoDataService;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generate() {

        return ResponseEntity.ok(
                demoDataService.generateDemoData()
        );

    }

}