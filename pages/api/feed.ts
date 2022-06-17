import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import { ValidarJWT } from "../../middlewares/ValidarJWT";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import { UsuarioModel } from "../../models/UsuarioModel";
import { PublicacaoModel } from "../../models/PublicacaoModel";

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<PadraoResponse | any>) => {
    try {
        if(req.method === "GET"){
        // Buscando o usuario logado
        if(req?.query?.id){
            const usuario = await UsuarioModel.findById(req?.query?.id);

            if(!usuario){
                return res.status(400).json({error: 'usuário não localizado'})
            }

            const publicacoes = await PublicacaoModel.find({idUsuario: usuario._id}).sort({data: -1})

            return res.status(200).json(publicacoes);
        }

        }else{
            return res.status(405).json({error: 'O método informado é inválido'})
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({error: 'Ocorreu um erro ao exibir os dados do feed'})
    }
}

export default ValidarJWT(ConectarMongoDb(feedEndpoint));