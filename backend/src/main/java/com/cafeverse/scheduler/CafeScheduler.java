package com.cafeverse.scheduler;

import com.cafeverse.model.Order;
import com.cafeverse.model.OrderStatus;
import com.cafeverse.model.Reservation;
import com.cafeverse.model.ReservationStatus;
import com.cafeverse.repository.OrderRepository;
import com.cafeverse.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class CafeScheduler {

    private final ReservationRepository reservationRepository;
    private final OrderRepository orderRepository;

    @Scheduled(cron = "0 0/5 * * * *")
    public void autoCancelUnconfirmedReservations() {
        log.info("Running auto-cancel reservations job...");
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        List<Reservation> pendingReservations = reservationRepository.findByStatus(ReservationStatus.PENDING);
        
        int cancelledCount = 0;
        for (Reservation res : pendingReservations) {
            if (res.getCreatedAt().isBefore(fiveMinutesAgo)) {
                res.setStatus(ReservationStatus.CANCELLED);
                reservationRepository.save(res);
                cancelledCount++;
            }
        }
        if (cancelledCount > 0) log.info("Auto-cancelled {} reservations.", cancelledCount);
    }

    @Scheduled(cron = "0 0/10 * * * *")
    public void orderTimeoutUpdater() {
        log.info("Running order timeout updater...");
        LocalDateTime twentyMinsAgo = LocalDateTime.now().minusMinutes(20);
        List<Order> allOrders = orderRepository.findAll();
        
        int expiredCount = 0;
        for (Order order : allOrders) {
            if (order.getStatus() == OrderStatus.PENDING && order.getCreatedAt().isBefore(twentyMinsAgo)) {
                order.setStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);
                expiredCount++;
            }
        }
        if (expiredCount > 0) log.info("Marked {} pending orders as cancelled.", expiredCount);
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void generateDailySalesReport() {
        log.info("Generating daily sales report...");
        List<Order> allOrders = orderRepository.findAll();
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        log.info("Total Revenue: ${}", totalRevenue);
    }
}
