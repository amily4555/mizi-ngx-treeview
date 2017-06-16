import * as _ from 'lodash';

export interface TreeItem {
    text: string;
    displayText?: string;
    value: any;
    disabled?: boolean;
    checked?: boolean;
    selected?: boolean;
    collapsed?: boolean;
    hidden?: boolean;
    children?: TreeItem[];
}

export class TreeviewItem {
    private internalDisabled = false;
    private internalChecked = true;
    private internalSelected = false;
    private internalCollapsed = false;
    private internalHidden = false;
    private internalChildren: TreeviewItem[];
    text: string;
    value: any;
    displayText: string;

    constructor(item: TreeItem, autoCorrectChecked = false) {
        if (_.isNil(item)) {
            throw new Error('Item must be defined');
        }
        if (_.isString(item.text)) {
            this.text = item.text;
        } else {
            throw new Error('A text of item must be string object');
        }
        this.value = item.value;
        this.displayText = item.displayText;

        if (_.isBoolean(item.disabled)) {
            this.disabled = item.disabled;
        }
        if (_.isBoolean(item.checked)) {
            this.checked = item.checked;
        }
        if (_.isBoolean(item.collapsed)) {
            this.collapsed = item.collapsed;
        }
        if (_.isBoolean(item.selected)) {
            this.selected = item.selected;
        }

        // if (this.disabled === true && this.checked === false) {
        //     throw new Error('A disabled item must be checked');
        // }

        if (!_.isNil(item.children)) {
            this.children = item.children.map(child => {
                // if (this.disabled === true) {
                //     child.disabled = true;
                // }
                if (this.selected === true) {
                    child.selected = true;
                }
                return new TreeviewItem(child);
            });
        }

        if (autoCorrectChecked) {
            this.correctChecked();
        }
    }

    get checked(): boolean {
        return this.internalChecked;
    }

    set checked(value: boolean) {
        if (_.isBoolean(value) && this.internalChecked !== value) {
            // if (!this.internalDisabled) {
                this.internalChecked = value;
            // }
        }
    }

    get hidden(): boolean {
        return this.internalHidden;
    }

    set hidden(value: boolean) {
        if (_.isBoolean(value) && this.internalHidden !== value) {
            // if (!this.internalDisabled) {
            this.internalHidden = value;
            // }
        }
    }

    get selected(): boolean {
        return this.internalSelected;
    }

    set selected(value: boolean) {
        if (_.isBoolean(value) && this.internalSelected !== value) {
            this.internalSelected = value;
        }
    }

    setCheckedRecursive(value: boolean) {
        if (_.isBoolean(value)) {
            if (!this.internalDisabled) {
                this.internalChecked = value;
            }

            if (!_.isNil(this.internalChildren)) {
                this.internalChildren.forEach(child => child.setCheckedRecursive(value));
            }
        }
    }

    setSelectedRecursive(value: boolean) {
        if (_.isBoolean(value)) {
            if (!this.internalChecked) {
                this.internalSelected = value;
                if (!_.isNil(this.internalChildren)) {
                    this.internalChildren.forEach(child => child.setSelectedRecursive(value));
                }
            }
        }
    }

    get disabled(): boolean {
        return this.internalDisabled;
    }

    set disabled(value: boolean) {
        if (_.isBoolean(value) && this.internalDisabled !== value) {
            this.internalDisabled = value;
            // if (!_.isNil(this.internalChildren)) {
            //     this.internalChildren.forEach(child => child.disabled = value);
            // }
        }
    }

    get collapsed(): boolean {
        return this.internalCollapsed;
    }

    set collapsed(collapsed: boolean) {
        if (_.isBoolean(collapsed) && this.internalCollapsed !== collapsed) {
            this.internalCollapsed = collapsed;
        }
    }

    setCollapsedRecursive(value: boolean) {
        if (_.isBoolean(value)) {
            this.internalCollapsed = value;
            if (!_.isNil(this.internalChildren)) {
                this.internalChildren.forEach(child => child.setCollapsedRecursive(value));
            }
        }
    }

    get children(): TreeviewItem[] {
        return this.internalChildren;
    }

    set children(value: TreeviewItem[]) {
        if (this.internalChildren !== value) {
            if (_.isArray(value) && value.length === 0) {
                throw new Error('Children must be not an empty array');
            }
            this.internalChildren = value;
            if (!_.isNil(this.internalChildren)) {
                let checked = false;
                this.internalChildren.forEach(child => {
                    if (child.checked === false) {
                        checked = false;
                    }
                });
                this.internalChecked = checked;
            }
        }
    }

    getCheckedItems(maxCount: number): any {
        let checkedItems: TreeviewItem[] = [];
        let allItems: TreeviewItem[] = [];

        if (_.isNil(this.internalChildren)) {
            this.selected = false;
            allItems.push(this);

            if (this.internalChecked) {
                checkedItems.push(this);
            }
        } else {
            // maxCount 不为0或空, 则非根节点为disable 不可选择, 必须为展开
            if(maxCount){
                this.disabled = true;
                this.collapsed = false;
                this.hidden = true;
            }

            const childCount = this.internalChildren.length;
            for (let i = 0; i < childCount; i++) {
                let item = this.internalChildren[i];
                checkedItems = _.concat(checkedItems, item.getCheckedItems(maxCount).checkedItems);
                allItems = _.concat(allItems, item.getCheckedItems(maxCount).allItems);
            }
        }

        return {checkedItems, allItems};
    }

    correctChecked() {
        this.internalChecked = this.getCorrectChecked();
    }

    private getCorrectChecked(): boolean {
        let checked = this.checked;
        if (!_.isNil(this.internalChildren)) {
            checked = true;
            const childCount = this.internalChildren.length;
            for (let i = 0; i < childCount; i++) {
                const child = this.internalChildren[i];
                child.internalChecked = child.getCorrectChecked();
                if (!child.internalChecked) {
                    checked = false;
                    break;
                }
            }
        }

        return checked;
    }
}
