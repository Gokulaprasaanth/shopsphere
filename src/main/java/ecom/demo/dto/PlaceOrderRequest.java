package ecom.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class PlaceOrderRequest {

    @NotBlank
    private String deliveryAddress;
    @NotBlank
    private String contactNumber;
    @NotBlank
    private String paymentMethod;

    public PlaceOrderRequest() {
    }

    public PlaceOrderRequest(String deliveryAddress, String contactNumber, String paymentMethod) {
        this.deliveryAddress = deliveryAddress;
        this.contactNumber = contactNumber;
        this.paymentMethod = paymentMethod;
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

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}