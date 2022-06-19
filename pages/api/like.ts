import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import ConectarMongoDb from "../../middlewares/ConectarMongoDb";
import { ValidarJWT } from "../../middlewares/ValidarJWT";
import { PublicacaoModel } from "../../models/PublicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";

const endpointLike = async (req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    try {

        if(req.method === "PUT"){
            const { idPublicacao } = req?.query;
            const publicacao = await PublicacaoModel.findById(idPublicacao);

            if(!publicacao){
                return res.status(400).json({error: 'Publicação não localizada'})
            }

            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId)
            if(!usuario){
                return res.status(400).json({error: 'usuário não localizada'})
            }

            const usuarioJaCurtiuIndex: Number = publicacao.likes.findIndex((e: any) => e.toString() === usuario._id.toString());

            // -1 significa que não curtiu a foto
            if(usuarioJaCurtiuIndex != -1){
                publicacao.likes.splice(usuarioJaCurtiuIndex, 1);
                await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao)
                return res.status(200).json({message: 'Publicação descurtida'})
            }else{
                publicacao.likes.push(usuario._id);
                await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao)
                return res.status(200).json({message: 'Publicação curtida'})

            }
        }
        return res.status(405).json({error: 'Método não autorizado'})

    } catch (e) {
        console.log(e)
        return res.status(500).json({ error: 'Erro ao realizar a ação: ' + e })
    }
}

export default ValidarJWT(ConectarMongoDb(endpointLike))