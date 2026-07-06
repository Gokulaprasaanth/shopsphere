package ecom.demo.controller;

import ecom.demo.dto.AdminOrderResponse;
import ecom.demo.dto.DashboardResponse;
import ecom.demo.dto.UpdateOrderStatusRequest;
import ecom.demo.service.DashboardService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final DashboardService dashboardService;

    public AdminController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    // ==========================
    // Dashboard Statistics
    // ==========================
    @GetMapping("/dashboard")
    public DashboardResponse getDashboard() {

        return dashboardService.getDashboard();
    }

    // ==========================
    // Get All Orders
    // ==========================
    @GetMapping("/orders")
    public List<AdminOrderResponse> getAllOrders() {

        return dashboardService.getAllOrders();
    }

    // ==========================
    // Update Order Status
    // ==========================
    @PutMapping("/orders/{orderId}/status")
    public AdminOrderResponse updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {

        return dashboardService.updateOrderStatus(orderId, request);
    }

}