package com.devteria.book.repository.author;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devteria.book.entity.Author;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long>, AuthorRepositoryCustom {}
