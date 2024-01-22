import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai"
import {MongoRepository} from "../repository/mongo";

export class Gemini implements AiInterface {
    private readonly repository: MongoRepository
    private readonly apiKey: string = ""
    private readonly model: string = "gemini-pro"

    constructor(apiKey: string, repository: MongoRepository) {
        this.repository = repository
        this.apiKey = apiKey
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
        const genAI = new GoogleGenerativeAI(this.apiKey);
        const model = genAI.getGenerativeModel({model: this.model});

        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const parts = [
            {text:text},
        ];

        const result = await model.generateContent({
            contents: [{role: "user", parts}],
            generationConfig,
            safetySettings,
        });

        const response = result.response;

        return response.text()
    }

}
