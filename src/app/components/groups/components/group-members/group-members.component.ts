import { Component, NgZone } from '@angular/core';
import { GroupMemberParser, GroupRemoveMemberComposer, Nitro } from '@nitrots/nitro-renderer';
import { NotificationChoice } from '../../../notification/components/choices/choices.component';
import { GroupsService } from '../../services/groups.service';

@Component({
    selector: 'nitro-group-members-component',
    templateUrl: './group-members.template.html'
})
export class GroupMembersComponent
{
    private _groupId: number;
    private _groupName: string;
    private _groupBadgeCode: string;
    private _totalMembersCount: number;
    private _result: GroupMemberParser[];
    private _admin: boolean;
    private _pageSize: number;
    private _pageIndex: number;

    public level: string;
    public query: string;

    constructor(
        private _ngZone: NgZone,
        private _groupService: GroupsService)
    {
        this._groupService.groupMembersComponent = this;

        this.clear();
    }

    public clear(): void
    {
        this._ngZone.run(() =>
        {
            this._groupId           = 0;
            this._groupName         = null;
            this._groupBadgeCode    = null;
            this._totalMembersCount = 0;
            this._result            = [];
            this._admin             = false;
            this._pageSize          = 1;
            this._pageIndex         = 0;
            this.level              = '0';
            this.query              = null;
        });
    }

    public getMembers(): void
    {
        this._groupService.getMembers(this._groupId, this._pageIndex, this.query, parseInt(this.level));
    }

    public searchMembers(): void
    {
        this._ngZone.run(() =>
        {
            this._pageSize          = 1;
            this._pageIndex         = 0;
            this._totalMembersCount = 0;
        });

        this.getMembers();
    }

    public nextPage(): void
    {
        if(this._pageIndex + 1 === this.totalPages) return;

        this._pageIndex++;
        this.getMembers();
    }

    public previousPage(): void
    {
        if(this._pageIndex === 0) return;

        this._pageIndex--;
        this.getMembers();
    }

    public giveAdmin(userId: number): void
    {
        if(!this._groupId || !this._admin) return;

        this._groupService.giveAdmin(this._groupId, userId);
        this.getMembers();
    }

    public takeAdmin(userId: number): void
    {
        if(!this._groupId || !this._admin) return;

        this._groupService.takeAdmin(this._groupId, userId);
        this.getMembers();
    }

    public acceptMembership(userId: number): void
    {
        if(!this._groupId || !this._admin) return;

        this._groupService.acceptMembership(this._groupId, userId);
        this.getMembers();
    }

    public removeOrDeclineMember(userId: number, rank: number): void
    {
        if(!this._groupId || !this._admin) return;

        if(rank === 3)
        {
            this._groupService.declineMembership(this._groupId, userId);
        }
        else
        {
            this._groupService.removeMember(this._groupId, userId);
            this.getMembers();
        }
    }

    public confirmRemove(userId: number, furnitureCount: number): [string, string, NotificationChoice[]]
    {
        const title = Nitro.instance.localization.getValue('group.kickconfirm.title');

        let message = null;

        if(furnitureCount)
        {
            message = Nitro.instance.localization.getValueWithParameters('group.kickconfirm.desc', ['user', 'amount'], ['<b>' + userId + '</b>', '<b>' + furnitureCount + '</b>']);
        }
        else
        {
            message = Nitro.instance.localization.getValueWithParameter('group.kickconfirm_nofurni.desc', 'user', '<b>' + userId + '</b>');
        }

        const choices = [
            new NotificationChoice('group.kickconfirm.title', () =>
            {
                Nitro.instance.communication.connection.send(new GroupRemoveMemberComposer(this.groupId, userId));
                this.getMembers();
            }, ['btn-danger']),
            new NotificationChoice('generic.close', () =>
            {}, ['btn-primary'])
        ];

        return [title, message, choices];
    }

    public openProfile(userId: number): void
    {
        this._groupService.openProfile(userId);
    }

    public getRankIcon(rank: number): string
    {
        if(rank === 0) return 'gown-ico sahip';
        else if(rank === 1) return 'gstar-ico sahip';
        else return 'gstar_o-ico';
    }

    public get visible(): boolean
    {
        return (this._groupId > 0);
    }

    public get groupId(): number
    {
        return this._groupId;
    }

    public set groupId(id: number)
    {
        this._groupId = id;
    }

    public get groupName(): string
    {
        return this._groupName;
    }

    public set groupName(name: string)
    {
        this._groupName = name;
    }

    public get groupBadgeCode(): string
    {
        return this._groupBadgeCode;
    }

    public set groupBadgeCode(badgeCode: string)
    {
        this._groupBadgeCode = badgeCode;
    }

    public get totalMembersCount(): number
    {
        return this._totalMembersCount;
    }

    public set totalMembersCount(totalMembersCount: number)
    {
        this._totalMembersCount = totalMembersCount;
    }

    public get result(): GroupMemberParser[]
    {
        return this._result;
    }

    public set result(result: GroupMemberParser[])
    {
        this._result = result;
    }

    public get admin(): boolean
    {
        return this._admin;
    }

    public set admin(admin: boolean)
    {
        this._admin = admin;
    }

    public get pageSize(): number
    {
        return this._pageSize;
    }

    public set pageSize(pageSize: number)
    {
        this._pageSize = pageSize;
    }

    public get pageIndex(): number
    {
        return this._pageIndex;
    }

    public set pageIndex(pageIndex: number)
    {
        this._pageIndex = pageIndex;
    }

    public get totalPages(): number
    {
        return Math.ceil(this._totalMembersCount / this._pageSize);
    }

    public get myId(): number
    {
        return Nitro.instance.sessionDataManager.userId;
    }
}
