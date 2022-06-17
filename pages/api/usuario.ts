import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import { ValidarJWT } from "../../middlewares/ValidarJWT";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import { UsuarioModel } from "../../models/UsuarioModel";
import { upload, UploadImagemCosmic } from "../../services/UploadImagemCosmic";
import nc from "next-connect";

const handler = nc()
    .use(upload.single('file'))
    .put(async (req: any, res: NextApiResponse<PadraoResponse>) => {
        try {
            const { userId } = req?.query;
            const usuario = await UsuarioModel.findById(userId);
    
            if (!usuario) {
                return res.status(400).json({ error: 'Usuário não localizado' })
            }
    
            const { nome } = req.body;
    
            if (nome && nome.length > 2) {
                usuario.nome = nome;
            }
    
            const { file } = req;
            if (file && file.originalname) {
                const image = await UploadImagemCosmic(req);
    
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                };
            };
    
            await UsuarioModel.findByIdAndUpdate({_id: usuario._id}, usuario)
            return res.status(200).json({ message: 'Usuário alterado com sucesso' })
    
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: 'Ocorreu um erro ao atualizar o usuario' })
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
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
    })


    export const config = {
        api: {
            bodyParser: false
        }
    }    
    
export default ValidarJWT(ConectarMongoDb(handler));