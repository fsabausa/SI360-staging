import {
	GuestCheckWindow
} from '../obj-interface';

export interface ITableDetail{
    SeatCount : number;
    LayoutTableId : string;
    TableName :string;
    TakenSeats : number[];
    Checknumber : number; 
    SaleId : string;
    EmpName: string;
    EmpId: number;
    GetSaleItems : GuestCheckWindow[]
}