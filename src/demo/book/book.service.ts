import { Injectable } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';

export class BookService {
    getBooks(): TreeviewItem[] {
        const childrenCategory = new TreeviewItem({
            text: 'Children', value: 1, collapsed: true, children: [
                { text: 'Baby 3-5', value: 11, displayText: 'wawa - 305', checked: false },
                { text: 'Baby 6-8', value: 12, checked: false },
                { text: 'Baby 9-12', value: 13, checked: false }
            ]
        });
        const itCategory = new TreeviewItem({
            text: 'IT', value: 9, children: [
                {
                    text: 'Programming', value: 91, children: [{
                        text: 'Frontend', value: 911, children: [
                            { text: 'Angular 1 ~', value: 9111, displayText: 'Ng1 - Angular', checked: false },
                            { text: 'Angular 2', value: 9112, checked: false  },
                            { text: 'ReactJS', value: 9113, checked: false  }
                        ]
                    }, {
                        text: 'Backend', value: 912, children: [
                            { text: 'C#', value: 9121, checked: false },
                            { text: 'Java', value: 9122, checked: false  },
                            { text: 'Python', value: 9123, checked: false }
                        ]
                    }]
                },
                {
                    text: 'Networking', value: 92, children: [
                        { text: 'Internet', value: 921, checked: false },
                        { text: 'Security', value: 922, checked: false }
                    ]
                }
            ]
        });
        const teenCategory = new TreeviewItem({
            text: 'Teen', value: 2, collapsed: true, disabled: true, children: [
                { text: 'Adventure-21', value: 21 },
                { text: 'Science-22', value: 22 }
            ]
        });
        const othersCategory = new TreeviewItem({ text: 'Others--', value: 'others-3', checked: false, collapsed: true, disabled: true });
        return [childrenCategory, itCategory, teenCategory, othersCategory];
    }
}
