import { Triggerable, WiredActionDefinition } from '@nitrots/nitro-renderer';
import { IUserDefinedRoomEventsCtrl } from '../../IUserDefinedRoomEventsCtrl';
import { WiredFurniture } from '../../WiredFurniture';
import { BotChangeFigureComponent } from './bot-change-figure/bot-change-figure.component';
import { BotFollowAvatarComponent } from './bot-follow-avatar/bot-follow-avatar.component';
import { BotGiveHandItemComponent } from './bot-give-hand-item/bot-give-hand-item.component';
import { BotMoveComponent } from './bot-move/bot-move.component';
import { BotTalkDirectToAvatarComponent } from './bot-talk-direct-to-avatar/bot-talk-direct-to-avatar.component';
import { BotTalkComponent } from './bot-talk/bot-talk.component';
import { BotTeleportComponent } from './bot-teleport/bot-teleport.component';
import { CallAnotherStackComponent } from './call-another-stack/call-another-stack.component';
import { ChaseComponent } from './chase/chase.component';
import { ChatComponent } from './chat/chat.component';
import { FleeComponent } from './flee/flee.component';
import { GiveRewardComponent } from './give-reward/give-reward.component';
import { GiveScoreToPredefinedTeamComponent } from './give-score-to-predefined-team/give-score-to-predifined-team.component';
import { GiveScoreComponent } from './give-score/give-score.component';
import { JoinTeamComponent } from './join-team/join-team.component';
import { KickFromRoomComponent } from './kick-from-room/kick-from-room.component';
import { LeaveTeamComponent } from './leave-team/leave-team.component';
import { MoveFurniToComponent } from './move-furni-to/move-furni-to.component';
import { MoveFurniComponent } from './move-furni/move-furni.component';
import { MoveToDirectionComponent } from './move-to-direction/move-to-direction.component';
import { MuteUserComponent } from './mute-user/mute-user.component';
import { ResetComponent } from './reset/reset.component';
import { SetFurniStateToComponent } from './set-furni-state-to/set-furni-state-to.component';
import { TeleportComponent } from './teleport/teleport.component';
import { ToggleFurniStateComponent } from './toggle-furni-state/toggle-furni-state.component';
import { WiredAction } from './WiredAction';

export class WiredActionFactory implements IUserDefinedRoomEventsCtrl
{
    public _Str_9781(code: number): typeof WiredAction
    {
        switch(code)
        {
            case ToggleFurniStateComponent.CODE:
                return ToggleFurniStateComponent;
            case TeleportComponent.CODE:
                return TeleportComponent;
            case ChaseComponent.CODE:
                return ChaseComponent;
            case FleeComponent.CODE:
                return FleeComponent;
            case CallAnotherStackComponent.CODE:
                return CallAnotherStackComponent;
            case ChatComponent.CODE:
                return ChatComponent;
            case BotGiveHandItemComponent.CODE:
                return BotGiveHandItemComponent;
            case BotFollowAvatarComponent.CODE:
                return BotFollowAvatarComponent;
            case LeaveTeamComponent.CODE:
                return LeaveTeamComponent;
            case ResetComponent.CODE:
                return ResetComponent;
            case KickFromRoomComponent.CODE:
                return KickFromRoomComponent;
            case BotTeleportComponent.CODE:
                return BotTeleportComponent;
            case SetFurniStateToComponent.CODE:
                return SetFurniStateToComponent;
            case BotMoveComponent.CODE:
                return BotMoveComponent;
            case MuteUserComponent.CODE:
                return MuteUserComponent;
            case BotChangeFigureComponent.CODE:
                return BotChangeFigureComponent;
            case BotTalkDirectToAvatarComponent.CODE:
                return BotTalkDirectToAvatarComponent;
            case BotTalkComponent.CODE:
                return BotTalkComponent;
            case MoveFurniComponent.CODE:
                return MoveFurniComponent;
            case MoveToDirectionComponent.CODE:
                return MoveToDirectionComponent;
            case JoinTeamComponent.CODE:
                return JoinTeamComponent;
            case GiveScoreToPredefinedTeamComponent.CODE:
                return GiveScoreToPredefinedTeamComponent;
            case GiveScoreComponent.CODE:
                return GiveScoreComponent;
            case MoveFurniToComponent.CODE:
                return MoveFurniToComponent;
            case GiveRewardComponent.CODE:
                return GiveRewardComponent;
        }

        return null;
    }

    public _Str_15652(code: number): typeof WiredFurniture
    {
        return this._Str_9781(code);
    }

    public _Str_14545(trigger: Triggerable): boolean
    {
        return (trigger instanceof WiredActionDefinition);
    }

    public _Str_1196(): string
    {
        return 'action';
    }
}
