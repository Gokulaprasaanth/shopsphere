package ecom.demo.service;

import ecom.demo.dto.OrderResponse;
import ecom.demo.dto.PlaceOrderRequest;
import ecom.demo.entity.*;
import ecom.demo.enums.OrderStatus;
import ecom.demo.enums.Role;
import ecom.demo.exception.BadRequestException;
import ecom.demo.exception.ResourceNotFoundException;
import ecom.demo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private OrderService orderService;

    private User testUser;
    private Cart testCart;
    private Product testProduct;
    private CartItem testCartItem;
    private Order testOrder;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setRole(Role.USER);
        testUser.setEmail("test@test.com");

        testCart = new Cart();
        testCart.setId(1L);
        testCart.setUser(testUser);
        testCart.setTotalPrice(100.0);
        testCart.setCartItems(new ArrayList<>());

        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(50.0);
        testProduct.setStock(10);

        testCartItem = new CartItem();
        testCartItem.setId(1L);
        testCartItem.setCart(testCart);
        testCartItem.setProduct(testProduct);
        testCartItem.setQuantity(2);
        testCartItem.setSubtotal(100.0);
        
        testOrder = new Order();
        testOrder.setId(1L);
        testOrder.setUser(testUser);
        testOrder.setOrderDate(LocalDateTime.now());
        testOrder.setStatus(OrderStatus.PENDING);
        testOrder.setTotalAmount(100.0);
    }

    @Test
    void placeOrder_Success() {
        PlaceOrderRequest request = new PlaceOrderRequest("123 Street", "1234567890", "CARD");
        
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartOrderByIdAsc(testCart)).thenReturn(List.of(testCartItem));
        when(orderRepository.save(any(Order.class))).thenReturn(testOrder);
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(new OrderItem());

        OrderResponse response = orderService.placeOrder(request);

        assertNotNull(response);
        assertEquals(100.0, response.getTotalAmount());
        assertEquals("123 Street", response.getDeliveryAddress());
        
        verify(productRepository, times(1)).save(any(Product.class));
        verify(cartItemRepository, times(1)).deleteAll(anyList());
        verify(cartRepository, times(1)).save(testCart);
        
        assertEquals(8, testProduct.getStock());
    }

    @Test
    void placeOrder_ThrowsBadRequestWhenCartEmpty() {
        PlaceOrderRequest request = new PlaceOrderRequest("123 Street", "1234567890", "CARD");
        
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartOrderByIdAsc(testCart)).thenReturn(Collections.emptyList());

        assertThrows(BadRequestException.class, () -> orderService.placeOrder(request));
    }

    @Test
    void placeOrder_ThrowsBadRequestWhenStockInsufficient() {
        PlaceOrderRequest request = new PlaceOrderRequest("123 Street", "1234567890", "CARD");
        testProduct.setStock(1); // Quantity is 2, so insufficient
        
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(cartRepository.findByUser(testUser)).thenReturn(Optional.of(testCart));
        when(cartItemRepository.findByCartOrderByIdAsc(testCart)).thenReturn(List.of(testCartItem));

        assertThrows(BadRequestException.class, () -> orderService.placeOrder(request));
    }

    @Test
    void cancelOrder_Success() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(orderRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(testOrder));
        
        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(testProduct);
        orderItem.setQuantity(2);
        when(orderItemRepository.findByOrder(testOrder)).thenReturn(List.of(orderItem));

        OrderResponse response = orderService.cancelOrder(1L);

        assertEquals(OrderStatus.CANCELLED, response.getStatus());
        assertEquals(12, testProduct.getStock());
        
        verify(productRepository, times(1)).save(testProduct);
        verify(orderRepository, times(1)).save(testOrder);
    }

    @Test
    void cancelOrder_ThrowsBadRequestWhenAlreadyCancelled() {
        testOrder.setStatus(OrderStatus.CANCELLED);
        
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(orderRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(testOrder));

        assertThrows(BadRequestException.class, () -> orderService.cancelOrder(1L));
    }

    @Test
    void cancelOrder_ThrowsBadRequestWhenShippedOrDelivered() {
        testOrder.setStatus(OrderStatus.SHIPPED);
        
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(orderRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.of(testOrder));

        assertThrows(BadRequestException.class, () -> orderService.cancelOrder(1L));
        
        testOrder.setStatus(OrderStatus.DELIVERED);
        assertThrows(BadRequestException.class, () -> orderService.cancelOrder(1L));
    }

    @Test
    void getOrderById_ThrowsResourceNotFoundWhenNotBelongToUser() {
        when(userService.getCurrentUser()).thenReturn(testUser);
        when(orderRepository.findByIdAndUser(1L, testUser)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.getOrderById(1L));
    }
}
