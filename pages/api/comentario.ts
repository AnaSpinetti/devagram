import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import { ValidarJWT } from "../../middlewares/ValidarJWT";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import { UsuarioModel } from "../../models/UsuarioModel";
import { PublicacaoModel } from "../../models/PublicacaoModel";

const comentarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    try {
        if (req.method === "PUT") {
            const {userId, id} = req?.query;
            
            const usuarioLogado = await UsuarioModel.findById(userId)
            if(!usuarioLogado){
                return res.status(400).json({ error: 'Usuário não encontrado' })
            }
            
            const publicacao = await PublicacaoModel.findById(id)
            if(!publicacao){
                return res.status(400).json({ error: 'Publicação não encontrada' })
            }
            
            if(!req.body || !req.body.comentario || req.body.comentario.length < 2){
                return res.status(400).json({ error: 'Comentário inválido' })
            } 

            const comentario = {
                usuarioId: usuarioLogado._id,
                nome: usuarioLogado.nome,
                comentario: usuarioLogado.comentario
            }

            publicacao.comentarios.push(comentario)

            await PublicacaoModel.findByIdAndUpdate({_id: publicacao._id}, publicacao)

            return res.status(200).json({ message: 'Comentário enviado' })
        }

        return res.status(405).json({ error: 'O método informado é inválido' })

    } catch (e) {
        console.log(e)
        return res.status(400).json({ error: 'Ocorreu um erro ao comentar essa publicação' })
    }
}

export default ValidarJWT(ConectarMongoDb(comentarioEndpoint));