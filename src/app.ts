import express, {Request, Response} from 'express';
import cors from 'cors';

import Sender from "./sender";

const sender = new Sender();

const app = express();

const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options)); 
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/status', (req: Request, res: Response) => {
    return res.send({qr_code: sender.qrCode, ConnectionStatus: sender.conectionStatus})
});

app.get('/send', async (req: Request, res: Response) => {
    const {number, message} = req.body;
   try{
    await sender.sendText(number, message);
    return res.status(200).json({message: "Mensagem enviada!"})
   }catch(error){
    console.error(error);
    res.status(500).json({message: error, status: 'error'});  
   }
})

app.listen(5000, () => {
    console.log("Servidor on 🔥");
    
})