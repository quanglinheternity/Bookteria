package com.devteria.book.entity;

import java.time.LocalDate;
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
@Table(name = "author")
public class Author extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false, length = 150)
    String name;

    @Column(columnDefinition = "TEXT")
    String bio;

    @Column(name = "birth_date")
    LocalDate birthDate;

    @Column(length = 100)
    String nationality;

    @Column(name = "avatar_url", length = 500)
    String avatarUrl;

    @ManyToMany(mappedBy = "authors", fetch = FetchType.LAZY)
    Set<Book> books;
}
