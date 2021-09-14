import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AvatarEditorMainComponent } from './components/main/main.component';
import { AvatarEditorModelViewerComponent } from './components/model-viewer/model-viewer.component';
import { AvatarEditorPaletteViewerComponent } from './components/palette-viewer/palette-viewer.component';
import { AvatarEditorSetViewerComponent } from './components/set-viewer/set-viewer.component';
import { AvatarEditorWardrobeComponent } from './components/wardrobe/wardrobe.component';
import { AvatarEditorService } from './services/avatar-editor.service';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        AvatarEditorMainComponent,
        AvatarEditorModelViewerComponent,
        AvatarEditorPaletteViewerComponent,
        AvatarEditorSetViewerComponent,
        AvatarEditorWardrobeComponent
    ],
    providers: [
        AvatarEditorService
    ],
    declarations: [
        AvatarEditorMainComponent,
        AvatarEditorModelViewerComponent,
        AvatarEditorPaletteViewerComponent,
        AvatarEditorSetViewerComponent,
        AvatarEditorWardrobeComponent
    ]
})
export class AvatarEditorModule
{}
