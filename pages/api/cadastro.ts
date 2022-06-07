import type { NextApiRequest, NextApiResponse } from "next";
import { ConectarMongoDb } from "../../middlewares/ConectarMongoDb";
import type { CadastroResponse } from "../../types/CadastroResponse";
import type { PadraoResponse } from "../../types/PadraoResponse";
import { UsuarioModel } from "../../models/UsuarioModel";
import bcrypt from "bcryptjs";

const cadastroEndpoint = async(req: NextApiRequest, res: NextApiResponse<PadraoResponse>) => {
    if(req.method === "POST"){
        const usuario = req.body as CadastroResponse;

        if(!usuario.email || !usuario.senha || !usuario.nome){
            return res.status(400).json({error: "Preencha todos os dados para prosseguir"});
        }

        if(usuario.senha.length < 5){
            return res.status(400).json({error: "A senha deve possuir mais de 5 caracteres"});
        }

        if(usuario.nome.length < 2){
            return res.status(400).json({error: "O nome deve possuir no mínimo 2 caracteres"});
        }

        if(!usuario.email.includes('@') || !usuario.email.includes('.')){
            return res.status(400).json({error: "O email informado é inválido"});
        }

        if(usuario.email.length < 5){
            return res.status(400).json({error: "O email informado é inválido"});
        }

        const userExists = await UsuarioModel.find({email: usuario.email})

        if(userExists && userExists.length > 0){
            return res.status(400).json({error: "O email informado já existe em nosso banco de dados"})
        }

        // Criptografando a senha
        var salt = bcrypt.genSaltSync(10);
        var senhaCriptografada = bcrypt.hashSync(usuario.senha, salt);

        const usuarioASerSalvo = {
            nome: usuario.nome,
            email: usuario.email,
            senha: senhaCriptografada
        }

        await UsuarioModel.create(usuarioASerSalvo);
        return res.status(200).json({message: "Usuário cadastrado com sucesso"})
    }
}

export default ConectarMongoDb(cadastroEndpoint);