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
    maxCount = 0;

    /**
     * 选中显示形式
     * checked items show text
     * @type {boolean}
     */
    isShowTotal = true;

    /**
     * showtype
     * @type {string}: label, tag
     */
    showtype?: string = 'label';

    dropWidth?: string = '100%';
}
