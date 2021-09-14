import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupBadgePart } from '@nitrots/nitro-renderer';

@Component({
    selector: '[nitro-group-image-selector-component]',
    templateUrl: './image-selector.template.html'
})
export class GroupCreatorImageSelectorComponent
{
    @Input()
    public items: Map<number, string[]>;

    @Input()
    public part: GroupBadgePart;

    @Output()
    onSelect: EventEmitter<any> = new EventEmitter();

    public getBadgeCode(id: number): string
    {
        return ((this.part.isBase ? 'b' : 's') + (id < 100 ? '0' : '') + (id < 10 ? '0' : '') + id + (this.part.color < 10 ? '0' + this.part.color : this.part.color) + 4);
    }

    public selectPart(id: number): void
    {
        this.onSelect.emit(id);
    }
}
