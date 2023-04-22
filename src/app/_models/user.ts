import { Ship } from "./ship";

export class User {
    _id: string;
    username: string;
    games: string[];
    wins: number;
    remainingShips: Ship[];
    hits: number = 0;
    misses: number = 0;
}