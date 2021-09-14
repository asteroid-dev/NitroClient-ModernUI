import { ConditionDefinition, Triggerable } from '@nitrots/nitro-renderer';
import { IUserDefinedRoomEventsCtrl } from '../../IUserDefinedRoomEventsCtrl';
import { WiredFurniture } from '../../WiredFurniture';
import { ActorHasHandItemComponent } from './actor-has-hand-item/actor-has-hand-item.component';
import { ActorIsInGroupComponent } from './actor-is-in-group/actor-is-in-group.component';
import { ActorIsInTeamComponent } from './actor-is-in-team/actor-is-in-team.component';
import { ActorIsWearingEffectComponent } from './actor-is-wearing-effect/actor-is-wearing-effect.component';
import { ActorOnFurniComponent } from './actor-on-furni/actor-on-furni.component';
import { ActorWearsBadgeComponent } from './actor-wears-badge/actor-wears-badge.component';
import { DateRangeActiveComponent } from './date-range-active/date-range-active.component';
import { DontHaveStackedFurnisComponent } from './dont-have-stacked-furnis/dont-have-stacked-furnis.component';
import { FurniHaveHabboComponent } from './furni-have-habbo/furni-have-habbo.component';
import { FurniIsOfTypeComponent } from './furni-is-of-type/furni-is-of-type.component';
import { HasStackedFurnisComponent } from './has-stacked-furnis/has-stacked-furnis.component';
import { MatchSnapshotComponent } from './match-snapshot/match-snapshot.component';
import { StuffsInFormationComponent } from './stuffs-in-formation/stuffs-in-formation.component';
import { TimeElapsedLessComponent } from './time-elapsed-less/time-elapsed-less.component';
import { TimeElapsedMoreComponent } from './time-elapsed-more/time-elapsed-more.component';
import { UserCountInComponent } from './user-count-in/user-count-in.component';
import { WiredCondition } from './WiredCondition';

export class WiredConditionFactory implements IUserDefinedRoomEventsCtrl
{
    public _Str_9781(code: number): typeof WiredCondition
    {
        switch(code)
        {
            case ActorOnFurniComponent.CODE:
            case ActorOnFurniComponent.NEGATIVE_CODE:
                return ActorOnFurniComponent;
            case FurniHaveHabboComponent.CODE:
            case FurniHaveHabboComponent.NEGATIVE_CODE:
                return FurniHaveHabboComponent;
            case MatchSnapshotComponent.CODE:
            case MatchSnapshotComponent.NEGATIVE_CODE:
                return MatchSnapshotComponent;
            case TimeElapsedMoreComponent.CODE:
                return TimeElapsedMoreComponent;
            case TimeElapsedLessComponent.CODE:
                return TimeElapsedLessComponent;
            case UserCountInComponent.CODE:
            case UserCountInComponent.NEGATIVE_CODE:
                return UserCountInComponent;
            case ActorIsInTeamComponent.CODE:
            case ActorIsInTeamComponent.NEGATIVE_CODE:
                return ActorIsInTeamComponent;
            case HasStackedFurnisComponent.CODE:
                return HasStackedFurnisComponent;
            case FurniIsOfTypeComponent.CODE:
            case FurniIsOfTypeComponent.NEGATIVE_CODE:
                return FurniIsOfTypeComponent;
            case StuffsInFormationComponent.CODE:
            case StuffsInFormationComponent.NEGATIVE_CODE:
                return StuffsInFormationComponent;
            case ActorIsInGroupComponent.CODE:
            case ActorIsInGroupComponent.NEGATIVE_CODE:
                return ActorIsInGroupComponent;
            case ActorWearsBadgeComponent.CODE:
            case ActorWearsBadgeComponent.NEGATIVE_CODE:
                return ActorWearsBadgeComponent;
            case ActorIsWearingEffectComponent.CODE:
            case ActorIsWearingEffectComponent.NEGATIVE_CODE:
                return ActorIsWearingEffectComponent;
            case DontHaveStackedFurnisComponent.CODE:
                return DontHaveStackedFurnisComponent;
            case DateRangeActiveComponent.CODE:
                return DateRangeActiveComponent;
            case ActorHasHandItemComponent.CODE:
                return ActorHasHandItemComponent;
        }

        return null;
    }

    public _Str_15652(code: number): typeof WiredFurniture
    {
        return this._Str_9781(code);
    }

    public _Str_14545(trigger: Triggerable): boolean
    {
        return (trigger instanceof ConditionDefinition);
    }

    public _Str_1196(): string
    {
        return 'condition';
    }
}
