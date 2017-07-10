import {Injectable} from '@angular/core';

@Injectable()
export class TreeviewConfig {
    isShowAllCheckBox = true;
    isShowFilter = false;
    isShowCollapseExpand = false;
    maxHeight = 500;

    /**
     * 限制选择个数
     * limit checked count
     * @type {number}
     */
    maxCount: number = 0;

    /**
     * 显示区域显示个数
     * @type {number}
     */
    selectedCount?: number = 0;
    selectedText?: string = '{0} OPTIONS SELECTED';

    /**
     * 选中显示形式
     * checked items show text
     * @type {boolean}
     */
    isShowTotal?: boolean = true;

    /**
     * showtype
     * @type {string}: label, tag
     */
    showtype?: string = 'label';

    dropWidth?: string = '100%';

    emptyText?: string = 'SELECT OPTIONS...';
}
