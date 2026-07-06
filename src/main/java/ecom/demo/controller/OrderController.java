package ecom.demo.controller;

import ecom.demo.dto.OrderResponse;
import ecom.demo.dto.PlaceOrderRequest;
import ecom.demo.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ==========================
    // Place Order
    // ==========================
    @PostMapping("/place")
    public OrderResponse placeOrder(
            @Valid @RequestBody PlaceOrderRequest request) {

        return orderService.placeOrder(request);
    }

    // ==========================
    // My Orders
    // ==========================
    @GetMapping
    public List<OrderResponse> getMyOrders() {

        return orderService.getMyOrders();
    }
    // ==========================
// Get Order By Id
// ==========================
    @GetMapping("/{id}")
    public OrderResponse getOrderById(
            @PathVariable Long id) {

        return orderService.getOrderById(id);
    }
    // ==========================
// Cancel Order
// ==========================
    @PutMapping("/{id}/cancel")
    public OrderResponse cancelOrder(
            @PathVariable Long id) {

        return orderService.cancelOrder(id);
    }
}