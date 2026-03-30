<<<<<<<< HEAD:notification-service/src/main/java/com/devteria/notification/exception/AppException.java
package com.devteria.notification.exception;
========
package com.devteria.post.exception;
>>>>>>>> quanglinh/post-service:post-service/src/main/java/com/devteria/post/exception/AppException.java

public class AppException extends RuntimeException {

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    private ErrorCode errorCode;

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
