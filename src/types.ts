export type piece = {
    position: coordinate;
    type: string;
    color: string;
    firstMove: boolean;
    disabled: boolean;
}

export type coordinate = {
    x: number;
    y: number;
}

export type turn = "white" | "black";