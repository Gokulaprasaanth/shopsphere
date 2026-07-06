package ecom.demo.service;

import ecom.demo.dto.AdminOrderResponse;
import ecom.demo.dto.DashboardResponse;
import ecom.demo.dto.UpdateOrderStatusRequest;
import ecom.demo.entity.Order;
import ecom.demo.exception.ResourceNotFoundException;
import ecom.demo.repository.OrderRepository;
import ecom.demo.repository.ProductRepository;
import ecom.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public DashboardService(UserRepository userRepository,
                            ProductRepository productRepository,
                            OrderRepository orderRepository) {

        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    // ==========================
    // Dashboard Statistics
    // ==========================
    public DashboardResponse getDashboard() {

        long totalUsers = userRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();

        double totalRevenue = 0;

        List<Order> orders = orderRepository.findAll();

        for (Order order : orders) {
            totalRevenue += order.getTotalAmount();
        }

        return new DashboardResponse(
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue
        );
    }

    // ==========================
    // Get All Orders
    // ==========================
    public List<AdminOrderResponse> getAllOrders() {

        List<Order> orders = orderRepository.findAll();

        List<AdminOrderResponse> responses = new ArrayList<>();

        for (Order order : orders) {

            String productNames = order.getOrderItems().stream()
                    .map(item -> item.getProduct().getName())
                    .collect(Collectors.joining(", "));

            AdminOrderResponse response = new AdminOrderResponse();

            response.setOrderId(order.getId());
            response.setCustomerName(order.getUser().getFullName());
            response.setCustomerEmail(order.getUser().getEmail());
            response.setOrderDate(order.getOrderDate());
            response.setTotalAmount(order.getTotalAmount());
            response.setStatus(order.getStatus());
            response.setProductNames(productNames);

            responses.add(response);
        }

        return responses;
    }

    // ==========================
    // Update Order Status
    // ==========================
    public AdminOrderResponse updateOrderStatus(
            Long orderId,
            UpdateOrderStatusRequest request) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        order.setStatus(request.getStatus());

        orderRepository.save(order);

        String productNames = order.getOrderItems().stream()
                .map(item -> item.getProduct().getName())
                .collect(Collectors.joining(", "));

        return new AdminOrderResponse(
                order.getId(),
                order.getUser().getFullName(),
                order.getUser().getEmail(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                productNames
        );
    }
}