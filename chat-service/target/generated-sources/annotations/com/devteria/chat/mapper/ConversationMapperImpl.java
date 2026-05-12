package com.devteria.chat.mapper;

import com.devteria.chat.dto.response.ConversationResponse;
import com.devteria.chat.entity.Conversation;
import com.devteria.chat.entity.ParticipantInfo;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ConversationMapperImpl implements ConversationMapper {

    @Override
    public ConversationResponse toConversationResponse(Conversation conversation) {
        if ( conversation == null ) {
            return null;
        }

        ConversationResponse.ConversationResponseBuilder conversationResponse = ConversationResponse.builder();

        conversationResponse.createdDate( conversation.getCreatedDate() );
        conversationResponse.id( conversation.getId() );
        conversationResponse.modifiedDate( conversation.getModifiedDate() );
        List<ParticipantInfo> list = conversation.getParticipants();
        if ( list != null ) {
            conversationResponse.participants( new ArrayList<ParticipantInfo>( list ) );
        }
        conversationResponse.participantsHash( conversation.getParticipantsHash() );
        conversationResponse.type( conversation.getType() );

        return conversationResponse.build();
    }

    @Override
    public List<ConversationResponse> toConversationResponseList(List<Conversation> conversations) {
        if ( conversations == null ) {
            return null;
        }

        List<ConversationResponse> list = new ArrayList<ConversationResponse>( conversations.size() );
        for ( Conversation conversation : conversations ) {
            list.add( toConversationResponse( conversation ) );
        }

        return list;
    }
}
