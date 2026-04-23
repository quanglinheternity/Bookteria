package com.devteria.book.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.devteria.book.dto.request.AuthorCreationRequest;
import com.devteria.book.dto.request.AuthorSearchRequest;
import com.devteria.book.dto.request.AuthorUpdateRequest;
import com.devteria.book.dto.response.AuthorResponse;
import com.devteria.book.dto.response.PageResponse;
import com.devteria.book.entity.Author;
import com.devteria.book.exception.AppException;
import com.devteria.book.exception.ErrorCode;
import com.devteria.book.mapper.AuthorMapper;
import com.devteria.book.repository.author.AuthorRepository;
import com.devteria.book.repository.httpclient.FileClient;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthorService {
    AuthorRepository authorRepository;
    AuthorMapper authorMapper;
    FileClient fileClient;

    public AuthorResponse create(AuthorCreationRequest request) {
        Author author = authorMapper.toAuthor(request);

        if (request.getAvatar() != null) {
            var response = fileClient.uploadMedia(request.getAvatar());
            author.setAvatarUrl(response.getResult().getUrl());
        }

        return authorMapper.toAuthorResponse(authorRepository.save(author));
    }

    public PageResponse<AuthorResponse> getAll(int page, int size, AuthorSearchRequest criteria) {
        Pageable pageable = PageRequest.of(page - 1, size);
        var pageData = authorRepository.searchAuthors(criteria, pageable);

        return PageResponse.<AuthorResponse>builder()
                .currentPage(page)
                .pageSize(pageData.getSize())
                .totalPages(pageData.getTotalPages())
                .totalElements(pageData.getTotalElements())
                .data(pageData.getContent().stream()
                        .map(authorMapper::toAuthorResponse)
                        .toList())
                .build();
    }

    public AuthorResponse getById(Long id) {
        return authorRepository
                .findById(id)
                .map(authorMapper::toAuthorResponse)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
    }

    public AuthorResponse update(Long id, AuthorUpdateRequest request) {
        Author author = authorRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));

        authorMapper.updateAuthor(author, request);

        if (request.getAvatar() != null) {
            var response = fileClient.uploadMedia(request.getAvatar());
            author.setAvatarUrl(response.getResult().getUrl());
        }

        return authorMapper.toAuthorResponse(authorRepository.save(author));
    }

    public void delete(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new AppException(ErrorCode.AUTHOR_NOT_FOUND);
        }
        authorRepository.deleteById(id);
    }
}
