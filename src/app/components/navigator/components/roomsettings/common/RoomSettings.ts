import { NgZone } from '@angular/core';

export default class RoomSettings
{

    public roomName: string;
    public roomDescription: string;
    public categoryId: string;
    public userCount: string;
    public tags: string[];
    public tradeState: string;
    public allowWalkthrough: boolean;

    public lockState: string;
    public password: string;
    public confirmPassword: string;
    public allowPets: boolean;
    public allowPetsEat: boolean;

    public usersWithRights: Map<number, string>;
    public friendsWithoutRights: Map<number, string>;

    public hideWalls: boolean;
    public wallThickness: string;
    public floorThickness: string;
    public chatBubbleMode: string;
    public chatBubbleWeight: string;
    public chatBubbleSpeed: string;
    public chatFloodProtection: string;
    public chatDistance: number;

    public muteState: string;
    public kickState: string;
    public banState: string;
    public bannedUsers: Map<number, string>;
    public selectedUserToUnban: number;

    constructor(private _ngZone: NgZone)
    {
        this.roomName               = null;
        this.roomDescription        = null;
        this.categoryId             = '0';
        this.userCount              = '0';
        this.tags                   = [];
        this.tradeState             = '0';
        this.allowWalkthrough       = false;

        this.lockState              = '0';
        this.password               = null;
        this.confirmPassword        = null;
        this.allowPets              = false;
        this.allowPetsEat           = false;

        this.usersWithRights       = new Map<number, string>();
        this.friendsWithoutRights  = new Map<number, string>();

        this.hideWalls              = false;
        this.wallThickness          = '0';
        this.floorThickness         = '0';
        this.chatBubbleMode         = '0';
        this.chatBubbleWeight       = '0';
        this.chatBubbleSpeed        = '0';
        this.chatFloodProtection    = '0';
        this.chatDistance           = 0;

        this.muteState              = '0';
        this.kickState              = '0';
        this.banState               = '0';
        this.bannedUsers           = new Map<number, string>();
        this.selectedUserToUnban   = 0;
    }

    public selectUserToUnban(userId: number): void
    {
        this._ngZone.run(() =>
        {
            if(this.selectedUserToUnban === userId)
            {
                this.selectedUserToUnban = 0;
            }
            else
            {
                this.selectedUserToUnban = userId;
            }
        });
    }

    public get isValidPassword(): boolean
    {
        if(this.lockState !== '2')
            return true;

        return this.password && this.password.length > 0 && this.password === this.confirmPassword;
    }

    public get selectedUsernameToUnban(): string
    {
        if(this.selectedUserToUnban > 0)
            return this.bannedUsers.get(this.selectedUserToUnban);

        return null;
    }
}