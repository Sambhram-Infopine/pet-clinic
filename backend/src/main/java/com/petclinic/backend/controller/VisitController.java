package com.petclinic.backend.controller;

import com.petclinic.backend.dto.VisitHistoryResponseDto;
import com.petclinic.backend.dto.VisitRequestDto;
import com.petclinic.backend.dto.VisitResponseDto;
import com.petclinic.backend.service.VisitService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/visits")
@Validated
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @PostMapping
    public ResponseEntity<VisitResponseDto> createVisit(@Valid @RequestBody VisitRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(visitService.createVisit(request));
    }

    @GetMapping
    public ResponseEntity<List<VisitHistoryResponseDto>> getVisitHistory(
            @RequestParam(required = false) @Positive Long ownerId,
            @RequestParam(required = false) @Positive Long petId,
            @RequestParam(required = false) LocalDate date) {
        return ResponseEntity.ok(visitService.getVisitHistory(ownerId, petId, date));
    }
}
