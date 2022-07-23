import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import type { PadraoResponse } from "../types/PadraoResponse";
import NextCors from "nextjs-cors";

export const PoliticaCors = (handler: NextApiHandler) => async(req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    try {
        await NextCors(req, res, {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            optionsSuccessStatus: 200,
        })

        return handler(req, res)

    } catch (e) {
        console.log(e)
        return res.status(500).json({error: 'Erro ao tratar politica de CORS'})
    }
}