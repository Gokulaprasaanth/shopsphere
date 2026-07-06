package ecom.demo.service;

import ecom.demo.dto.OrderItemResponse;
import ecom.demo.dto.OrderResponse;
import ecom.demo.dto.PlaceOrderRequest;
import ecom.demo.entity.*;
import ecom.demo.enums.OrderStatus;
import ecom.demo.exception.BadRequestException;
import ecom.demo.exception.ResourceNotFoundException;
import ecom.demo.repository.CartItemRepository;
import ecom.demo.repository.CartRepository;
import ecom.demo.repository.OrderItemRepository;
import ecom.demo.repository.OrderRepository;
import ecom.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserService userService) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    // ==========================
    // Place Order
    // ==========================
    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {

        User user = userService.getCurrentUser();

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart not found"));

        List<CartItem> cartItems =cartItemRepository.findByCartOrderByIdAsc(cart);

        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        // ==========================
        // Validate Product Stock
        // ==========================
        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();

            if (product.getStock() == null) {
                throw new BadRequestException(
                        "Stock is not configured for " + product.getName()
                );
            }

            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException(
                        "Insufficient stock for " + product.getName()
                );
            }
        }

        Order order = new Order();

        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(cart.getTotalPrice());
        
        // Save user's delivery details and payment choice
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setContactNumber(request.getContactNumber());
        order.setPaymentMethod(request.getPaymentMethod());

        orderRepository.save(order);

        List<OrderItemResponse> responses = new ArrayList<>();

        for (CartItem cartItem : cartItems) {

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());

            // Save purchase price
            orderItem.setPrice(cartItem.getProduct().getPrice());

            orderItem.setSubtotal(cartItem.getSubtotal());

            orderItemRepository.save(orderItem);

            order.getOrderItems().add(orderItem);

            // ==========================
            // Reduce Stock
            // ==========================
            Product product = cartItem.getProduct();

            Integer stock = product.getStock();

            product.setStock(
                    stock - cartItem.getQuantity()
            );

            productRepository.save(product);

            responses.add(
                    new OrderItemResponse(
                            product.getId(),
                            product.getName(),
                            product.getImageUrl(),
                            product.getPrice(),
                            cartItem.getQuantity(),
                            cartItem.getSubtotal()
                    )
            );
        }

        // ==========================
        // Clear Cart
        // ==========================
        cartItemRepository.deleteAll(cartItems);

        cart.getCartItems().clear();
        cart.setTotalPrice(0.0);

        cartRepository.save(cart);

        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getDeliveryAddress(),
                order.getContactNumber(),
                responses
        );
    }
    // ==========================
    // Get My Orders
    // ==========================
    public List<OrderResponse> getMyOrders() {

        User user = userService.getCurrentUser();

        List<Order> orders = orderRepository.findByUser(user);

        List<OrderResponse> responses = new ArrayList<>();

        for (Order order : orders) {

            List<OrderItemResponse> items = new ArrayList<>();

            List<OrderItem> orderItems =
                    orderItemRepository.findByOrder(order);

            for (OrderItem item : orderItems) {

                items.add(
                        new OrderItemResponse(
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getProduct().getImageUrl(),
                                item.getPrice(),
                                item.getQuantity(),
                                item.getSubtotal()
                        )
                );
            }

            responses.add(
                    new OrderResponse(
                            order.getId(),
                            order.getOrderDate(),
                            order.getTotalAmount(),
                            order.getStatus(),
                            order.getDeliveryAddress(),
                            order.getContactNumber(),
                            items
                    )
            );
        }

        return responses;
    }

    // ==========================
    // Get Order By Id
    // ==========================
    public OrderResponse getOrderById(Long id) {

        User user = userService.getCurrentUser();

        Order order = orderRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        List<OrderItemResponse> items = new ArrayList<>();

        List<OrderItem> orderItems =
                orderItemRepository.findByOrder(order);

        for (OrderItem item : orderItems) {

            items.add(
                    new OrderItemResponse(
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getProduct().getImageUrl(),
                            item.getPrice(),
                            item.getQuantity(),
                            item.getSubtotal()
                    )
            );
        }

        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getDeliveryAddress(),
                order.getContactNumber(),
                items
        );
    }

    // ==========================
    // Cancel Order
    // ==========================
    @Transactional
    public OrderResponse cancelOrder(Long id) {

        User user = userService.getCurrentUser();

        Order order = orderRepository.findByIdAndUser(id, user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        // Already Cancelled
        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        // Cannot cancel after shipping
        if (order.getStatus() == OrderStatus.SHIPPED
                || order.getStatus() == OrderStatus.DELIVERED) {

            throw new BadRequestException(
                    "Only pending or confirmed orders can be cancelled");
        }

        // ==========================
        // Restore Product Stock
        // ==========================
        List<OrderItem> orderItems =
                orderItemRepository.findByOrder(order);

        for (OrderItem item : orderItems) {

            Product product = item.getProduct();

            if (product.getStock() != null) {

                Integer stock = product.getStock();

                product.setStock(
                        stock + item.getQuantity()
                );

                productRepository.save(product);
            }
        }

        // Update Status
        order.setStatus(OrderStatus.CANCELLED);

        orderRepository.save(order);

        List<OrderItemResponse> items = new ArrayList<>();

        for (OrderItem item : orderItems) {

            items.add(
                    new OrderItemResponse(
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getProduct().getImageUrl(),
                            item.getPrice(),
                            item.getQuantity(),
                            item.getSubtotal()
                    )
            );
        }

        return new OrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getDeliveryAddress(),
                order.getContactNumber(),
                items
        );
    }
}