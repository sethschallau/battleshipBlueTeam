import { User } from "./user";
import { Ship } from "./ship";

export class Game {
    id: number;
    status: string;
    players: User[];
    currentPlayer: User;
    createdBy: string;
    ships: Ship[];
    hits: Location[];
    misses: Location[];
}