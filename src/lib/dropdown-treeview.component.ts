import {
    Component, EventEmitter, Input, Output, HostListener, ViewChild, TemplateRef, ElementRef,
    OnChanges, SimpleChanges
} from '@angular/core';
import * as _ from 'lodash';
import {TreeviewI18n} from './treeview-i18n';
import {TreeviewItem} from './treeview-item';
import {TreeviewConfig} from './treeview-config';
import {TreeviewComponent} from './treeview.component';
import {TreeviewItemTemplateContext} from './treeview-item-template-context';
import * as mu from 'mzmu';

@Component({
    selector: 'ngx-dropdown-treeview',
    template: `
        <div class="dropdown" [class.show]="isOpen">
            <button class="btn btn-secondary dropdown-toggle" type="button" role="button" 
                *ngIf="config.showtype === 'label'"
                (click)="onButtonClick($event)"
                aria-haspopup="true" aria-expanded="false">
                {{getText()}}
            </button>
            
            <div class="type-tag" 
                (click)="onInputFocus(input, $event)" 
                *ngIf="config.showtype === 'tag'">
                <label *ngFor="let item of treeviewComponent.checkedItems">
                    {{item.text}}
                    <i class="fa fa-close" (click)="removeTagItem(item)"></i>
                </label>
                
                <input type="text" #input
                    [style.width.px]="inputWidth"
                    (keydown) = "onInputAutoWidth(pre, $event)"
                    (keypress) = "onInputAutoWidth(pre, $event)"
                    [(ngModel)]="filterText" />
                    
                <pre #pre>{{filterText}}</pre>
            </div>
            
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" 
                [style.width] ="config.dropWidth"
                (click)="$event.stopPropagation()">
                <div class="dropdown-container">
                    <ngx-treeview 
                        [items]="items" 
                        [template]="template" 
                        [config]="config" 
                        [filterText]="filterText" 
                        [removeItem]="removeItem"
                        (selectedChange)="onSelectedChange($event)">
                    </ngx-treeview>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
        .type-tag {
            display: inline-block;
            width: 100%;
            padding: .1rem;
            border: 1px solid #dedede;
            border-radius: 5px;
        }
        
        .type-tag label {
            display: inline-block;
            padding: 3px;
            margin-right: 5px;
            margin-bottom: 2px;
            border: 1px solid #dedede;
        }
        
        .type-tag label:hover {
            background: #dedede;
            cursor: pointer;
        }
        
        .type-tag label i {
            font-style: normal;
        }
        
        .type-tag input {
            display: inline-block;
            width: 15px;
            border: none;
            outline: 0;
            background: transparent;
        }
        
        .type-tag pre {
            display: inline-block;
            position: absolute;
            left: -9999rem;
            top: -9999rem;
            min-width: 15px;
        }
        
        .dropdown-menu {
            width: 100%;
        }
        
        .dropdown-menu ngx-treeview-item:hover  {
            background: #dedede;
        }

        .dropdown {
            width: 100%;
            display: inline-block;
        }
        .dropdown button {
            width: 100%;
            margin-right: .9rem;
            text-align: left;
        }
        .dropdown button::after {
            position: absolute;
            right: .6rem;
            margin-top: .6rem;
        }
        .dropdown .dropdown-menu .row {
            padding: 2px 10px;
        }
        .dropdown .dropdown-menu .dropdown-item-collapse-expand {
            padding: 0;
        }
        .dropdown .dropdown-menu .dropdown-container {
            padding: 0 .6rem;
        }
            `
    ]
})
export class DropdownTreeviewComponent implements OnChanges {
    @Input() template: TemplateRef<TreeviewItemTemplateContext>;
    @Input() items: TreeviewItem[];
    @Input() config: TreeviewConfig;
    @Output() hide = new EventEmitter();
    @Output() selectedChange = new EventEmitter<any[]>(true);
    @ViewChild(TreeviewComponent) treeviewComponent: TreeviewComponent;
    isOpen = false;
    filterText: string;
    removeItem: TreeviewItem;
    inputWidth: number = 15;

    private mouseEvent: MouseEvent;

    constructor(public i18n: TreeviewI18n,
                private defaultConfig: TreeviewConfig,
                private ref: ElementRef) {
        this.config = this.defaultConfig;
    }

    @HostListener('keyup.esc') onKeyupEsc() {
        this.isOpen = false;
    }
    @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) {
        if (this.mouseEvent !== event) {
            this.isOpen = false;
        }
    }


    get hasItems(): boolean {
        return !_.isNil(this.items) && this.items.length > 0;
    }

    getText(): string {
        if (this.treeviewComponent) {
            return this.i18n.getText(this.treeviewComponent.checkedItems, this.treeviewComponent.allItem.checked, this.config);
        }

        return '';
    }

    onSelectedChange(values: any[]) {
        this.selectedChange.emit(values);
    }

    onButtonClick(event: MouseEvent) {
        this.mouseEvent = event;
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
            this.hide.emit();
        }
    }

    onInputAutoWidth(pre: Element, e: KeyboardEvent) {
        let pre_width = pre.clientWidth;
        this.inputWidth = pre_width + 50;
        setTimeout(() => {
            this.inputWidth = pre.clientWidth + 50;
        }, 300);
    }

    onInputFocus(input, event: MouseEvent) {
        input.focus();
        this.mouseEvent = event;
        this.isOpen = true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // treeview-filter
        (<any>mu).run((<any>mu).prop(changes, 'config.currentValue'), (config) => {
            if(config.showtype === 'tag'){
                this.config.isShowFilter = false;
                this.config.isShowCollapseExpand = false;
            }
        });
    }

    removeTagItem(item: any): void {
        this.removeItem = item;
    }

}
