import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { WiredActionBaseComponent } from './components/actions/action-base/action-base.component';
import { BotChangeFigureComponent } from './components/actions/bot-change-figure/bot-change-figure.component';
import { BotFollowAvatarComponent } from './components/actions/bot-follow-avatar/bot-follow-avatar.component';
import { BotGiveHandItemComponent } from './components/actions/bot-give-hand-item/bot-give-hand-item.component';
import { BotMoveComponent } from './components/actions/bot-move/bot-move.component';
import { BotTalkDirectToAvatarComponent } from './components/actions/bot-talk-direct-to-avatar/bot-talk-direct-to-avatar.component';
import { BotTalkComponent } from './components/actions/bot-talk/bot-talk.component';
import { BotTeleportComponent } from './components/actions/bot-teleport/bot-teleport.component';
import { CallAnotherStackComponent } from './components/actions/call-another-stack/call-another-stack.component';
import { ChaseComponent } from './components/actions/chase/chase.component';
import { ChatComponent } from './components/actions/chat/chat.component';
import { FleeComponent } from './components/actions/flee/flee.component';
import { GiveRewardComponent } from './components/actions/give-reward/give-reward.component';
import { GiveScoreToPredefinedTeamComponent } from './components/actions/give-score-to-predefined-team/give-score-to-predifined-team.component';
import { GiveScoreComponent } from './components/actions/give-score/give-score.component';
import { JoinTeamComponent } from './components/actions/join-team/join-team.component';
import { KickFromRoomComponent } from './components/actions/kick-from-room/kick-from-room.component';
import { LeaveTeamComponent } from './components/actions/leave-team/leave-team.component';
import { MoveFurniToComponent } from './components/actions/move-furni-to/move-furni-to.component';
import { MoveFurniComponent } from './components/actions/move-furni/move-furni.component';
import { MoveToDirectionComponent } from './components/actions/move-to-direction/move-to-direction.component';
import { MuteUserComponent } from './components/actions/mute-user/mute-user.component';
import { ResetComponent } from './components/actions/reset/reset.component';
import { SetFurniStateToComponent } from './components/actions/set-furni-state-to/set-furni-state-to.component';
import { TeleportComponent } from './components/actions/teleport/teleport.component';
import { ToggleFurniStateComponent } from './components/actions/toggle-furni-state/toggle-furni-state.component';
import { WiredBaseComponent } from './components/base/base.component';
import { ActorHasHandItemComponent } from './components/conditions/actor-has-hand-item/actor-has-hand-item.component';
import { ActorIsInGroupComponent } from './components/conditions/actor-is-in-group/actor-is-in-group.component';
import { ActorIsInTeamComponent } from './components/conditions/actor-is-in-team/actor-is-in-team.component';
import { ActorIsWearingEffectComponent } from './components/conditions/actor-is-wearing-effect/actor-is-wearing-effect.component';
import { ActorOnFurniComponent } from './components/conditions/actor-on-furni/actor-on-furni.component';
import { ActorWearsBadgeComponent } from './components/conditions/actor-wears-badge/actor-wears-badge.component';
import { DateRangeActiveComponent } from './components/conditions/date-range-active/date-range-active.component';
import { DontHaveStackedFurnisComponent } from './components/conditions/dont-have-stacked-furnis/dont-have-stacked-furnis.component';
import { FurniHaveHabboComponent } from './components/conditions/furni-have-habbo/furni-have-habbo.component';
import { FurniIsOfTypeComponent } from './components/conditions/furni-is-of-type/furni-is-of-type.component';
import { HasStackedFurnisComponent } from './components/conditions/has-stacked-furnis/has-stacked-furnis.component';
import { MatchSnapshotComponent } from './components/conditions/match-snapshot/match-snapshot.component';
import { StuffsInFormationComponent } from './components/conditions/stuffs-in-formation/stuffs-in-formation.component';
import { TimeElapsedLessComponent } from './components/conditions/time-elapsed-less/time-elapsed-less.component';
import { TimeElapsedMoreComponent } from './components/conditions/time-elapsed-more/time-elapsed-more.component';
import { UserCountInComponent } from './components/conditions/user-count-in/user-count-in.component';
import { WiredMainComponent } from './components/main/main.component';
import { AvatarEnterRoomComponent } from './components/triggers/avatar-enter-room/avatar-enter-room.component';
import { AvatarSaysSomethingComponent } from './components/triggers/avatar-says-something/avatar-says-something.component';
import { AvatarWalksOffFurniComponent } from './components/triggers/avatar-walks-off-furni/avatar-walks-off-furni.component';
import { AvatarWalksOnFurniComponent } from './components/triggers/avatar-walks-on-furni/avatar-walks-on-furni.component';
import { BotReachedAvatarComponent } from './components/triggers/bot-reached-avatar/bot-reached-avatar.component';
import { BotReachedStuffComponent } from './components/triggers/bot-reached-stuff/bot-reached-stuff.component';
import { CollisionComponent } from './components/triggers/collision/collision.component';
import { GameEndsComponent } from './components/triggers/game-ends/game-ends.component';
import { GameStartsComponent } from './components/triggers/game-starts/game-starts.component';
import { ScoreAchievedComponent } from './components/triggers/score-achieved/score-achieved.component';
import { ToggleFurniComponent } from './components/triggers/toggle-furni/toggle-furni.component';
import { TriggerOnceComponent } from './components/triggers/trigger-once/trigger-once.component';
import { TriggerPeriodicallyLongComponent } from './components/triggers/trigger-periodically-long/trigger-periodically-long.component';
import { TriggerPeriodicallyComponent } from './components/triggers/trigger-periodically/trigger-periodically.component';
import { WiredService } from './services/wired.service';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
    ],
    exports: [
        WiredMainComponent,
        WiredBaseComponent,
        WiredActionBaseComponent,
        ActorHasHandItemComponent,
        ActorIsInGroupComponent,
        ActorIsInTeamComponent,
        ActorIsWearingEffectComponent,
        ActorOnFurniComponent,
        ActorWearsBadgeComponent,
        DateRangeActiveComponent,
        DontHaveStackedFurnisComponent,
        FurniHaveHabboComponent,
        FurniIsOfTypeComponent,
        HasStackedFurnisComponent,
        MatchSnapshotComponent,
        StuffsInFormationComponent,
        TimeElapsedLessComponent,
        TimeElapsedMoreComponent,
        UserCountInComponent,
        AvatarEnterRoomComponent,
        AvatarSaysSomethingComponent,
        AvatarWalksOffFurniComponent,
        AvatarWalksOnFurniComponent,
        BotReachedAvatarComponent,
        BotReachedStuffComponent,
        CollisionComponent,
        GameEndsComponent,
        GameStartsComponent,
        ScoreAchievedComponent,
        ToggleFurniComponent,
        TriggerOnceComponent,
        TriggerPeriodicallyComponent,
        TriggerPeriodicallyLongComponent,
        ToggleFurniStateComponent,
        TeleportComponent,
        ChaseComponent,
        FleeComponent,
        CallAnotherStackComponent,
        ChatComponent,
        BotGiveHandItemComponent,
        BotFollowAvatarComponent,
        LeaveTeamComponent,
        ResetComponent,
        KickFromRoomComponent,
        BotTeleportComponent,
        SetFurniStateToComponent,
        BotMoveComponent,
        MuteUserComponent,
        BotChangeFigureComponent,
        BotTalkDirectToAvatarComponent,
        BotTalkComponent,
        MoveFurniComponent,
        MoveToDirectionComponent,
        JoinTeamComponent,
        GiveScoreToPredefinedTeamComponent,
        GiveScoreComponent,
        MoveFurniToComponent,
        GiveRewardComponent,
    ],
    providers: [
        WiredService
    ],
    declarations: [
        WiredMainComponent,
        WiredBaseComponent,
        WiredActionBaseComponent,
        ActorHasHandItemComponent,
        ActorIsInGroupComponent,
        ActorIsInTeamComponent,
        ActorIsWearingEffectComponent,
        ActorOnFurniComponent,
        ActorWearsBadgeComponent,
        DateRangeActiveComponent,
        DontHaveStackedFurnisComponent,
        FurniHaveHabboComponent,
        FurniIsOfTypeComponent,
        HasStackedFurnisComponent,
        MatchSnapshotComponent,
        StuffsInFormationComponent,
        TimeElapsedLessComponent,
        TimeElapsedMoreComponent,
        UserCountInComponent,
        AvatarEnterRoomComponent,
        AvatarSaysSomethingComponent,
        AvatarWalksOffFurniComponent,
        AvatarWalksOnFurniComponent,
        BotReachedAvatarComponent,
        BotReachedStuffComponent,
        CollisionComponent,
        GameEndsComponent,
        GameStartsComponent,
        ScoreAchievedComponent,
        ToggleFurniComponent,
        TriggerOnceComponent,
        TriggerPeriodicallyComponent,
        TriggerPeriodicallyLongComponent,
        ToggleFurniStateComponent,
        TeleportComponent,
        ChaseComponent,
        FleeComponent,
        CallAnotherStackComponent,
        ChatComponent,
        BotGiveHandItemComponent,
        BotFollowAvatarComponent,
        LeaveTeamComponent,
        ResetComponent,
        KickFromRoomComponent,
        BotTeleportComponent,
        SetFurniStateToComponent,
        BotMoveComponent,
        MuteUserComponent,
        BotChangeFigureComponent,
        BotTalkDirectToAvatarComponent,
        BotTalkComponent,
        MoveFurniComponent,
        MoveToDirectionComponent,
        JoinTeamComponent,
        GiveScoreToPredefinedTeamComponent,
        GiveScoreComponent,
        MoveFurniToComponent,
        GiveRewardComponent,
    ]
})
export class WiredModule
{}
