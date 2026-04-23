package com.devteria.book.entity;

import java.util.Set;

import jakarta.persistence.*;

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
@Table(name = "category")
public class Category extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, unique = true, length = 100)
    String name;

    @Column(columnDefinition = "TEXT")
    String description;

    @Column(unique = true, length = 120)
    String slug;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    Set<Book> books;
}
