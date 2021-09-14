import { AdvancedMap } from '@nitrots/nitro-renderer';
import { InventoryService } from '../../inventory/services/inventory.service';
import { AvatarEditorMainComponent } from '../components/main/main.component';
import { AvatarEditorModelViewerComponent } from '../components/model-viewer/model-viewer.component';
import { CategoryData } from './CategoryData';

export interface IAvatarEditorCategoryModel
{
    init(): void;
    dispose(): void;
    reset(): void;
    controller: AvatarEditorMainComponent;
    setViewer(viewer: AvatarEditorModelViewerComponent): void;
    getCategoryData(_arg_1: string): CategoryData;
    selectPart(_arg_1: string, _arg_2: number): void;
    selectColor(_arg_1: string, _arg_2: number, _arg_3: number): void;
    hasClubSelectionsOverLevel(_arg_1: number): boolean;
    hasInvalidSelectedItems(_arg_1: InventoryService): boolean;
    _Str_15298(_arg_1: number): boolean;
    _Str_8360(): boolean;
    categories: AdvancedMap<string, CategoryData>;
    canSetGender: boolean;
    maxPaletteCount: number;
    name: string;
}
