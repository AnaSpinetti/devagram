import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { PadraoResponse } from "../types/PadraoResponse";
import mongoose from "mongoose";

export const ConectarMongoDb = (handler: NextApiHandler) => async(req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    // Verificar se o banco já está conectado
    if(mongoose.connections[0].readyState){
        console.log("O banco está conectado");
        return handler(req, res);
    }

    const {CONNECTION_STRING} = process.env;

    if(!CONNECTION_STRING){
        return res.status(500).json({ error: "A chave de conexão não foi informada no arquivo ENV" });
    };

    mongoose.connection.on("connected", () => console.log("Banco de dados conectado"));
    mongoose.connection.on("error", (error) => console.log("Nao foi possível conectar ao banco de dados: " + error));
    await mongoose.connect(CONNECTION_STRING);

    return handler(req, res)
}