import { Player } from "./player";
import { Ship } from "./ship";

export class Game {
    status: string;
    players: Player[];
    currentPlayer: Player;
    ships: Ship[];
    hits: Location[];
    misses: Location[];
}