import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UserProfileComponent } from './component/user-profile.component';
import { UserProfileService } from './services/user-profile.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        UserProfileComponent
    ],
    providers: [
        UserProfileService
    ],
    declarations: [
        UserProfileComponent
    ]
})
export class UserProfileModule
{}
