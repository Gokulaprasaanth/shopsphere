package ecom.demo.dto;

import java.util.List;

public class CartResponse {

    private Double totalPrice;

    private List<CartItemResponse> items;

    public CartResponse() {
    }

    public CartResponse(Double totalPrice, List<CartItemResponse> items) {
        this.totalPrice = totalPrice;
        this.items = items;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }
}