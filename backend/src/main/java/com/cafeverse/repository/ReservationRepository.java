package com.cafeverse.repository;

import com.cafeverse.model.Reservation;
import com.cafeverse.model.ReservationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
    List<Reservation> findByUserId(String userId);
    List<Reservation> findByStatus(ReservationStatus status);
}
