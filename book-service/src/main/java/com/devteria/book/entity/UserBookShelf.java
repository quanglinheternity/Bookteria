package com.devteria.book.entity;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

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
        name = "user_book_shelf",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "book_id"}),
        indexes = {
            @Index(name = "idx_user_book_shelf_user", columnList = "user_id"),
            @Index(name = "idx_user_book_shelf_status", columnList = "status")
        })
public class UserBookShelf extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "user_id", nullable = false)
    UUID userId;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    Book book;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    ReadingStatus status;

    @Builder.Default
    Integer progress = 0;

    @Column(name = "started_at")
    LocalDate startedAt;

    @Column(name = "finished_at")
    LocalDate finishedAt;

    @Column(name = "rating")
    Integer rating;

    @Column(name = "review_note", columnDefinition = "TEXT")
    String reviewNote;
}
