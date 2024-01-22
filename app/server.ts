import express from 'express'
import {Parser} from "./parser";
import {MongoRepository} from "./repository/mongo";
import {Site} from "./repository/site.type";



export class Server {
    private readonly server: express.Application;
    private parser: Parser
    private repository: MongoRepository
    private ai: AiInterface

    constructor(parser: Parser, repository: MongoRepository, ai: AiInterface) {
        this.server = express()
        this.parser = parser;
        this.repository = repository;
        this.ai = ai;
    }
    
    public listen() {
        const port = process.env.PORT || 3000; // Установка порта сервера
        
        this.server.get('/', (req, res) => {
            res.send('Привет, мир!');
        });
        
        this.server.get('/test', async (req, res) => {

            let content = "Замарин Михаил Борисович является уполномоченным по защите прав предпринимателей в городе Москве и советником председателя Российского экологического общества. Он также является членом генерального совета общероссийской общественной организации «Деловая Россия» и бизнес-послом в Сингапуре.\\n\\nМихаил Борисович является экспертом по актуальным вопросам экологии и обращения с отходами. Он оказывает консультации по экологическим вопросам и вопросам сортировки и переработки твердых коммунальных отходов.\\n\\nТелефон: +7 (926) 349-90-45"

            let k = await this.ai.keywords(content)
            let c = await this.ai.category(content)
            let t = await this.ai.tonal(content)
            // \"positive:0.5\", \"negative:0.1\", \"neutral:0.5\""
            let r = {
                "tonal": t,
                "category": c,
                "keywords": k,
            }

            res.send(r);

            // if (req.query.url != "") {
            //     let content = ""
            //     this.parse(decodeURI(req.query.url)).then((val) => {
            //             res.send(val.upsertedId);
            //     })
            // }
        });

        this.server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    
    private async parse (param: string | URL) {
        const url = new URL(param)
        const content = await this.parser.parse(url)

        const site: Site = {
            content: content,
            domain: url.hostname,
            page: url.pathname
        }

        // TODO: обработать результат и в случае ошибки, писать в топик
        return await this.repository.create(site)
    }
    
}