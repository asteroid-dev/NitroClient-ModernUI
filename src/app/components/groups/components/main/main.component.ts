import { Component } from '@angular/core';

@Component({
    selector: 'nitro-group-main-component',
    template: `
        <nitro-group-info-component></nitro-group-info-component>
        <nitro-group-members-component></nitro-group-members-component>
        <nitro-group-manager-component></nitro-group-manager-component>
    `
})
export class GroupMainComponent
{}
