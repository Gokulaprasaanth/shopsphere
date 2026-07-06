package ecom.demo.service;

import ecom.demo.dto.AddToCartRequest;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private CartService cartService;

    private User sampleUser;
    private Product sampleProduct;
    private Cart sampleCart;
    private CartItem sampleCartItem;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("test@test.com");

        sampleProduct = new Product();
        sampleProduct.setId(1L);
        sampleProduct.setName("Test Product");
        sampleProduct.setPrice(100.0);

        sampleCart = new Cart();
        sampleCart.setId(1L);
        sampleCart.setUser(sampleUser);
        sampleCart.setCartItems(new ArrayList<>());
        sampleCart.setTotalPrice(0.0);

        sampleCartItem = new CartItem();
        sampleCartItem.setId(1L);
        sampleCartItem.setCart(sampleCart);
        sampleCartItem.setProduct(sampleProduct);
        sampleCartItem.setQuantity(2);
        sampleCartItem.setSubtotal(200.0);
    }

    @Test
    void testGetCart_Success() {
        // Arrange
        when(userService.getCurrentUser()).thenReturn(sampleUser);
        when(cartRepository.findByUser(sampleUser)).thenReturn(Optional.of(sampleCart));
        when(cartItemRepository.findByCartOrderByIdAsc(sampleCart)).thenReturn(List.of(sampleCartItem));

        // Act
        CartResponse response = cartService.getCart();

        // Assert
        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        assertEquals(200.0, response.getItems().get(0).getSubtotal());
    }

    @Test
    void testGetCart_NotFound() {
        // Arrange
        when(userService.getCurrentUser()).thenReturn(sampleUser);
        when(cartRepository.findByUser(sampleUser)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> cartService.getCart());
    }

    @Test
    void testAddToCart_NewItem() {
        // Arrange
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(1L);
        request.setQuantity(1);

        when(userService.getCurrentUser()).thenReturn(sampleUser);
        when(cartRepository.findByUser(sampleUser)).thenReturn(Optional.of(sampleCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));
        when(cartItemRepository.findByCartAndProduct(sampleCart, sampleProduct)).thenReturn(Optional.empty());
        when(cartItemRepository.findByCartOrderByIdAsc(sampleCart)).thenReturn(List.of(sampleCartItem));

        // Act
        CartResponse response = cartService.addToCart(request);

        // Assert
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
        verify(cartRepository, times(1)).save(sampleCart);
        assertNotNull(response);
    }

    @Test
    void testUpdateQuantity_Success() {
        // Arrange
        UpdateCartRequest request = new UpdateCartRequest();
        request.setCartItemId(1L);
        request.setQuantity(5);

        when(userService.getCurrentUser()).thenReturn(sampleUser);
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(sampleCartItem));
        when(cartItemRepository.findByCartOrderByIdAsc(sampleCart)).thenReturn(List.of(sampleCartItem));

        // Act
        CartResponse response = cartService.updateQuantity(request);

        // Assert
        assertEquals(5, sampleCartItem.getQuantity());
        assertEquals(500.0, sampleCartItem.getSubtotal());
        verify(cartItemRepository, times(1)).save(sampleCartItem);
        verify(cartRepository, times(1)).save(sampleCart);
        assertNotNull(response);
    }

    @Test
    void testRemoveItem_Success() {
        // Arrange
        sampleCart.getCartItems().add(sampleCartItem);
        
        when(userService.getCurrentUser()).thenReturn(sampleUser);
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(sampleCartItem));
        when(cartItemRepository.findByCartOrderByIdAsc(sampleCart)).thenReturn(new ArrayList<>());

        // Act
        CartResponse response = cartService.removeItem(1L);

        // Assert
        verify(cartItemRepository, times(1)).delete(sampleCartItem);
        verify(cartRepository, times(1)).save(sampleCart);
        assertNotNull(response);
        assertEquals(0, response.getItems().size());
    }
}
