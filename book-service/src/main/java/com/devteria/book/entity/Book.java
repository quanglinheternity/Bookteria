package com.devteria.book.entity;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(
        name = "book",
        indexes = {
            @Index(name = "idx_book_title", columnList = "title"),
            @Index(name = "idx_book_isbn", columnList = "isbn"),
            @Index(name = "idx_book_category", columnList = "category_id"),
            @Index(name = "idx_book_published_year", columnList = "published_year")
        })
public class Book extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(unique = true, length = 20)
    String isbn;

    @Column(nullable = false, length = 300)
    String title;

    @Column(length = 300)
    String subtitle;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(length = 200)
    String publisher;

    @Column(name = "published_year")
    Integer publishedYear;

    @Column(name = "page_count")
    Integer pageCount;

    @Builder.Default
    @Column(length = 50)
    String language = "vi";

    @Column(name = "cover_image_url", length = 500)
    String coverImageUrl;

    @Builder.Default
    @Column(name = "average_rating", precision = 3, scale = 2)
    BigDecimal averageRating = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "total_reviews")
    Integer totalReviews = 0;

    @Builder.Default
    @Column(name = "total_reads")
    Integer totalReads = 0;

    @ManyToOne
    @JoinColumn(name = "category_id")
    Category category;

    @ManyToMany
    @JoinTable(
            name = "book_author",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id"))
    Set<Author> authors;

    @Column(name = "created_by", nullable = false)
    UUID createdBy;
}
