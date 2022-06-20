import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import {ConectarMongoDb} from "../../middlewares/ConectarMongoDb";
import { ValidarJWT } from "../../middlewares/ValidarJWT";
import { UsuarioModel } from "../../models/UsuarioModel";
import { SeguidorModel } from "../../models/SeguidorModel";
import { PoliticaCors } from "../../middlewares/politicaCors";

const seguirEndpoint = async(req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    try {
        if(req.method === "PUT"){
            const {userId, id} = req?.query
            const usuarioLogado = await UsuarioModel.findById(userId);

            if(!usuarioLogado){
                return res.status(400).json({error: 'Usuário não encontrado'})
            }

            const usuarioASerSeguido = await UsuarioModel.findById(id);
            if(!usuarioASerSeguido){
                return res.status(400).json({error: 'Usuário a ser seguido não encontrado'})
            }

            // Verificando se já sigo este usuário
            const euJaSigoUsuario =  await SeguidorModel.find({usuarioId: usuarioLogado._id, usuarioASerSeguido: usuarioASerSeguido._id})
            if(euJaSigoUsuario && euJaSigoUsuario.length > 0){
                euJaSigoUsuario.forEach(async(e: any) => await SeguidorModel.findByIdAndDelete({_id: e._id}))

                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado)
                usuarioASerSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido)

                return res.status(200).json({message: 'Deixou de seguir o usuário com sucesso'})

            }else{
                // Não sigo o usuário então vou segui-lo
                const seguidoPorMim = {
                    idUsuario: usuarioLogado._id,
                    idUsuarioSeguido: usuarioASerSeguido._id
                }
                await SeguidorModel.create(seguidoPorMim);

                // Atualizando o número de usuários que estou seguindo
                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado)
                
                // Atualizando o número de seguidores do usuário que acabei de seguir
                usuarioASerSeguido.seguidores++
                await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido)

                return res.status(200).json({message: 'Usuário seguido com sucesso'})
            }
        }

        return res.status(405).json({error: 'Método não permitido'})
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: 'Ocorreu um erro inesperado'})
    }
}

export default PoliticaCors(ValidarJWT(ConectarMongoDb(seguirEndpoint)))