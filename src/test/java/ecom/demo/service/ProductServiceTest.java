package ecom.demo.service;

import ecom.demo.entity.Product;
import ecom.demo.exception.ResourceNotFoundException;
import ecom.demo.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = new Product();
        sampleProduct.setId(1L);
        sampleProduct.setName("Test Product");
        sampleProduct.setPrice(99.99);
        sampleProduct.setStock(10);
    }

    @Test
    void testGetAllProducts() {
        // Arrange
        Page<Product> productPage = new PageImpl<>(List.of(sampleProduct));
        when(productRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(productPage);

        // Act
        Page<Product> result = productService.getAllProducts("Test", "Electronics", 0, 10, "id", "asc");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Product", result.getContent().get(0).getName());
        verify(productRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    void testGetProductById_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));

        // Act
        Product result = productService.getProductById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Product", result.getName());
    }

    @Test
    void testGetProductById_NotFound() {
        // Arrange
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(99L));
    }

    @Test
    void testSaveProduct() {
        // Arrange
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        // Act
        Product result = productService.saveProduct(sampleProduct);

        // Assert
        assertNotNull(result);
        assertEquals("Test Product", result.getName());
        verify(productRepository, times(1)).save(sampleProduct);
    }

    @Test
    void testDeleteProduct_Success() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));
        doNothing().when(productRepository).delete(sampleProduct);

        // Act
        productService.deleteProduct(1L);

        // Assert
        verify(productRepository, times(1)).findById(1L);
        verify(productRepository, times(1)).delete(sampleProduct);
    }
}
