package ecom.demo.repository;

import ecom.demo.entity.Cart;
import ecom.demo.entity.CartItem;
import ecom.demo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Find a product in a specific cart
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);

    // Get all items of a cart
    List<CartItem> findByCartOrderByIdAsc(Cart cart);

}