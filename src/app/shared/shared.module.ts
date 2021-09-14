import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDropdownModule, NgbModalModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ColorChromeModule } from 'ngx-color/chrome';
import { NgxPaginationModule } from 'ngx-pagination';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { ToastrModule } from 'ngx-toastr';
import { AvatarImageComponent } from './components/avatarimage/component';
import { BadgeComponent } from './components/badge/component';
import { CurrencyIconComponent } from './components/currency-icon/currency-icon.component';
import { FurnitureImageComponent } from './components/furniture-image/furniture-image.component';
import { RoomPreviewComponent } from './components/room-preview/room-preview.component';
import { AvatarImageDirective } from './directives/avatar-image/avatar-image.directive';
import { BadgeImageDirective } from './directives/badge-image/badge-image.directive';
import { BringToTopDirective } from './directives/bringtotop/directive';
import { DraggableDirective } from './directives/draggable/draggable.directive';
import { ImagePlaceholderDirective } from './directives/image-placeholder/image-placeholder.directive';
import { PetImageDirective } from './directives/pet-image/pet-image.directive';
import { EmojiPipe } from './pipes/emoji.pipe';
import { FormatShortPipe } from './pipes/format-short.pipe';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import { RoomChatFormatterPipe } from './pipes/room-chat-formatter.pipe';
import { RoomObjectItemSearchPipe } from './pipes/room-object-item-search.pipe';
import { ShortNumberPipe } from './pipes/short-number';
import { TimeAgoPipe } from './pipes/time-ago';
import { TranslatePipe } from './pipes/translate';
import { UniqueNumberPipe } from './pipes/unique-number';
import { SoundService } from './services/sound.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        NgbDropdownModule,
        NgbTooltipModule,
        NgbModalModule,
        NgxPaginationModule,
        NgxSliderModule,
        PerfectScrollbarModule,
        MDBBootstrapModule.forRoot(),
        ColorChromeModule,
        NgbModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        NgbDropdownModule,
        NgbTooltipModule,
        NgbModalModule,
        NgxPaginationModule,
        NgxSliderModule,
        PerfectScrollbarModule,
        MDBBootstrapModule,
        ColorChromeModule,
        AvatarImageComponent,
        BadgeComponent,
        CurrencyIconComponent,
        FurnitureImageComponent,
        RoomPreviewComponent,
        AvatarImageDirective,
        BadgeImageDirective,
        DraggableDirective,
        BringToTopDirective,
        ImagePlaceholderDirective,
        PetImageDirective,
        EmojiPipe,
        EscapeHtmlPipe,
        TranslatePipe,
        FormatShortPipe,
        ShortNumberPipe,
        TimeAgoPipe,
        RoomObjectItemSearchPipe,
        UniqueNumberPipe,
        RoomChatFormatterPipe,
        NgbModule,
        BrowserModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        SoundService,
        EmojiPipe
    ],
    declarations: [
        AvatarImageComponent,
        BadgeComponent,
        CurrencyIconComponent,
        FurnitureImageComponent,
        RoomPreviewComponent,
        AvatarImageDirective,
        BadgeImageDirective,
        DraggableDirective,
        BringToTopDirective,
        ImagePlaceholderDirective,
        PetImageDirective,
        EmojiPipe,
        EscapeHtmlPipe,
        TranslatePipe,
        FormatShortPipe,
        ShortNumberPipe,
        TimeAgoPipe,
        RoomObjectItemSearchPipe,
        UniqueNumberPipe,
        RoomChatFormatterPipe
    ]
})
export class SharedModule
{}
