import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ConfigurationEvent, LegacyExternalInterface, Nitro, NitroCommunicationDemoEvent, NitroEvent, NitroLocalizationEvent, NitroVersion, RoomEngineEvent, WebGL } from '@nitrots/nitro-renderer';
import { SettingsService } from './core/settings/service';

@Component({
    selector: 'app-root',
    templateUrl: './app.template.html'
})
export class AppComponent implements OnInit, OnDestroy
{
    public message: string              = 'Getting Ready';
    public percentage: number           = 0;
    public hideProgress: boolean        = true;
    public isLocalizationReady: boolean = false;
    public isAvatarRenderReady: boolean = false;
    public isError: boolean             = false;

    private _connectionTimeout: ReturnType<typeof setTimeout>;

    private _isReady: boolean = false;

    constructor(
        private _settingsService: SettingsService,
        private _ngZone: NgZone)
    {
        window.console.log.apply(console, [
            '\n%c                                                          \n  ModernUI is a Version for Sale!                         \n  Please purchase ModernUI through CoreloGAMES only       \n  You can get detailed information by joining the server  \n                                                          \n  https://discord.gg/harDJW33fe                           \n                                                          \n  💖 Thank you Corelo 💖                                 \n                                                          \n',
            'color: #FFFFFF; background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%); padding:0px 0;' ]);

        this.onNitroEvent = this.onNitroEvent.bind(this);
    }
    
    public ngOnInit(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            //@ts-ignore
            if(!NitroConfig) throw new Error('NitroConfig is not defined!');

            if(!WebGL.isWebGLAvailable())
            {
                this.onNitroEvent(new NitroEvent(Nitro.WEBGL_UNAVAILABLE));

                return;
            }

            if(!Nitro.instance)
            {
                NitroVersion.UI_VERSION = '1.1.0';
                Nitro.bootstrap();
            }


            Nitro.instance.setWorker(new Worker(new URL('../app/core/nitro-worker', import.meta.url), { type: 'module' }));

            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroEvent);
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroEvent);
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroEvent);
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroEvent);
            Nitro.instance.events.addEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroEvent);
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.ENGINE_INITIALIZED, this.onNitroEvent);
            Nitro.instance.localization.events.addEventListener(NitroLocalizationEvent.LOADED, this.onNitroEvent);
            Nitro.instance.core.configuration.events.addEventListener(ConfigurationEvent.LOADED, this.onNitroEvent);
            Nitro.instance.core.configuration.events.addEventListener(ConfigurationEvent.FAILED, this.onNitroEvent);

            Nitro.instance.core.configuration.init();

            this._connectionTimeout = setTimeout(this.onConnectionTimeout, 15 * 1000);
        });
    }

    public ngOnDestroy(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING, this.onNitroEvent);
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED, this.onNitroEvent);
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED, this.onNitroEvent);
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_ERROR, this.onNitroEvent);
            Nitro.instance.events.removeEventListener(NitroCommunicationDemoEvent.CONNECTION_CLOSED, this.onNitroEvent);
            Nitro.instance.localization.events.removeEventListener(NitroLocalizationEvent.LOADED, this.onNitroEvent);
            Nitro.instance.core.configuration.events.removeEventListener(ConfigurationEvent.LOADED, this.onNitroEvent);
            Nitro.instance.core.configuration.events.removeEventListener(ConfigurationEvent.FAILED, this.onNitroEvent);

            clearTimeout(this._connectionTimeout);
        });
    }

    private getPreloadAssetUrls(): string[]
    {
        const urls: string[] = [];

        const assetUrls = Nitro.instance.getConfiguration<string[]>('preload.assets.urls');

        if(assetUrls && assetUrls.length)
        {
            for(const url of assetUrls)
            {
                urls.push(Nitro.instance.core.configuration.interpolate(url));
            }
        }

        return urls;
    }

    private onNitroEvent(event: NitroEvent): void
    {
        if(!event) return;

        switch(event.type)
        {
            case ConfigurationEvent.LOADED:
                Nitro.instance.localization.init();
                return;
            case ConfigurationEvent.FAILED:
                this._ngZone.run(() =>
                {
                    this.isError    = true;
                    this.message    = 'Configuration Failed';
                });
                return;
            case Nitro.WEBGL_UNAVAILABLE:
                this._ngZone.run(() =>
                {
                    this.isError    = true;
                    this.message    = 'WebGL Required';
                });
                return;
            case Nitro.WEBGL_CONTEXT_LOST:
                this._ngZone.run(() =>
                {
                    this.isError    = true;
                    this.message    = 'WebGL Context Lost - Reloading';
                });

                setTimeout(() => location.reload(), 1500);
                return;
            case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKING:
                clearTimeout(this._connectionTimeout);

                this._connectionTimeout = null;
                return;
            case NitroCommunicationDemoEvent.CONNECTION_HANDSHAKE_FAILED:
                this._ngZone.run(() =>
                {
                    this.isError    = true;
                    this.message    = 'Handshake Failed';
                });
                return;
            case NitroCommunicationDemoEvent.CONNECTION_AUTHENTICATED:
                this._ngZone.run(() =>
                {
                    this.message = 'Finishing Up';
                });

                Nitro.instance.init();

                clearTimeout(this._connectionTimeout);

                this._connectionTimeout = null;
                return;
            case NitroCommunicationDemoEvent.CONNECTION_ERROR:
                this._ngZone.run(() =>
                {
                    this.isError    = true;
                    this.message    = 'Connection Error';
                });
                return;
            case NitroCommunicationDemoEvent.CONNECTION_CLOSED:
                if(Nitro.instance.roomEngine) Nitro.instance.roomEngine.dispose();

                this._ngZone.run(() =>
                {
                    this.isError    = true;
                    this.message    = 'Connection Closed';
                });

                LegacyExternalInterface.call('disconnect', -1, 'client.init.handshake.fail');
                return;
            case RoomEngineEvent.ENGINE_INITIALIZED:
                this._ngZone.run(() => (this._isReady = true));
                return;
            case NitroLocalizationEvent.LOADED:
                Nitro.instance.core.asset.downloadAssets(this.getPreloadAssetUrls(), (status: boolean) =>
                {
                    if(status)
                    {
                        this._ngZone.run(() =>
                        {
                            this.message = 'Connecting';
                        });

                        Nitro.instance.communication.init();
                    }
                    else
                    {
                        this._ngZone.run(() =>
                        {
                            this.isError    = true;
                            this.message    = 'Assets Failed';
                        });
                    }
                });
                return;
        }
    }

    /**
     * On Flash, if an origin TCP socket is unreachable (e.g. the server is down)
     * the initial crossdomain security check fails due to a timeout. This timeout
     * simulates the failing crossdomain security check.
     */
    private onConnectionTimeout(): void
    {
        LegacyExternalInterface.call('logDebug', 'TcpAuth control socket security error');
    }


    public get isReady(): boolean
    {
        return this._isReady;
    }
}
