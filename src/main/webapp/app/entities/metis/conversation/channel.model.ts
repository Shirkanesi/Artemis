import { Conversation, ConversationDto, ConversationType } from 'app/entities/metis/conversation/conversation.model';

/**
 * Entity
 */
export class Channel extends Conversation {
    public name?: string; // max 20 characters
    public description?: string; // max 250 characters
    public topic?: string; // max 250 characters;
    public isPublic?: boolean;
    public isAnnouncementChannel?: boolean;
    public isArchived?: boolean;

    constructor() {
        super(ConversationType.CHANNEL);
    }
}

/**
 * DTO
 */
export class ChannelDTO extends ConversationDto {
    public name?: string;
    public description?: string;
    public topic?: string;
    public isPublic?: boolean;
    public isAnnouncementChannel?: boolean;
    public isArchived?: boolean;
    public isChannelModerator?: boolean;
    public hasChannelModerationRights?: boolean;

    public tutorialGroupId?: number;

    public tutorialGroupTitle?: string;
    constructor() {
        super(ConversationType.CHANNEL);
    }
}
export function isChannelDto(conversation: ConversationDto): conversation is ChannelDTO {
    return conversation.type === ConversationType.CHANNEL;
}

export function getAsChannelDto(conversation: ConversationDto | undefined): ChannelDTO | undefined {
    if (!conversation) {
        return undefined;
    }
    return isChannelDto(conversation) ? conversation : undefined;
}
