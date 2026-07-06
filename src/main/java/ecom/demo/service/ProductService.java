package ecom.demo.service;

import ecom.demo.entity.Product;
import ecom.demo.exception.ResourceNotFoundException;
import ecom.demo.repository.ProductRepository;
import ecom.demo.specification.ProductSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ==========================
    // Get All Products
    // Search + Filter + Pagination + Sorting
    // ==========================
    public Page<Product> getAllProducts(
            String keyword,
            String category,
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return productRepository.findAll(
                ProductSpecification.hasKeyword(keyword)
                        .and(ProductSpecification.hasCategory(category)),
                pageable
        );
    }

    // ==========================
    // Get Product By ID
    // ==========================
    public Product getProductById(Long id) {

        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));
    }

    // ==========================
    // Save Product
    // ==========================
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // ==========================
    // Update Product
    // ==========================
    public Product updateProduct(Long id, Product product) {

        Product existing = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setImageUrl(product.getImageUrl());
        existing.setCategory(product.getCategory());
        existing.setStock(product.getStock());
        existing.setRating(product.getRating());

        return productRepository.save(existing);
    }

    // ==========================
    // Delete Product
    // ==========================
    public void deleteProduct(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        productRepository.delete(product);
    }
}