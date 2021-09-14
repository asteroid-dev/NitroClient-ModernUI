import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { CallForHelpService } from '../../services/call-for-help.service';

@Component({
    selector: 'nitro-call-for-help-main-component',
    templateUrl: './main.template.html'
})
export class CallForHelpMainComponent implements OnInit, OnDestroy
{
    constructor(
        private _callForHelpService: CallForHelpService,
        private _ngZone: NgZone)
    {}

    public ngOnInit(): void
    {
        this._callForHelpService.component = this;
    }

    public ngOnDestroy(): void
    {
        this._callForHelpService.component = null;
    }
}