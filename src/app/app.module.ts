import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { CoreModule } from './core';
import { SecurityModule } from './security';
import { SharedModule } from './shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        CoreModule,
        SecurityModule,
        ComponentsModule,
        BrowserModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule
{}
