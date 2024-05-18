import {MongoRepository} from "../repository/mongo";
import OpenAI from "openai";


export class OpenAi implements AiInterface {
    private readonly repository: MongoRepository
    private readonly openai: OpenAI

    constructor(apiKey: string, repository: MongoRepository) {
        this.repository = repository
        this.openai = new OpenAI({
                baseURL: "https://api.proxyapi.ru/openai/v1",
                apiKey: apiKey
            }
        );
    }

    async category(text: string): Promise<string> {
        const pText = "You can define 3 categories from the list of IAB categories to which the text belongs. You always answer in English\n" +
            "Text: Замарин Михаил Борисович является уполномоченным по защите прав предпринимателей в городе Москве и советником председателя Российского экологического общества.\n" +
            "Output: [\"Business\", \"EnvironmentalSafety\"]" +
            "Text:" + text + "\n" +
            "Output:"

        return this.send(pText);
    }

    async keywords(text: string): Promise<string> {
        const pText = "You can identify five key words for the text, excluding first names, last names of people and numbers.\n" +
            "Text: Замарин Михаил Борисович является уполномоченным по защите прав предпринимателей в городе Москве и советником председателя Российского экологического общества.\n" +
            "Output: [\"бизнес\", \"экология\", \"общественник\", \"эксперт\", \"предприниматель\"\"]\n" +
            "Text:" + text + "\n" +
            "Output:"

        return this.send(pText);
    }

    async tokenize(text: string): Promise<string> {
        return this.send(text);
    }

    async tonal(text: string): Promise<string> {
        const pText = "You know how to determine the tone of a text.\n" +
            "Text: Замарин Михаил Борисович является уполномоченным по защите прав предпринимателей в городе Москве и советником председателя Российского экологического общества.\n" +
            "Output: {\"positive:0.5\", \"negative:0\", \"neutral\":0.5}" +
            "Text:" + text + "\n" +
            "Output:"

        return this.send(pText);
    }

    private async send(text: string): Promise<string> {

        const completion = await this.openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant designed to output JSON.",
                },
                {role: "user", content: text},
            ],
            model: "gpt-3.5-turbo-1106",
            response_format: {type: "json_object"},
        });
        console.log(completion.choices[0].message.content);

        return completion.choices[0].message.content
    }

}
