import type { NextApiRequest, NextApiResponse } from "next";
import type { PadraoResponse } from "../../types/PadraoResponse";
import type { CadastroRequest } from "../../types/CadastroRequest";
import { UsuarioModel } from "../../models/UsuarioModel";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import bcrypt from "bcryptjs";
import { upload, uploadImagemCosmic } from "../../services/UploadImagemCosmic";
import nc from "next-connect";
import { PoliticaCors } from "../../middlewares/PoliticaCors";

const handler = nc()
.use(upload.single('file'))
.post(async (req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    try {
        const usuario = req.body as CadastroRequest;
        
        if(!usuario.nome || usuario.nome.length < 2){
            return res.status(400).json({error : 'Nome invalido'});
        }
        
            if(!usuario.email || usuario.email.length < 5
                || !usuario.email.includes('@')
                || !usuario.email.includes('.')){
                    return res.status(400).json({error : 'Email invalido'});
                }
                
            if(!usuario.senha || usuario.senha.length < 4){
                return res.status(400).json({error : 'Senha invalida'});
            }
            
            const userExists = await UsuarioModel.find({ email: usuario.email })
            
            if (userExists && userExists.length > 0) {
                return res.status(400).json({ error: "O email informado já existe em nosso banco de dados" })
            }
            
            // Criptografando a senha
            var salt = bcrypt.genSaltSync(10);
            var senhaCriptografada = bcrypt.hashSync(usuario.senha, salt);
            
            // Enviar a imagem do multer para o cosmic
            var image = uploadImagemCosmic(req);

            
            // Usuário que será salvo no BD
            const usuarioASerSalvo = {
                nome: usuario.nome,
                email: usuario.email,
                senha: senhaCriptografada,
                avatar: image?.media?.url
            }
            
            await UsuarioModel.create(usuarioASerSalvo);
            return res.status(200).json({ message: "Usuário cadastrado com sucesso" })
        }catch (e:any) {
            console.log(e)
            return res.status(400).json({ error: e.message})
        }
    })


    export const config = {
        api: {
            bodyParser: false
        }
    }    

export default PoliticaCors(ConectarMongoDb(handler));