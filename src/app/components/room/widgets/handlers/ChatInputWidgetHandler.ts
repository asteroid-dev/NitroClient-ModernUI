import { AvatarExpressionEnum, HabboClubLevelEnum, Nitro, NitroEvent, NitroVersion, RoomControllerLevel, RoomSessionChatEvent, RoomSettingsComposer, RoomWidgetEnum, RoomZoomEvent, TextureUtils } from '@nitrots/nitro-renderer';
import { IRoomWidgetManager } from '../../IRoomWidgetManager';
import { RoomChatInputComponent } from '../chatinput/component';
import { RoomWidgetFloodControlEvent } from '../events/RoomWidgetFloodControlEvent';
import { IRoomWidgetHandler } from '../IRoomWidgetHandler';
import { RoomWidgetChatMessage } from '../messages/RoomWidgetChatMessage';
import { RoomWidgetChatSelectAvatarMessage } from '../messages/RoomWidgetChatSelectAvatarMessage';
import { RoomWidgetChatTypingMessage } from '../messages/RoomWidgetChatTypingMessage';
import { RoomWidgetRequestWidgetMessage } from '../messages/RoomWidgetRequestWidgetMessage';
import { RoomWidgetMessage } from '../RoomWidgetMessage';
import { RoomWidgetUpdateEvent } from '../RoomWidgetUpdateEvent';

export class ChatInputWidgetHandler implements IRoomWidgetHandler
{
    private _container: IRoomWidgetManager;
    private _widget: RoomChatInputComponent;

    private _disposed: boolean;

    constructor()
    {
        this._container     = null;
        this._widget        = null;

        this._disposed      = false;
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._container     = null;
        this._widget        = null;
        this._disposed      = true;
    }

    public update(): void
    {
    }

