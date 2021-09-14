import { SettingsService } from '../../core/settings/service';
import { FriendListService } from '../friendlist/services/friendlist.service';
import { NotificationService } from '../notification/services/notification.service';
import { WiredService } from '../wired/services/wired.service';
import { IRoomWidgetHandlerContainer } from './widgets/IRoomWidgetHandlerContainer';

export interface IRoomWidgetManager extends IRoomWidgetHandlerContainer
{
    notificationService: NotificationService;
    wiredService: WiredService;
    friendService: FriendListService;
    settingsService: SettingsService;
}
