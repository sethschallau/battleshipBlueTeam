import { User } from "./user";
import { ShipList } from "./shipList";
import { ShotList } from "./shotList";

export class Game {
    _id: string;
    status: string;
    players: User[];
    currentPlayer: string;
    createdBy: string;
    ships: ShipList[];
    hits: ShotList[];
    misses: ShotList[];
    winner: User;
}