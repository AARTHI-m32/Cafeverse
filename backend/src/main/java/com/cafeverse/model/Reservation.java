package com.cafeverse.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reservations")
public class Reservation {
    @Id
    private String id;
    private String userId;
    private LocalDate date;
    private LocalTime time;
    private int guests;
    private String specialRequests;
    
    @Builder.Default
    private ReservationStatus status = ReservationStatus.PENDING;
    
    @CreatedDate
    private LocalDateTime createdAt;
}