    public processWidgetMessage(message: RoomWidgetMessage): RoomWidgetUpdateEvent
    {
        if(!message || this.disposed) return null;

        let widgetMessage: RoomWidgetMessage = null;

        switch(message.type)
        {
            case RoomWidgetChatTypingMessage.TYPING_STATUS: {
                const typingMessage = (message as RoomWidgetChatTypingMessage);

                this._container.roomSession.sendChatTypingMessage(typingMessage.isTyping);
                break;
            }
            case RoomWidgetChatMessage.MESSAGE_CHAT: {
                const chatMessage = (message as RoomWidgetChatMessage);

                if(chatMessage.text === '') return null;

                let text    = chatMessage.text;
                const parts   = chatMessage.text.split(' ');

                if(parts.length > 0)
                {
                    const firstPart   = parts[0];
                    let secondPart  = '';

                    if(parts.length > 1) secondPart = parts[1];

                    if((firstPart.charAt(0) === ':') && (secondPart === 'x'))
                    {
                        const selectedAvatarId = this._container.roomEngine.selectedAvatarId;

                        if(selectedAvatarId > -1)
                        {
                            const userData = this._container.roomSession.userDataManager.getUserDataByIndex(selectedAvatarId);

                            if(userData)
                            {
                                secondPart  = userData.name;
                                text        = chatMessage.text.replace(' x', (' ' + userData.name));
                            }
                        }
                    }

                    switch(firstPart.toLowerCase())
                    {
                        case ':d':
                        case ';d':
                            if(this._container.sessionDataManager.clubLevel === HabboClubLevelEnum.VIP)
                            {
                                this._container.roomSession.sendExpressionMessage(AvatarExpressionEnum.LAUGH.ordinal);
                            }
                            break;
                        case 'o/':
                        case '_o/':
                            this._container.roomSession.sendExpressionMessage(AvatarExpressionEnum.WAVE.ordinal);
                            return null;
                        case ':kiss':
                            if(this._container.sessionDataManager.clubLevel == HabboClubLevelEnum.VIP)
                            {
                                this._container.roomSession.sendExpressionMessage(AvatarExpressionEnum.BLOW.ordinal);
                                return null;
                            }
                            break;
                        case ':jump':
                            if(this._container.sessionDataManager.clubLevel == HabboClubLevelEnum.VIP)
                            {
                                this._container.roomSession.sendExpressionMessage(AvatarExpressionEnum.JUMP.ordinal);
                                return null;
                            }
                            break;
                        case ':idle':
                            this._container.roomSession.sendExpressionMessage(AvatarExpressionEnum.IDLE.ordinal);
                            return null;
                        case '_b':
                            this._container.roomSession.sendExpressionMessage(AvatarExpressionEnum.RESPECT.ordinal);
                            return null;
                        case ':sign':
                            this._container.roomSession.sendSignMessage(parseInt(secondPart));
                            return null;
                        case ':iddqd':
                            this._container.roomEngine.events.dispatchEvent(new RoomZoomEvent(this._container.roomEngine.activeRoomId, -1, true));
                            return null;
                        case ':zoom':
                            this._container.roomEngine.events.dispatchEvent(new RoomZoomEvent(this._container.roomEngine.activeRoomId, parseInt(secondPart), false));
                            return null;
                        case ':screenshot': {
                            const texture = this._container.roomEngine.createTextureFromRoom(this._container.roomSession.roomId, this._container.getFirstCanvasId());

                            const newWindow = window.open('');

                            newWindow.document.write(TextureUtils.generateImageUrl(texture));
                            return null;
                        }
                        case ':pickall':
                            this._container.notificationService.alertWithConfirm('${room.confirm.pick_all}', '${generic.alert.title}', () =>
                            {
                                this._container.sessionDataManager.sendSpecialCommandMessage(':pickall');
                            });
                            return null;
                        case ':furni':
                            this._container.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.RWRWM_FURNI_CHOOSER));
                            return null;
                        case ':chooser':
                            this._container.processWidgetMessage(new RoomWidgetRequestWidgetMessage(RoomWidgetRequestWidgetMessage.RWRWM_USER_CHOOSER));
                            return null;
                        case ':floor':
                        case ':bcfloor':
                            if(this._container.roomSession.controllerLevel >= RoomControllerLevel.ROOM_OWNER)
                            {
                                this._container.settingsService.floorPlanVisible = true;
                            }
                            return null;
                        case ':client':
                        case ':nitro':
                        case ':billsonnn':
                            this._container.notificationService.alertWithScrollableMessages([
                                '<div class="d-flex flex-column justify-content-center align-items-center"><div class="nitro-info-box"></div><b>Renderer Version: ' + NitroVersion.RENDERER_VERSION + '</b><br /><b>UI Version: ' + NitroVersion.UI_VERSION + '</b><br />This client is powered by Nitro HTML5<br /><br /><div class="d-flex"><a class="btn btn-primary" href="https://discord.gg/66UR68FPgy" target="_blank">Discord</a><a class="btn btn-primary" href="https://git.krews.org/nitro" target="_blank">Git</a></div><br /></div>'], 'Nitro HTML5');
                            return null;
                        case ':settings':
                            if(this._container.roomSession.isRoomOwner || this._container.sessionDataManager.isModerator)
                            {
                                Nitro.instance.communication.connection.send(new RoomSettingsComposer(this._container.roomSession.roomId));
                            }
                            return null;
                    }
                }

                const styleId = chatMessage.styleId;

                if(this._container && this._container.roomSession)
                {
                    switch(chatMessage.chatType)
                    {
                        case RoomWidgetChatMessage.CHAT_DEFAULT:
                            this._container.roomSession.sendChatMessage(text, styleId);
                            break;
                        case RoomWidgetChatMessage.CHAT_SHOUT:
                            this._container.roomSession.sendShoutMessage(text, styleId);
                            break;
                        case RoomWidgetChatMessage.CHAT_WHISPER:
                            this._container.roomSession.sendWhisperMessage(chatMessage.recipientName, text, styleId);
                            break;
                    }
                }
                break;
            }
            case RoomWidgetChatSelectAvatarMessage.MESSAGE_SELECT_AVATAR:
                widgetMessage = message;
                break;
        }

        return null;
    }

    public processEvent(event: NitroEvent): void
    {
        if(!event || this._disposed) return;

        switch(event.type)
        {
            case RoomSessionChatEvent.FLOOD_EVENT: {
                const floodEvent = (event as RoomSessionChatEvent);

                const seconds = parseInt(floodEvent.message);

                this._container.events.dispatchEvent(new RoomWidgetFloodControlEvent(seconds));
                return;
            }
        }
    }

    public get type(): string
    {
        return RoomWidgetEnum.CHAT_INPUT_WIDGET;
    }

    public get messageTypes(): string[]
    {
        return [ RoomWidgetChatTypingMessage.TYPING_STATUS, RoomWidgetChatMessage.MESSAGE_CHAT, RoomWidgetChatSelectAvatarMessage.MESSAGE_SELECT_AVATAR ];
    }

    public get eventTypes(): string[]
    {
        return [ RoomSessionChatEvent.FLOOD_EVENT ];
    }

    public get container(): IRoomWidgetManager
    {
        return this._container;
    }

    public set container(container: IRoomWidgetManager)
    {
        this._container = container;
    }

    public get widget(): RoomChatInputComponent
    {
        return this._widget;
    }

    public set widget(widget: RoomChatInputComponent)
    {
        this._widget = widget;
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }
}
