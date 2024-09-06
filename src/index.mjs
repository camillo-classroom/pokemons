import express from "express";
import pokemonsRouter from "./routes/pokemon.mjs"
import treinadorRouter from "./routes/treinador.mjs"

const app = express();

app.use(express.json());
app.use(pokemonsRouter);
app.use(treinadorRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}...`);
})