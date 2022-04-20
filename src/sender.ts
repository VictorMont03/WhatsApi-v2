import { start } from 'repl';
import {create, Whatsapp, Message, SocketState} from 'venom-bot';
import parsePhoneNumber, {isValidPhoneNumber} from 'libphonenumber-js';

export type QrCode = {
    base64Qr: string, 
    asciiQR?: string
}

class Sender{
    private client: Whatsapp;
    private isConnected: boolean;
    private qr_code: QrCode;

    constructor(){
        this.initialize();
    }

    
    get conectionStatus() : boolean{
        return this.isConnected;
    }

    get qrCode(): QrCode{
        return this.qr_code;
    }
    

    async sendText(to: string, body: string){

        if(!isValidPhoneNumber(to, 'BR')){
            throw new Error('Número inválido!');
        }

        let phoneNumber = parsePhoneNumber(to, 'BR')?.format("E.164").replace("+", "") as string;

        phoneNumber = phoneNumber.includes("@c.us") ? phoneNumber : `${phoneNumber}@c.us`

        //example wpp: 551299999999@c.us
        await this.client.sendText(phoneNumber, body);
    }

    private initialize(){
        const qr_code = (base64Qr: string , asciiQR: string) => {
            this.qr_code = {base64Qr, asciiQR}
            
        }

        const status = (statusSession: string) => {
            /*
            Gets the return if the session is isLogged or notLogged or
            browserClose or qrReadSuccess or qrReadFail or autocloseCalled 
            or desconnectedMobile or deleteToken or chatsAvailable or 
            deviceNotConnected or serverWssNotConnected or noOpenBrowser 
            or Create session wss return "serverClose" case server for close
            */

            this.isConnected = ["isLogged", "chatsAvailable", "qrReadSuccess"].includes(statusSession);
        }

        const start = (client: Whatsapp) => {
            this.client = client;
            client.onStateChange((state) => {
                this.isConnected = state === SocketState.CONNECTED;
            })
        }


        create("ws-sender-dev", qr_code, status).then((client) => start(client)).catch((error) => console.error(error));
    }

}

export default Sender