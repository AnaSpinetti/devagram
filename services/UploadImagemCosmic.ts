import multer from "multer";
import cosmicjs from "cosmicjs";

// Capturando os buckets
const { 
    BUCKET_AVATARES, 
    WRITE_KEY_AVATARES, 
    BUCKET_PUBLICACOES, 
    WRITE_KEY_PUBLICACOES } = process.env;

const Cosmic= cosmicjs();
const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_key: WRITE_KEY_AVATARES 
});

const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICACOES,
    write_key: WRITE_KEY_PUBLICACOES 
});

const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const UploadImagemCosmic = async(req: any) => {

    if(req?.file?.originalname){
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer
        };

        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media: media_object});
        }else{
            return await bucketAvatares.addMedia({media: media_object});
        }
    };
}

export {upload, UploadImagemCosmic}