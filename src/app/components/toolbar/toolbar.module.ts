import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ToolbarMainComponent } from './components/main/main.component';
import { MeMenuComponent } from './components/me-menu/me-menu.component';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        ToolbarMainComponent,
        MeMenuComponent
    ],
    providers: [
    ],
    declarations: [
        ToolbarMainComponent,
        MeMenuComponent
    ]
})
export class ToolbarModule
{}
