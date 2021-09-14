import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { PurseMainComponent } from './components/main/main.component';
import { PurseService } from './services/purse.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        PurseMainComponent
    ],
    providers: [
        PurseService
    ],
    declarations: [
        PurseMainComponent
    ]
})
export class PurseModule
{}
