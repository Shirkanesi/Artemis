package de.tum.in.www1.artemis.repository.metis;

import java.util.Optional;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import de.tum.in.www1.artemis.domain.metis.ConversationParticipant;
import de.tum.in.www1.artemis.web.rest.errors.EntityNotFoundException;

/**
 * Spring Data repository for the ConversationParticipant entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipant, Long> {

    @Query("""
            SELECT DISTINCT conversationParticipant
            FROM ConversationParticipant conversationParticipant
            WHERE conversationParticipant.conversation.id = :#{#conversationId}
            AND conversationParticipant.user.id in :#{#userIds}
            """)
    Set<ConversationParticipant> findConversationParticipantsByConversationIdAndUserIds(Long conversationId, Set<Long> userIds);

    @Query("""
            SELECT DISTINCT conversationParticipant
            FROM ConversationParticipant conversationParticipant
            WHERE conversationParticipant.conversation.id = :#{#conversationId}
            """)
    Set<ConversationParticipant> findConversationParticipantByConversationId(@Param("conversationId") Long conversationId);

    Optional<ConversationParticipant> findConversationParticipantByConversationIdAndUserId(Long conversationId, Long userId);

    default ConversationParticipant findConversationParticipantByConversationIdAndUserIdElseThrow(Long conversationId, Long userId) {
        return this.findConversationParticipantByConversationIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation participant not found!"));
    }

    @Query("""
            SELECT DISTINCT conversationParticipant
            FROM ConversationParticipant conversationParticipant
            WHERE conversationParticipant.conversation.id = :#{#conversationId}
            AND conversationParticipant.user.id = :#{#userId}
            AND conversationParticipant.isModerator = true
            """)
    Optional<ConversationParticipant> findModeratorConversationParticipantByConversationIdAndUserId(Long conversationId, Long userId);

    Integer countByConversationId(Long conversationId);

    @Transactional // ok because of delete
    @Modifying
    void deleteAllByConversationId(Long conversationId);

    /**
     * Increment unreadMessageCount field of ConversationParticipant
     *
     * @param senderId       userId of the sender of the message(Post)
     * @param conversationId conversationId id of the conversation with participants
     */
    @Transactional // ok because of modifying query
    @Modifying
    @Query("""
            UPDATE ConversationParticipant conversationParticipant
            SET conversationParticipant.unreadMessagesCount = conversationParticipant.unreadMessagesCount + 1
            WHERE conversationParticipant.conversation.id = :#{#conversationId}
            AND (conversationParticipant.user.id <> :#{#senderId})
            AND conversationParticipant.unreadMessagesCount IS NOT null
            """)
    void incrementUnreadMessagesCountOfParticipants(@Param("conversationId") Long conversationId, @Param("senderId") Long senderId);

    /**
     * Decrement unreadMessageCount field of ConversationParticipant
     *
     * @param senderId       userId of the sender of the message(Post)
     * @param conversationId conversationId id of the conversation with participants
     */
    @Transactional
    @Modifying
    @Query("""
            UPDATE ConversationParticipant conversationParticipant
            SET conversationParticipant.unreadMessagesCount = conversationParticipant.unreadMessagesCount - 1
            WHERE conversationParticipant.conversation.id = :#{#conversationId}
            AND (conversationParticipant.user.id <> :#{#senderId})
            AND conversationParticipant.unreadMessagesCount > 0
            AND conversationParticipant.unreadMessagesCount IS NOT null
            """)
    void decrementUnreadMessagesCountOfParticipants(@Param("conversationId") Long conversationId, @Param("senderId") Long senderId);
}
