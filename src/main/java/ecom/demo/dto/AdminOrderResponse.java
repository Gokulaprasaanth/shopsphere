package ecom.demo.dto;

import ecom.demo.enums.OrderStatus;

import java.time.LocalDateTime;

public class AdminOrderResponse {

    private Long orderId;

    private String customerName;

    private String customerEmail;

    private LocalDateTime orderDate;

    private double totalAmount;

    private OrderStatus status;

    private String productNames;

    public AdminOrderResponse() {
    }

    public AdminOrderResponse(Long orderId,
                              String customerName,
                              String customerEmail,
                              LocalDateTime orderDate,
                              double totalAmount,
                              OrderStatus status,
                              String productNames) {

        this.orderId = orderId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.productNames = productNames;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getProductNames() {
        return productNames;
    }

    public void setProductNames(String productNames) {
        this.productNames = productNames;
    }
}