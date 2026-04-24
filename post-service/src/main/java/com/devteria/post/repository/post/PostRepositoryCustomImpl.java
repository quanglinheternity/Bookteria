package com.devteria.post.repository.post;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import com.devteria.post.entity.Post;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PostRepositoryCustomImpl implements PostRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Post> findAllCustom(String userId, String excludeUserId, String keyword, Pageable pageable) {
        List<Criteria> ands = new ArrayList<>();

        // Base criteria: not deleted
        ands.add(Criteria.where("deletedAt").is(null));

        // Filter by userId if provided (Only show this user's posts)
        if (StringUtils.hasText(userId)) {
            ands.add(Criteria.where("userId").is(userId));
        }

        // Exclude userId if provided (Don't show this user's posts)
        if (StringUtils.hasText(excludeUserId)) {
            ands.add(Criteria.where("userId").ne(excludeUserId));
        }

        // Search by keyword
        if (StringUtils.hasText(keyword)) {
            String rx = Pattern.quote(keyword);
            ands.add(Criteria.where("content").regex(rx, "i"));
        }

        Criteria criteria = new Criteria().andOperator(ands.toArray(new Criteria[0]));
        Query query = new Query(criteria).with(pageable);

        List<Post> posts = mongoTemplate.find(query, Post.class);
        long total = mongoTemplate.count(new Query(criteria), Post.class);

        return new PageImpl<>(posts, pageable, total);
    }
}
