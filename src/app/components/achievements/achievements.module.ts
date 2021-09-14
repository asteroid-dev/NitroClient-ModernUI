import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AchievementsCategoryListComponent } from './components/category-list/category-list.component';
import { AchievementsCategoryComponent } from './components/category/category.component';
import { AchievementsMainComponent } from './components/main/main.component';
import { AchievementsService } from './services/achievements.service';


@NgModule({
    imports: [
        SharedModule
    ],
    exports: [
        AchievementsMainComponent,
        AchievementsCategoryComponent,
        AchievementsCategoryListComponent
    ],
    providers: [
        AchievementsService
    ],
    declarations: [
        AchievementsMainComponent,
        AchievementsCategoryComponent,
        AchievementsCategoryListComponent
    ]
})
export class AchievementsModule
{}
