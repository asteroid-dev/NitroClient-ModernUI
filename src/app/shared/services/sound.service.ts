import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AdvancedMap, Nitro, NitroSettingsEvent, RoomEngineEvent, RoomEngineObjectEvent, RoomEngineSamplePlaybackEvent } from '@nitrots/nitro-renderer';

@Injectable()
export class SoundService implements OnDestroy
{
    private _volumeSystem: number;
    private _volumeFurni: number;
    private _volumeTrax: number;

    private _internalSamples: AdvancedMap<string, HTMLAudioElement>;
    private _externalSamples: AdvancedMap<number, HTMLAudioElement>;

    private _furniSoundObjects: AdvancedMap<number, HTMLAudioElement>;

    constructor(
        private _ngZone: NgZone)
    {
        this._volumeSystem                      = 0;
        this._volumeFurni                       = 0;
        this._volumeTrax                        = 0;

        this._internalSamples                   = new AdvancedMap();
        this._externalSamples                   = new AdvancedMap();

        this._furniSoundObjects                 = new AdvancedMap();

        this.onRoomEngineSamplePlaybackEvent    = this.onRoomEngineSamplePlaybackEvent.bind(this);
        this.onRoomEngineObjectRemovedEvent     = this.onRoomEngineObjectRemovedEvent.bind(this);
        this.onRoomEngineDisposedEvent          = this.onRoomEngineDisposedEvent.bind(this);
        this.onNitroSettingsEvent               = this.onNitroSettingsEvent.bind(this);

        this.registerMessages();
    }

    public ngOnDestroy(): void
    {
        this.unregisterMessages();
    }

    private registerMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineSamplePlaybackEvent.PLAY_SAMPLE, this.onRoomEngineSamplePlaybackEvent);
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectRemovedEvent);
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineDisposedEvent);
            Nitro.instance.events.addEventListener(NitroSettingsEvent.SETTINGS_UPDATED, this.onNitroSettingsEvent);
        });
    }

    private unregisterMessages(): void
    {
        this._ngZone.runOutsideAngular(() =>
        {
            Nitro.instance.roomEngine.events.removeEventListener(RoomEngineSamplePlaybackEvent.PLAY_SAMPLE, this.onRoomEngineSamplePlaybackEvent);
            Nitro.instance.roomEngine.events.removeEventListener(RoomEngineObjectEvent.REMOVED, this.onRoomEngineObjectRemovedEvent);
            Nitro.instance.roomEngine.events.addEventListener(RoomEngineEvent.DISPOSED, this.onRoomEngineDisposedEvent);
            Nitro.instance.events.removeEventListener(NitroSettingsEvent.SETTINGS_UPDATED, this.onNitroSettingsEvent);
        });
    }

    private onRoomEngineSamplePlaybackEvent(event: RoomEngineSamplePlaybackEvent): void
    {
        if(!event) return;

        this.playFurniSample(event.objectId, event.sampleId, this._volumeFurni, event.pitch);
    }

    private onRoomEngineObjectRemovedEvent(event: RoomEngineObjectEvent): void
    {
        if(!event) return;

        this.killFurniAudio(event.objectId);
    }

    private onRoomEngineDisposedEvent(event: RoomEngineEvent): void
    {
        if(!event) return;

        this._furniSoundObjects.getKeys().forEach((objectId) =>
        {
            this.killFurniAudio(objectId);
        });
    }

    private onNitroSettingsEvent(event: NitroSettingsEvent): void
    {
        if(!event) return;

        const volumeFurniUpdated = event.volumeFurni !== this._volumeFurni;

        this._volumeSystem  = event.volumeSystem;
        this._volumeFurni   = event.volumeFurni;
        this._volumeTrax    = event.volumeTrax;

        if(volumeFurniUpdated) this.updateFurniSoundObjectsVolume();
    }

    public playInternalSample(sampleId: string): void
    {
        if(!this._internalSamples.hasKey(sampleId))
        {
            this._internalSamples.add(sampleId, new Audio('assets/sounds/' + sampleId + '.mp3'));
        }

        const audio = this.generateAudio(this._internalSamples.getValue(sampleId), this._volumeSystem);
        audio.play();
    }

    private playFurniSample(objectId: number, sampleId: number, volume: number, pitch: number = 1): void
    {
        if(!this._externalSamples.hasKey(sampleId))
        {
            const samplesUrl = Nitro.instance.getConfiguration<string>('external.samples.url');

            this._externalSamples.add(sampleId, new Audio(samplesUrl.replace('%sample%', sampleId.toString())));
        }

        this.killFurniAudio(objectId);

        const audio = this.generateAudio(this._externalSamples.getValue(sampleId), volume, pitch);
        this._furniSoundObjects.add(objectId, audio);

        audio.play();
    }

    private generateAudio(audio: HTMLAudioElement, volume: number, pitch: number = 1): HTMLAudioElement
    {
        const clonedAudio = <HTMLAudioElement>audio.cloneNode();
        clonedAudio.volume = volume;

        return clonedAudio;
    }

    private killFurniAudio(objectId: number): void
    {
        if(this._furniSoundObjects.hasKey(objectId))
        {
            this._furniSoundObjects.getValue(objectId).pause();
            this._furniSoundObjects.remove(objectId);
        }
    }

    private updateFurniSoundObjectsVolume(): void
    {
        this._furniSoundObjects.getKeys().forEach((objectId) =>
        {
            this._furniSoundObjects.getValue(objectId).volume = this._volumeFurni;
        });
    }
}
