import {Component, EventEmitter, Input, Output, TemplateRef, OnChanges, SimpleChanges} from '@angular/core';
import * as _ from 'lodash';
import { TreeviewItem } from './treeview-item';
import { TreeviewItemTemplateContext } from './treeview-item-template-context';

import * as mu from 'mzmu';
declare var mu;

@Component({
    selector: 'ngx-treeview-item',
    template: `
<div class="treeview-item">
    <ng-template [ngTemplateOutlet]="template"
        [ngOutletContext]="{
            item: item, 
            toggleCollapseExpand: toggleCollapseExpand, 
            onCheckedChange: onCheckedChange
        }">
    </ng-template>
    <div *ngIf="!item.collapsed">
        <ngx-treeview-item *ngFor="let child of item.children" [item]="child" [template]="template"
            (checkedChange)="onChildCheckedChange(child, $event)">
        </ngx-treeview-item>
    </div>
</div>
    `,
    styles: [`
        :host {
            display: block;
        }
        :host /deep/ .fa {
            margin-right: .2rem;
            width: .5rem;
            cursor: pointer;
        }
        .treeview-item {
            white-space: nowrap;
        }
        .treeview-item .treeview-item {
            padding-left: 2rem;
        }
        
        :host /deep/ .form-check {
            width: 100%;
            margin-bottom: 1px;
        }
        
        :host /deep/ .form-check label {
            width: 100%;
        }
        
        :host /deep/ .form-check:hover::after {
            position: absolute;
            left: -1000px;
            right: 0;
            bottom: 0;
            top: 0;
            content: '';
            background: #f5f5f5;
            z-index: -1;
        }
    `]
})
export class TreeviewItemComponent implements OnChanges {
    @Input() template: TemplateRef<TreeviewItemTemplateContext>;
    @Input() item: TreeviewItem;
    @Input() removeItem: TreeviewItem;
    @Output() checkedChange = new EventEmitter<boolean>();

    ngOnChanges(changes: SimpleChanges): void {
        mu.run(mu.prop(changes, 'removeItem.currentValue'), (item) => {
            // item.setCheckedRecursive(false);
            // this.checkedChange.emit(false);
        });
    }

    toggleCollapseExpand = () => {
        this.item.collapsed = !this.item.collapsed;
    };

    onCheckedChange = () => {

        // console.debug(this.item, removeItem);

        const checked = this.item.checked;
        const selected = this.item.selected;
        if (!_.isNil(this.item.children)) {
            this.item.children.forEach(child => {
                child.setCheckedRecursive(checked);
            });
        }

        this.checkedChange.emit(checked);
    };

    onChildCheckedChange(child: TreeviewItem, checked: boolean) {
        if (this.item.checked !== checked) {
            let itemChecked = true;
            for (let i = 0; i < this.item.children.length; i++) {
                if (!this.item.children[i].checked) {
                    itemChecked = false;
                    break;
                }
            }
            this.item.checked = itemChecked;
        }

        this.checkedChange.emit(checked);
    }
}
