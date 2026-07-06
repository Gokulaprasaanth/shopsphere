package ecom.demo.controller;

import ecom.demo.entity.Product;
import ecom.demo.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ==========================
    // Get All Products
    // Search + Filter + Pagination + Sorting
    // ==========================
    @GetMapping
    public Page<Product> getAllProducts(

            @RequestParam(required = false) String keyword,

            @RequestParam(required = false) String category,

            @RequestParam(defaultValue = "0") int page,

            @RequestParam(defaultValue = "5") int size,

            @RequestParam(defaultValue = "id") String sortBy,

            @RequestParam(defaultValue = "asc") String direction
    ) {

        return productService.getAllProducts(
                keyword,
                category,
                page,
                size,
                sortBy,
                direction
        );
    }

    // ==========================
    // Get Product By ID
    // ==========================
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {

        return productService.getProductById(id);
    }

    // ==========================
    // Add Product
    // ==========================
    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {

        return new ResponseEntity<>(productService.saveProduct(product), HttpStatus.CREATED);
    }

    // ==========================
    // Update Product
    // ==========================
    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable Long id,
                                 @RequestBody Product product) {

        return productService.updateProduct(id, product);
    }

    // ==========================
    // Delete Product
    // ==========================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {

        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}