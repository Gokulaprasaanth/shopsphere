package ecom.demo.service;

import ecom.demo.dto.AdminOrderResponse;
import ecom.demo.dto.DashboardResponse;
import ecom.demo.dto.UpdateOrderStatusRequest;
import ecom.demo.entity.Order;
import ecom.demo.entity.User;
import ecom.demo.enums.OrderStatus;
import ecom.demo.exception.ResourceNotFoundException;
import ecom.demo.repository.OrderRepository;
import ecom.demo.repository.ProductRepository;
import ecom.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DashboardServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private DashboardService dashboardService;

    private Order testOrder1;
    private Order testOrder2;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setFullName("John Doe");
        testUser.setEmail("john@example.com");

        testOrder1 = new Order();
        testOrder1.setId(1L);
        testOrder1.setTotalAmount(150.0);
        testOrder1.setUser(testUser);
        testOrder1.setOrderItems(new ArrayList<>());
        
        testOrder2 = new Order();
        testOrder2.setId(2L);
        testOrder2.setTotalAmount(250.0);
        testOrder2.setUser(testUser);
        testOrder2.setOrderItems(new ArrayList<>());
    }

    @Test
    void getDashboard_ReturnsCorrectCountsAndRevenue() {
        when(userRepository.count()).thenReturn(10L);
        when(productRepository.count()).thenReturn(50L);
        when(orderRepository.count()).thenReturn(2L);
        
        when(orderRepository.findAll()).thenReturn(List.of(testOrder1, testOrder2));

        DashboardResponse response = dashboardService.getDashboard();

        assertEquals(10L, response.getTotalUsers());
        assertEquals(50L, response.getTotalProducts());
        assertEquals(2L, response.getTotalOrders());
        assertEquals(400.0, response.getTotalRevenue());
    }

    @Test
    void updateOrderStatus_Success() {
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(OrderStatus.SHIPPED);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(testOrder1));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder1);

        AdminOrderResponse response = dashboardService.updateOrderStatus(1L, request);

        assertEquals(1L, response.getOrderId());
        assertEquals(OrderStatus.SHIPPED, response.getStatus());
        assertEquals("John Doe", response.getCustomerName());
        
        verify(orderRepository, times(1)).save(testOrder1);
    }

    @Test
    void updateOrderStatus_ThrowsResourceNotFoundWhenOrderNotFound() {
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(OrderStatus.SHIPPED);

        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> dashboardService.updateOrderStatus(99L, request));
    }
}
