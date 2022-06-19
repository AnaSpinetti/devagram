import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { PadraoResponse } from "../types/PadraoResponse";

import jwt, { JwtPayload } from "jsonwebtoken";

export const ValidarJWT = (handler: NextApiHandler) => (req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    try {
        const {CHAVE_JWT} = process.env
    if(!CHAVE_JWT){
        return res.status(500).json({error: "Chave JWT não informada"})
    }

    if(!req || !req.headers){
        return res.status(401).json({error: "Não foi possível validar o seu token de acesso"})
    }

    if(req.method !== "OPTIONS"){
        const authorization = req.headers['authorization']
        if(!authorization){
            return res.status(401).json({error: "Não foi possível validar o seu token de acesso"})
        }

        const token = authorization.substring(7);
        if(!token){
            return res.status(401).json({error: "Não foi possível validar o seu token de acesso"})
        }

        const decoded = jwt.verify(token, CHAVE_JWT) as JwtPayload;
        if(!decoded){
            return res.status(401).json({error: "Não foi possível validar o seu token de acesso"})
        }

        // Não tendo uma query na requisição, criamos uma 
        if(!req.query){
            req.query={};   
        }
        // Caso tenhamos, adicionamos o ID do usuário para ser usado nas requisições
        req.query.userId = decoded._id;
    }
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: 'Erro ao validar token de acesso'})
    }

    return handler(req, res)
}