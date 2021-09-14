import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NavigatorCreatorComponent } from './components/creator/creator.component';
import { NavigatorDoorbellComponent } from './components/doorbell/doorbell.component';
import { NavigatorMainComponent } from './components/main/main.component';
import { NavigatorPasswordComponent } from './components/password/password.component';
import { NavigatorRoomInfoComponent } from './components/room-info/room-info.component';
import { NavigatorRoomSettingsTabAccessComponent } from './components/roomsettings/components/tab-access/roomsettings-tab-access.component';
import { NavigatorRoomSettingsTabBasicComponent } from './components/roomsettings/components/tab-basic/roomsettings-tab-basic.component';
import { NavigatorRoomSettingsTabModComponent } from './components/roomsettings/components/tab-mod/roomsettings-tab-mod.component';
import { NavigatorRoomSettingsTabRightsComponent } from './components/roomsettings/components/tab-rights/roomsettings-tab-rights.component';
import { NavigatorRoomSettingsTabVipChatComponent } from './components/roomsettings/components/tab-vipchat/roomsettings-tab-vipchat.component';
import { NavigatorRoomSettingsComponent } from './components/roomsettings/roomsettings.component';
import { NavigatorSearchComponent } from './components/search/search.component';
import { NavigatorSearchItemComponent } from './components/searchitem/searchitem.component';
import { NavigatorSearchResultComponent } from './components/searchresult/searchresult.component';
import { NavigatorSliderComponent } from './components/slider/slider.component';
import { NavigatorService } from './services/navigator.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        NavigatorCreatorComponent,
        NavigatorDoorbellComponent,
        NavigatorMainComponent,
        NavigatorPasswordComponent,
        NavigatorRoomInfoComponent,
        NavigatorSearchComponent,
        NavigatorSearchItemComponent,
        NavigatorSearchResultComponent,
        NavigatorSliderComponent,
        NavigatorRoomSettingsComponent,
        NavigatorRoomSettingsTabBasicComponent,
        NavigatorRoomSettingsTabAccessComponent,
        NavigatorRoomSettingsTabRightsComponent,
        NavigatorRoomSettingsTabVipChatComponent,
        NavigatorRoomSettingsTabModComponent
    ],
    providers: [
        NavigatorService
    ],
    declarations: [
        NavigatorCreatorComponent,
        NavigatorDoorbellComponent,
        NavigatorMainComponent,
        NavigatorPasswordComponent,
        NavigatorRoomInfoComponent,
        NavigatorSearchComponent,
        NavigatorSearchItemComponent,
        NavigatorSearchResultComponent,
        NavigatorSliderComponent,
        NavigatorRoomSettingsComponent,
        NavigatorRoomSettingsTabBasicComponent,
        NavigatorRoomSettingsTabAccessComponent,
        NavigatorRoomSettingsTabRightsComponent,
        NavigatorRoomSettingsTabVipChatComponent,
        NavigatorRoomSettingsTabModComponent
    ],
    entryComponents: [ NavigatorCreatorComponent, NavigatorDoorbellComponent, NavigatorPasswordComponent ]
})
export class NavigatorModule
{}
