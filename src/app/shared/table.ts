export interface ILayoutTable{
    TableIndex :number,
    X :number,
    Y :number,
    Shape :string,
    SeatCount : number,
    TableName : string,
    LayoutTableId : string;
    TakenSeats : string;
    CheckNumbers : string;
    CustomerId : string;
    CheckCreatedByCurrentUser : boolean;
    SaleId: string;
    FromSI360: boolean;
}