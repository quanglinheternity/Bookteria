package com.devteria.profile.entity;

import java.time.LocalDateTime;

import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RelationshipProperties
public class Follows {
    @RelationshipId
    private Long id;

    @TargetNode
    private UserProfile target;

    private LocalDateTime followedAt;
}
