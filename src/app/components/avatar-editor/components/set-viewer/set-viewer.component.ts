import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { AvatarEditorGridPartItem } from '../../common/AvatarEditorGridPartItem';
import { CategoryData } from '../../common/CategoryData';
import { IAvatarEditorCategoryModel } from '../../common/IAvatarEditorCategoryModel';

@Component({
    selector: '[nitro-avatar-set-viewer-component]',
    templateUrl: './set-viewer.template.html'
})
export class AvatarEditorSetViewerComponent implements OnChanges
{
    @ViewChild(PerfectScrollbarComponent)
    public perfectScrollBar: PerfectScrollbarComponent;

    @Input()
    public model: IAvatarEditorCategoryModel = null;

    @Input()
    public category: CategoryData = null;

    @Input()
    public partSet: AvatarEditorGridPartItem[] = [];

    public ngOnChanges(changes: SimpleChanges): void
    {
        if(changes.category && this.perfectScrollBar) (this.perfectScrollBar.directiveRef && this.perfectScrollBar.directiveRef.scrollToTop());
    }

    public selectPart(part: AvatarEditorGridPartItem): void
    {
        if(!this.model || !this.category || !this.partSet || !part) return;

        const index = this.partSet.indexOf(part);

        if(index === -1) return;

        this.model.selectPart(this.category.name, index);
    }
}