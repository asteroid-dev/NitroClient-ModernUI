import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GroupCreatorImageSelectorComponent } from './components/group-creator/components/image-selector/image-selector.component';
import { GroupCreatorComponent } from './components/group-creator/components/main/group-creator.component';
import { GroupCreatorTabBadgeComponent } from './components/group-creator/components/tab-badge/tab-badge.component';
import { GroupCreatorTabColorsComponent } from './components/group-creator/components/tab-colors/tab-colors.component';
import { GroupCreatorTabConfirmationComponent } from './components/group-creator/components/tab-confirmation/tab-confirmation.component';
import { GroupCreatorTabInfoComponent } from './components/group-creator/components/tab-info/tab-info.component';
import { GroupInfoComponent } from './components/group-info/group-info.component';
import { GroupManagerComponent } from './components/group-manager/components/main/group-manager.component';
import { GroupManagerTabInfoComponent } from './components/group-manager/components/tab-info/tab-info.component';
import { GroupManagerTabPreferencesComponent } from './components/group-manager/components/tab-preferences/tab-preferences.component';
import { GroupMembersComponent } from './components/group-members/group-members.component';
import { GroupMainComponent } from './components/main/main.component';
import { GroupRoomInfoComponent } from './components/room-info/room-info.component';
import { GroupsService } from './services/groups.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        GroupMainComponent,
        GroupInfoComponent,
        GroupMembersComponent,
        GroupRoomInfoComponent,
        GroupCreatorComponent,
        GroupCreatorImageSelectorComponent,
        GroupCreatorTabInfoComponent,
        GroupCreatorTabBadgeComponent,
        GroupCreatorTabColorsComponent,
        GroupCreatorTabConfirmationComponent,
        GroupManagerComponent,
        GroupManagerTabInfoComponent,
        GroupManagerTabPreferencesComponent
    ],
    providers: [
        GroupsService
    ],
    declarations: [
        GroupMainComponent,
        GroupInfoComponent,
        GroupMembersComponent,
        GroupRoomInfoComponent,
        GroupCreatorComponent,
        GroupCreatorImageSelectorComponent,
        GroupCreatorTabInfoComponent,
        GroupCreatorTabBadgeComponent,
        GroupCreatorTabColorsComponent,
        GroupCreatorTabConfirmationComponent,
        GroupManagerComponent,
        GroupManagerTabInfoComponent,
        GroupManagerTabPreferencesComponent
    ],
    entryComponents: [GroupCreatorComponent]
})
export class GroupsModule
{}
