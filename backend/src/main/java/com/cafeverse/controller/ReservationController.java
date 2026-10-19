package com.cafeverse.controller;

import com.cafeverse.model.Reservation;
import com.cafeverse.model.ReservationStatus;
import com.cafeverse.security.CustomUserDetails;
import com.cafeverse.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation, @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reservationService.createReservation(reservation, userDetails.getId()));
    }

    @GetMapping("/myreservations")
    public ResponseEntity<List<Reservation>> getMyReservations(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userDetails.getId()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_STAFF')")
    public ResponseEntity<Reservation> updateReservationStatus(@PathVariable String id, @RequestParam ReservationStatus status) {
        return ResponseEntity.ok(reservationService.updateReservationStatus(id, status));
    }
}
