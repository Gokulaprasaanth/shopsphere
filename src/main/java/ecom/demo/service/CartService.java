package ecom.demo.service;

import ecom.demo.dto.AddToCartRequest;
import ecom.demo.dto.CartItemResponse;
import ecom.demo.dto.CartResponse;
import ecom.demo.dto.UpdateCartRequest;
import ecom.demo.entity.Cart;
import ecom.demo.entity.CartItem;
import ecom.demo.entity.Product;
import ecom.demo.entity.User;
import ecom.demo.exception.ResourceNotFoundException;
import ecom.demo.repository.CartItemRepository;
import ecom.demo.repository.CartRepository;
import ecom.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserService userService) {

        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    // ==========================
    // Add Product To Cart
    // ==========================
    public CartResponse addToCart(AddToCartRequest request) {

        User user = userService.getCurrentUser();

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        CartItem cartItem = cartItemRepository
                .findByCartAndProduct(cart, product)
                .orElse(null);

        if (cartItem != null) {

            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());

            cartItem.setSubtotal(
                    cartItem.getQuantity() * product.getPrice());

        } else {

            cartItem = new CartItem();

            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());

            cartItem.setSubtotal(
                    request.getQuantity() * product.getPrice());

            cart.getCartItems().add(cartItem);
        }

        cartItemRepository.save(cartItem);

        calculateTotal(cart);

        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    // ==========================
    // View Cart
    // ==========================
    public CartResponse getCart() {

        User user = userService.getCurrentUser();

        // A cart row is only created on the first add-to-cart. For a user who
        // has not added anything yet, return an empty cart rather than a 404.
        Cart cart = cartRepository.findByUser(user).orElse(null);

        if (cart == null) {
            return new CartResponse(0.0, new ArrayList<>());
        }

        return buildCartResponse(cart);
    }

    // ==========================
    // Update Quantity
    // ==========================
    public CartResponse updateQuantity(UpdateCartRequest request) {
        User user = userService.getCurrentUser();

        CartItem cartItem = cartItemRepository.findById(request.getCartItemId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart Item not found"));

        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart Item not found");
        }

        cartItem.setQuantity(request.getQuantity());

        cartItem.setSubtotal(
                request.getQuantity() *
                        cartItem.getProduct().getPrice());

        cartItemRepository.save(cartItem);

        Cart cart = cartItem.getCart();

        calculateTotal(cart);

        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    // ==========================
    // Remove Item
    // ==========================
    public CartResponse removeItem(Long cartItemId) {
        User user = userService.getCurrentUser();

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart Item not found"));

        if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Cart Item not found");
        }

        Cart cart = cartItem.getCart();

        cart.getCartItems().remove(cartItem);

        cartItemRepository.delete(cartItem);

        calculateTotal(cart);

        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    // ==========================
// Build Cart Response
// ==========================
    private CartResponse buildCartResponse(Cart cart) {

        List<CartItem> cartItems = cartItemRepository.findByCartOrderByIdAsc(cart);

        List<CartItemResponse> items = new ArrayList<>();

        for (CartItem item : cartItems) {

            CartItemResponse response = new CartItemResponse();

            response.setCartItemId(item.getId());
            response.setProductId(item.getProduct().getId());
            response.setProductName(item.getProduct().getName());
            response.setImageUrl(item.getProduct().getImageUrl());
            response.setPrice(item.getProduct().getPrice());
            response.setQuantity(item.getQuantity());
            response.setSubtotal(item.getSubtotal());

            items.add(response);
        }

        return new CartResponse(
                cart.getTotalPrice(),
                items
        );
    }

    // ==========================
    // Calculate Total
    // ==========================
    private void calculateTotal(Cart cart) {

        double total = cartItemRepository.findByCartOrderByIdAsc(cart)
                .stream()
                .mapToDouble(CartItem::getSubtotal)
                .sum();

        cart.setTotalPrice(total);
    }
}