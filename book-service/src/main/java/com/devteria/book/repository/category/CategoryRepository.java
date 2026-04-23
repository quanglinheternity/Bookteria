package com.devteria.book.repository.category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devteria.book.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, CategoryRepositoryCustom {
    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);
}
