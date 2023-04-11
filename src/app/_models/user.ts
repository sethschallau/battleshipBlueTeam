import { Game } from "./game";

export class User {
    id: number;
    username: string;
    games: Game[];
    wins: number;
}