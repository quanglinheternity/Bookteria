package com.devteria.post.repository.comment;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.GraphLookupOperation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import com.devteria.post.entity.Comment;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CommentRepositoryCustomImpl implements CommentRepositoryCustom {
    private final MongoTemplate mongoTemplate;

    @Override
    public List<Comment> getNestedComments(String postId) {
        MatchOperation match = Aggregation.match(
                Criteria.where("postId").is(postId)
                        .and("parentId").is(null)
                        .and("deletedAt").is(null)
        );

        GraphLookupOperation graphLookup = Aggregation.graphLookup("comments")
                .startWith("$_id")
                .connectFrom("_id")
                .connectTo("parentId")
                .maxDepth(5L)
                .depthField("level")
                .restrict(Criteria.where("deletedAt").is(null))
                .as("replies");

        SortOperation sort = Aggregation.sort(Sort.by(Sort.Order.asc("createdAt")));

        Aggregation aggregation = Aggregation.newAggregation(match, graphLookup, sort);
        return mongoTemplate.aggregate(aggregation, "comments", Comment.class).getMappedResults();
    }
}
