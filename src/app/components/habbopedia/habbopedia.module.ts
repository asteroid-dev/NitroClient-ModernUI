import { NgModule } from '@angular/core';
import { HabbopediaMainComponent } from './components/main/main.component';
import { HabbopediaPageComponent } from './components/page/page.component';
import { HabbopediaService } from './services/habbopedia.service';

@NgModule({
    imports: [
    ],
    exports: [
        HabbopediaMainComponent,
        HabbopediaPageComponent
    ],
    providers: [
        HabbopediaService
    ],
    declarations: [
        HabbopediaMainComponent,
        HabbopediaPageComponent
    ]
})
export class HabbopediaModule
{}