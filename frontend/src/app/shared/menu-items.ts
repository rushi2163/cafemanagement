import { Injectable } from "@angular/core";

export interface Menu{
    state: string;
    name : string;
    icon: string;
    role : string;
}

var MENUITEMS=[
    {state: 'dashboard',name : 'Dashboard',icon: 'dashboard',role : ''},
    {state: 'category',name : 'manage category',icon: 'category',role : 'admin'},
    {state: 'product',name : 'manage Product',icon: 'inventory_2',role : 'admin'}  
];

@Injectable()
export class MenuItems{
    getMenuitem():Menu[]{
        return MENUITEMS;
    }
        
}