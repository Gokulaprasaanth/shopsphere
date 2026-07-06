package ecom.demo.controller;

import ecom.demo.dto.AddToCartRequest;
import ecom.demo.dto.CartResponse;
import ecom.demo.dto.UpdateCartRequest;
import ecom.demo.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // ==========================
    // Add Product To Cart
    // ==========================
    @PostMapping("/add")
    public CartResponse addToCart(
            @Valid @RequestBody AddToCartRequest request) {

        return cartService.addToCart(request);
    }

    // ==========================
    // View Cart
    // ==========================
    @GetMapping
    public CartResponse getCart() {

        return cartService.getCart();
    }

    // ==========================
    // Update Quantity
    // ==========================
    @PutMapping("/update")
    public CartResponse updateQuantity(
            @Valid @RequestBody UpdateCartRequest request) {

        return cartService.updateQuantity(request);
    }

    // ==========================
    // Remove Item
    // ==========================
    @DeleteMapping("/remove/{cartItemId}")
    public CartResponse removeItem(
            @PathVariable Long cartItemId) {

        return cartService.removeItem(cartItemId);
    }

}