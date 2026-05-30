package com.petclinic.backend.service;

import com.petclinic.backend.dto.VisitHistoryResponseDto;
import com.petclinic.backend.dto.VisitRequestDto;
import com.petclinic.backend.dto.VisitResponseDto;
import java.time.LocalDate;
import java.util.List;

public interface VisitService {

    VisitResponseDto createVisit(VisitRequestDto request);

    List<VisitHistoryResponseDto> getVisitHistory(Long ownerId, Long petId, LocalDate date);
}
