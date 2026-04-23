package com.devteria.book.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS(1007, "Username or password is incorrect", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(1010, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_EXISTED(1011, "Category existed", HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_REQUIRED(1012, "Category name is required", HttpStatus.BAD_REQUEST),
    CATEGORY_NAME_TOO_LONG(1013, "Category name is too long", HttpStatus.BAD_REQUEST),
    AUTHOR_NOT_FOUND(1020, "Author not found", HttpStatus.NOT_FOUND),
    AUTHOR_NAME_REQUIRED(1021, "Author name is required", HttpStatus.BAD_REQUEST),
    AUTHOR_NAME_TOO_LONG(1022, "Author name is too long", HttpStatus.BAD_REQUEST),
    AVATAR_URL_TOO_LONG(1023, "Avatar URL is too long", HttpStatus.BAD_REQUEST),
    BOOK_NOT_FOUND(1030, "Book not found", HttpStatus.NOT_FOUND),
    ISBN_TOO_LONG(1031, "ISBN is too long", HttpStatus.BAD_REQUEST),
    TITLE_REQUIRED(1032, "Title is required", HttpStatus.BAD_REQUEST),
    TITLE_TOO_LONG(1033, "Title is too long", HttpStatus.BAD_REQUEST),
    BOOK_EXISTED(1034, "Book already exists", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
