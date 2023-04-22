import { Location } from "./location";

export class Ship {
    coords: Location[] | null;
    type: string;
    size: number;
    username: string;
    direction: string;
    imgsrc: string;
    isClicked?: boolean | undefined;
}