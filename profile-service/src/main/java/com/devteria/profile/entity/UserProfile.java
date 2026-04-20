package com.devteria.profile.entity;

import java.time.LocalDate;
import java.util.Set;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.support.UUIDStringGenerator;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Node("user_profile")
public class UserProfile {
    @Id
    @GeneratedValue(generatorClass = UUIDStringGenerator.class)
    String id;

    String userId;

    String username;
    String firstName;
    String lastName;

    String avatar;
    String bio;

    String city;
    LocalDate dob;

    String level;

    @Relationship(type = "FOLLOWS", direction = Relationship.Direction.OUTGOING)
    Set<Follows> following;

    @Relationship(type = "FOLLOWS", direction = Relationship.Direction.INCOMING)
    Set<Follows> followers;
}
