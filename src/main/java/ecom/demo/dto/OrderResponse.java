package ecom.demo.dto;

import ecom.demo.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long orderId;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private OrderStatus status;
    private String deliveryAddress;
    private String contactNumber;
    private List<OrderItemResponse> items;

    public OrderResponse() {
    }

    public OrderResponse(Long orderId,
                         LocalDateTime orderDate,
                         Double totalAmount,
                         OrderStatus status,
                         String deliveryAddress,
                         String contactNumber,
                         List<OrderItemResponse> items) {

        this.orderId = orderId;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.deliveryAddress = deliveryAddress;
        this.contactNumber = contactNumber;
        this.items = items;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
}