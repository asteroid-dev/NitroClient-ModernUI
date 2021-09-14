import { NgModule } from '@angular/core';
import { ModToolMainComponent } from './components/main/main.component';
import { ModToolRoomComponent } from './components/room/room-tool/room-tool.component';
import { ModToolService } from './services/mod-tool.service';
import { ModToolUserComponent } from './components/user/user-tool/user-tool.component';
import { ModToolReportsComponent } from './components/reports-tool/reports-tool.component';
import { ModTool } from './components/tool.component';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';
import { ModToolUserInfoService } from './services/mod-tool-user-info.service';
import { ModToolModActionUserComponent } from './components/user/mod-action-user/component';
import { ModToolUserVisitedRoomsComponent } from './components/user/user-room-visits/component';
import { ModToolUserSendMessageComponent } from './components/user/user-send-message/component';
import { ModToolUserChatlogsComponent } from './components/user/user-chatlogs/component';
import { ModToolRoomChatlogsComponent } from './components/room/room-chatlogs/component';
import { ModToolChatlogsComponent } from './components/shared/chatlogs/component';

@NgModule({
    imports: [
        SharedModule,
        BrowserModule
    ],
    exports: [
        ModToolMainComponent,
        ModToolRoomComponent,
        ModToolRoomChatlogsComponent,
        ModToolUserComponent,
        ModToolReportsComponent,
        ModToolModActionUserComponent,
        ModToolUserVisitedRoomsComponent,
        ModToolUserSendMessageComponent,
        ModToolUserChatlogsComponent
    ],
    providers: [
        ModToolService,
        ModToolUserInfoService
    ],
    declarations: [
        ModToolMainComponent,
        ModToolRoomComponent,
        ModToolRoomChatlogsComponent,
        ModToolUserComponent,
        ModToolReportsComponent,
        ModTool,
        ModToolModActionUserComponent,
        ModToolUserVisitedRoomsComponent,
        ModToolUserSendMessageComponent,
        ModToolUserChatlogsComponent
    ]
})
export class ModToolModule
{}
