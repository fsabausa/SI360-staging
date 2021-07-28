export interface ICustomer{
    CustomerId : string;
    Name : string;
    FirstName : string;
    LastName : string;
    MiddleInitial : string;
    Phone : string;
    City: string;
    State : string; 
    Zip : string;
    BirthDate: Date;
    Badge: string;
    Address1 : string;
    Address2 : string;
    CustomerNumber : string;
    Email: string;
}

export interface CustomerLastOrder {
    OrderDate : string;
    CheckNumber : Number;
    OrderList : CustomerInfoOrderList;
}


export interface CustomerInfo {
    CustomerInfo : ICustomer;
    CustomerLastOrder : CustomerLastOrder[];
    FrequentDinerInfo : FrequentDinerInfo;
}

export interface CustomerInfoOrderList {
    SeatNumber: string;
    OrderItems : OrderItems[];
}

export interface OrderItems{
    Item: string;
    Price: string;
}

export interface FrequentDinerInfo {
    DescriptionPlan : string[];
    DescriptionStatus : string[];
}