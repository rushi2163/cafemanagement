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
    {state: 'product',name : 'manage Product',icon: 'inventory_2',role : 'admin'},
    {state: 'order',name : 'manage order',icon: 'list_alt',role : ''}  ,
    {state: 'bill',name : 'View bill',icon: 'import_contacts',role : ''}  
];

@Injectable()
export class MenuItems{
    getMenuitem():Menu[]{
        return MENUITEMS;
    }
        
}