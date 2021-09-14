import { Triggerable, TriggerDefinition } from '@nitrots/nitro-renderer';
import { IUserDefinedRoomEventsCtrl } from '../../IUserDefinedRoomEventsCtrl';
import { WiredFurniture } from '../../WiredFurniture';
import { AvatarEnterRoomComponent } from './avatar-enter-room/avatar-enter-room.component';
import { AvatarSaysSomethingComponent } from './avatar-says-something/avatar-says-something.component';
import { AvatarWalksOffFurniComponent } from './avatar-walks-off-furni/avatar-walks-off-furni.component';
import { AvatarWalksOnFurniComponent } from './avatar-walks-on-furni/avatar-walks-on-furni.component';
import { BotReachedAvatarComponent } from './bot-reached-avatar/bot-reached-avatar.component';
import { BotReachedStuffComponent } from './bot-reached-stuff/bot-reached-stuff.component';
import { CollisionComponent } from './collision/collision.component';
import { GameEndsComponent } from './game-ends/game-ends.component';
import { GameStartsComponent } from './game-starts/game-starts.component';
import { ScoreAchievedComponent } from './score-achieved/score-achieved.component';
import { ToggleFurniComponent } from './toggle-furni/toggle-furni.component';
import { TriggerOnceComponent } from './trigger-once/trigger-once.component';
import { TriggerPeriodicallyLongComponent } from './trigger-periodically-long/trigger-periodically-long.component';
import { TriggerPeriodicallyComponent } from './trigger-periodically/trigger-periodically.component';
import { WiredTrigger } from './WiredTrigger';

export class WiredTriggerFactory implements IUserDefinedRoomEventsCtrl
{
    public _Str_9781(code: number): typeof WiredTrigger
    {
        switch(code)
        {
            case AvatarSaysSomethingComponent.CODE:
                return AvatarSaysSomethingComponent;
            case AvatarWalksOnFurniComponent.CODE:
                return AvatarWalksOnFurniComponent;
            case AvatarWalksOffFurniComponent.CODE:
                return AvatarWalksOffFurniComponent;
            case TriggerOnceComponent.CODE:
                return TriggerOnceComponent;
            case ToggleFurniComponent.CODE:
                return ToggleFurniComponent;
            case TriggerPeriodicallyComponent.CODE:
                return TriggerPeriodicallyComponent;
            case AvatarEnterRoomComponent.CODE:
                return AvatarEnterRoomComponent;
            case GameStartsComponent.CODE:
                return GameStartsComponent;
            case GameEndsComponent.CODE:
                return GameEndsComponent;
            case ScoreAchievedComponent.CODE:
                return ScoreAchievedComponent;
            case CollisionComponent.CODE:
                return CollisionComponent;
            case TriggerPeriodicallyLongComponent.CODE:
                return TriggerPeriodicallyLongComponent;
            case BotReachedStuffComponent.CODE:
                return BotReachedStuffComponent;
            case BotReachedAvatarComponent.CODE:
                return BotReachedAvatarComponent;
        }

        return null;
    }

    public _Str_15652(code: number): typeof WiredFurniture
    {
        return this._Str_9781(code);
    }

    public _Str_14545(trigger: Triggerable): boolean
    {
        return (trigger instanceof TriggerDefinition);
    }

    public _Str_1196(): string
    {
        return 'trigger';
    }
}
