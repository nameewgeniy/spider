import axios from 'axios';
import {MongoRepository} from "../repository/mongo";

export class Yandex implements AiInterface{
    private repository: MongoRepository
    private aiToken: string = "y0_AgAAAAAIecY2AATuwQAAAAD3KsSgSJEZ3B2ySpWW6e2PS5jJjPnHSZc"
    private folder: string = "b1g23us4o7uhmq1tctfl"
    private apiUrlCompletion: string = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
    private modelUri: string = "gpt://b1g23us4o7uhmq1tctfl/yandexgpt-lite"
    private tempToken: string = ""


    constructor(repository: MongoRepository) {
        this.repository = repository
    }

    // @ts-ignore
    async tokenize(text: string): Promise<any> {
        const requestBody = {
            modelUri: "gpt://b1g23us4o7uhmq1tctfl/yandexgpt-lite/latest",
            text: text
        };

        const token = await this.auth(this.aiToken)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };

        try {
            const response = await axios.post('https://llm.api.cloud.yandex.net/foundationModels/v1/tokenize', requestBody, config);
            return response.data;
        } catch (error) {
            // обработка ошибки
            console.error('Error while tokenizing:', error);
            return null;
        }
    }

    async category(text: string) {
        try {
            const response = await this.sendRequest(
                text,
                "You can identify five suitable short category names for the text, answer only in English words separated by commas."

            );

            return response.data.result.alternatives[0].message.text
        } catch (error) {
            // обработка ошибки
            console.error('Error while category:', error);
            return error;
        }
    }

    async keywords(text: string) {

        try {
            const response = await this.sendRequest(
                text,
                "You can identify five key words for the text, excluding first names, last names of people and numbers, answer only in words separated by commas."
            );

            return response?.data?.result.alternatives[0].message.text;
        } catch (error) {
            // обработка ошибки
            console.error('Error while category:', error);
            return error;
        }
    }

    async tonal(text: string) {
        try {
            const response = await this.sendRequest(
                text,
                "Ты умеешь определять тональность текста по трём критериям: позитивный, негативный, нейтральный указывая для каждого критерияпроцент, отвечай в формате \"positive:0.5\", \"negative:0.1\", \"neutral:0.5\""
            );
            return response?.data?.result.alternatives[0].message.text
        } catch (error) {
            // обработка ошибки
            console.error('Error while category:', error);
            return error;
        }
    }

    private async auth(token: string): Promise<string> {
        const requestBody = {
            yandexPassportOauthToken: token
        };

        if (this.tempToken != "") {
            return this.tempToken
        }

        try {
            const response = await axios.post('https://iam.api.cloud.yandex.net/iam/v1/tokens', requestBody);

            if (response.data.iamToken) {
                this.tempToken = response.data.iamToken
            }

            return this.tempToken;
        } catch (error) {
            // обработка ошибки
            console.error('Error while getting token:', error);
            return null;
        }
    }

    private async sendRequest(text: string, request: string): Promise<any> {
        let body = {
            modelUri: this.modelUri,
            messages: [
                {
                    text: request,
                    role: "system"
                },
                {
                    text: text,
                    role: "user"
                }
            ],
            folderId: this.folder,
            completionOptions: {
                stream: false,
                maxTokens: 2000,
                temperature: 0.3
            }
        }

        const token = await this.auth(this.aiToken)

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'x-folder-id': this.folder
            }
        };

        try {
            await this.sleep(1000)
            return await axios.post(this.apiUrlCompletion, body, config);
        } catch (error) {
            // обработка ошибки
            console.error('Error while tokenizing:', error);
            return error;
        }
    }

    private parseStringToArray(str): Array<string> {
        try {
            const array = JSON.parse(str);
            if (Array.isArray(array)) {
                return array;
            } else {
                throw new Error('Input is not a valid array');
            }
        } catch (error) {
            console.error('Error parsing string to array:', error);
            return null;
        }
    }

    private sleep(ms): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }


}