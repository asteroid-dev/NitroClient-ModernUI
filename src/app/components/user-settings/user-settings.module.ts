import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserSettingsComponent } from './component/user-settings.component';
import { UserSettingsService } from './services/user-settings.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        UserSettingsComponent
    ],
    providers: [
        UserSettingsService
    ],
    declarations: [
        UserSettingsComponent
    ]
})
export class UserSettingsModule
{}
