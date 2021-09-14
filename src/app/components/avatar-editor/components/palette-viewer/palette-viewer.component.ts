import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { AvatarEditorGridColorItem } from '../../common/AvatarEditorGridColorItem';
import { CategoryData } from '../../common/CategoryData';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';

@Component({
    selector: '[nitro-avatar-palette-viewer-component]',
    templateUrl: './palette-viewer.template.html'
})
export class AvatarEditorPaletteViewerComponent implements OnChanges
{
    @ViewChild(PerfectScrollbarComponent)
    public perfectScrollBar: PerfectScrollbarComponent;

    @Input()
    public model: IAvatarEditorCategoryModel = null;

    @Input()
    public category: CategoryData = null;

    @Input()
    public paletteSet: AvatarEditorGridColorItem[] = [];

    @Input()
    public paletteIndex: number = -1;

    @Input()
    public maxPaletteCount: number = 1;

    public ngOnChanges(changes: SimpleChanges): void
    {
        if(changes.category && this.perfectScrollBar) (this.perfectScrollBar.directiveRef && this.perfectScrollBar.directiveRef.scrollToTop());
    }

    public selectPalette(palette: AvatarEditorGridColorItem): void
    {
        if(!this.model || !this.category || !this.paletteSet || !palette) return;

        if(!palette || !this.model) return;

        const index = this.paletteSet.indexOf(palette);

        if(index === -1) return;

        this.model.selectColor(this.category.name, index, this.paletteIndex);
    }
}