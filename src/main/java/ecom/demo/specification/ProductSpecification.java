package ecom.demo.specification;

import ecom.demo.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    // ==========================
    // Search by Keyword
    // ==========================
    public static Specification<Product> hasKeyword(String keyword) {

        return (root, query, criteriaBuilder) -> {

            if (keyword == null || keyword.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            String search = "%" + keyword.toLowerCase() + "%";

            return criteriaBuilder.or(

                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("name")),
                            search
                    ),

                    criteriaBuilder.like(
                            criteriaBuilder.lower(root.get("description")),
                            search
                    )
            );
        };
    }

    // ==========================
    // Filter by Category
    // ==========================
    public static Specification<Product> hasCategory(String category) {

        return (root, query, criteriaBuilder) -> {

            if (category == null || category.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    criteriaBuilder.lower(root.get("category")),
                    category.toLowerCase()
            );
        };
    }
}