import { User } from "./user";
import { Ship } from "./ship";
import { Shot } from "./shot";

export class Game {
    _id: number;
    status: string;
    players: User[];
    currentPlayer: User;
    createdBy: string;
    ships: Ship[];
    hits: Shot[];
    misses: Shot[];
}