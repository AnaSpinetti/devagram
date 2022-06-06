import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";

const loginEndPoint = async (req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    if(req.method !== 'POST'){
        return res.status(405).json({error: "O método informado é inválido"})
    }

    const { email, senha } = req.body;

    if(email !== "admin@admin.com" && senha !== "admin"){
        return res.status(400).json({error: "Usuário ou senha inválidos"})
    }

    if(email !== "admin@admin.com" || senha !== "admin"){
        return res.status(400).json({error: "Usuário ou senha inválidos"})
    }

    if(!email || !senha){
        return res.status(400).json({error: "Informe todos os dados para prosseguir"})
    }

    return res.status(200).json({error: "Usuário autenticado com sucesso!"})
}