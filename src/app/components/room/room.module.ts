import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RoomComponent } from './room.component';
import { RoomAvatarInfoAvatarComponent } from './widgets/avatarinfo/components/avatar/avatar.component';
import { RoomAvatarInfoDecorateComponent } from './widgets/avatarinfo/components/decorate/decorate.component';
import { RoomAvatarInfoComponent } from './widgets/avatarinfo/components/main/main.component';
import { RoomAvatarInfoNameComponent } from './widgets/avatarinfo/components/name/name.component';
import { RoomAvatarInfoOwnAvatarComponent } from './widgets/avatarinfo/components/ownavatar/ownavatar.component';
import { RoomAvatarInfoOwnPetComponent } from './widgets/avatarinfo/components/ownpet/ownpet.component';
import { RoomAvatarInfoPetComponent } from './widgets/avatarinfo/components/pet/pet.component';
import { RoomAvatarInfoRentableBotComponent } from './widgets/avatarinfo/components/rentablebot/rentablebot.component';
import { RoomChatInputComponent } from './widgets/chatinput/component';
import { RoomChatInputStyleSelectorComponent } from './widgets/chatinput/styleselector/component';
import { ChooserWidgetBaseComponent } from './widgets/choosers/base/base.component';
import { ChooserWidgetFurniComponent } from './widgets/choosers/furni/furni.component';
import { ChooserWidgetUserComponent } from './widgets/choosers/user/user.component';
import { FriendRequestDialogComponent } from './widgets/friendrequest/components/dialog/dialog.component';
import { FriendRequestMainComponent } from './widgets/friendrequest/components/main/main.component';
import { BackgroundColorFurniWidget } from './widgets/furniture/backgroundcolor/backgroundcolor.component';
import { FurnitureContextMenuWidget } from './widgets/furniture/context-menu/components/main/main.component';
import { PurchaseClothingComponent } from './widgets/furniture/context-menu/components/purchasable-clothing/purchasable-clothing.component';
import { FurnitureWidgetCreditComponent } from './widgets/furniture/credit/credit.component';
import { CustomStackHeightComponent } from './widgets/furniture/customstackheight/customstackheight.component';
import { DimmerFurniComponent } from './widgets/furniture/dimmer/dimmer.component';
import { FriendsFurniConfirmWidget } from './widgets/furniture/friendfurni/confirm.component';
import { FriendFurniEngravingWidget } from './widgets/furniture/friendfurni/friendfurni.component';
import { PresentFurniWidget } from './widgets/furniture/gift-opening/present.component';
import { HighscoreComponent } from './widgets/furniture/highscore/highscore.component';
import { MannequinWidget } from './widgets/furniture/mannequin/mannequin.component';
import { StickieFurniComponent } from './widgets/furniture/stickies/stickie.component';
import { FurnitureWidgetTrophyComponent } from './widgets/furniture/trophies/trophy.component';
import { RoomInfoStandBotComponent } from './widgets/infostand/components/bot/bot.component';
import { RoomInfoStandFurniComponent } from './widgets/infostand/components/furni/furni.component';
import { RoomInfoStandMainComponent } from './widgets/infostand/components/main/main.component';
import { RoomInfoStandPetComponent } from './widgets/infostand/components/pet/pet.component';
import { RoomInfoStandRentableBotComponent } from './widgets/infostand/components/rentablebot/rentablebot.component';
import { RoomInfoStandUserComponent } from './widgets/infostand/components/user/user.component';
import { DoorbellWidgetComponent } from './widgets/navigator/doorbell/doorbell.component';
import { RoomChatItemComponent } from './widgets/roomchat/chatitem/component';
import { RoomChatComponent } from './widgets/roomchat/component';
import { RoomToolsMainComponent } from './widgets/roomtools/main/main.component';
import { FloorplanModule } from './floorplan/floorplan.module';

@NgModule({
    imports: [
        SharedModule,
        FloorplanModule
    ],
    exports: [
        RoomComponent,
        RoomChatInputComponent,
        RoomChatComponent,
        RoomChatItemComponent,
        RoomChatInputStyleSelectorComponent,
        RoomInfoStandMainComponent,
        RoomInfoStandBotComponent,
        RoomInfoStandFurniComponent,
        RoomInfoStandPetComponent,
        RoomInfoStandRentableBotComponent,
        RoomInfoStandUserComponent,
        RoomAvatarInfoAvatarComponent,
        RoomAvatarInfoDecorateComponent,
        RoomAvatarInfoComponent,
        RoomAvatarInfoNameComponent,
        RoomAvatarInfoOwnAvatarComponent,
        RoomAvatarInfoOwnPetComponent,
        RoomAvatarInfoPetComponent,
        RoomAvatarInfoRentableBotComponent,
        FriendRequestDialogComponent,
        FriendRequestMainComponent,
        FurnitureContextMenuWidget,
        PurchaseClothingComponent,
        CustomStackHeightComponent,
        DimmerFurniComponent,
        StickieFurniComponent,
        FurnitureWidgetTrophyComponent,
        FurnitureWidgetCreditComponent,
        FriendsFurniConfirmWidget,
        FriendFurniEngravingWidget,
        ChooserWidgetBaseComponent,
        ChooserWidgetFurniComponent,
        ChooserWidgetUserComponent,
        DoorbellWidgetComponent,
        PresentFurniWidget,
        DoorbellWidgetComponent,
        BackgroundColorFurniWidget,
        RoomToolsMainComponent,
        DoorbellWidgetComponent,
        MannequinWidget,
        RoomToolsMainComponent,
        HighscoreComponent
    ],
    declarations: [
        RoomComponent,
        RoomChatInputComponent,
        RoomChatComponent,
        RoomChatItemComponent,
        RoomChatInputStyleSelectorComponent,
        RoomInfoStandMainComponent,
        RoomInfoStandBotComponent,
        RoomInfoStandFurniComponent,
        RoomInfoStandPetComponent,
        RoomInfoStandRentableBotComponent,
        RoomInfoStandUserComponent,
        RoomAvatarInfoAvatarComponent,
        RoomAvatarInfoDecorateComponent,
        RoomAvatarInfoComponent,
        RoomAvatarInfoNameComponent,
        RoomAvatarInfoOwnAvatarComponent,
        RoomAvatarInfoOwnPetComponent,
        RoomAvatarInfoPetComponent,
        RoomAvatarInfoRentableBotComponent,
        FriendRequestDialogComponent,
        FriendRequestMainComponent,
        FurnitureContextMenuWidget,
        PurchaseClothingComponent,
        CustomStackHeightComponent,
        DimmerFurniComponent,
        StickieFurniComponent,
        FurnitureWidgetTrophyComponent,
        FurnitureWidgetCreditComponent,
        FriendsFurniConfirmWidget,
        FriendFurniEngravingWidget,
        ChooserWidgetBaseComponent,
        ChooserWidgetFurniComponent,
        ChooserWidgetUserComponent,
        DoorbellWidgetComponent,
        BackgroundColorFurniWidget,
        RoomToolsMainComponent,
        DoorbellWidgetComponent,
        MannequinWidget,
        DoorbellWidgetComponent,
        PresentFurniWidget,
        RoomToolsMainComponent,
        HighscoreComponent
    ]
})
export class RoomModule
{}
