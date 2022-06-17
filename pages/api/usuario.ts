import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import { ValidarJWT } from "../../middlewares/ValidarJWT";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import { UsuarioModel } from "../../models/UsuarioModel";

const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    try {
        // Buscando o usuario logado
        const { userId } = req?.query;
        if(!req?.query?.id){
            return res.status(400).json({error: 'Usuário não localizado'})
        }

        const usuario = await UsuarioModel.findById(userId);

        usuario.senha = null;

        return res.status(200).json(usuario)
        
    } catch (error) {
        console.log(error)
        return res.status(400).json({error: 'Ocorreu um erro ao exibir os dados do usuário'})
    }
}

export default ValidarJWT(ConectarMongoDb(usuarioEndpoint));