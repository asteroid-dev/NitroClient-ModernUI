import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HotelViewComponent } from './components/main/hotelview.component';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        HotelViewComponent
    ],
    declarations: [
        HotelViewComponent
    ]
})
export class HotelViewModule
{}
