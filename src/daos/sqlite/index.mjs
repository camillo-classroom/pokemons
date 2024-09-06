import sqlite3 from "sqlite3";
import PokemonDAO from "./PokemonDAO.mjs";
import TreinadorDAO from "./TreinadorDAO.mjs";

const db = new sqlite3.Database('./db/pokemons.db', (err) => {
    if (err) { console.error(err.message); }
    console.log('Conectado à base de dados.');
});

const daos = {
    pokemon() {
        return new PokemonDAO(db);
    },
    treinador() {
        return new TreinadorDAO(db);
    }
};

export default daos;
