package com.devteria.book.utils;

public class SlugUtil {

    public static String toSlug(String input) {
        if (input == null) return null;
        String normalized = java.text.Normalizer.normalize(input, java.text.Normalizer.Form.NFD);

        String slug = normalized
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "") // bỏ dấu
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // bỏ ký tự đặc biệt
                .trim()
                .replaceAll("\\s+", "-"); // space -> -

        return slug;
    }
}
