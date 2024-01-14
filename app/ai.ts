import {MongoRepository} from "./repository/mongo";
import axios from 'axios';

export class Ai {
    private repository: MongoRepository
    private aiToken: string = "y0_AgAAAAAIecY2AATuwQAAAAD3KsSgSJEZ3B2ySpWW6e2PS5jJjPnHSZc"
    private folder: string = "b1g23us4o7uhmq1tctfl"
    private apiUrlCompletion: string = "https://llm.api.cloud.yandex.net/foundationModels/v1/completion"
    private modelUri: string = "gpt://b1g23us4o7uhmq1tctfl/yandexgpt-lite"


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
                "Определи подходящие категории для текста одним словом на английском языке."
            );

            return response.data.result.alternatives[0].message.text
        } catch (error) {
            // обработка ошибки
            console.error('Error while category:', error);
            return null;
        }
    }

    async keywords(text: string) {
        try {
            const response = await this.sendRequest(
                text,
                "Определи ключевое слово для текста исключая имена и фамии людей, отвечай одним словом"
            );

            return response.data.result.alternatives[0].message.text;
        } catch (error) {
            // обработка ошибки
            console.error('Error while category:', error);
            return null;
        }
    }

    async tonal(text: string, type: string) {
        try {
            let types = {
                negative: "негативной",
                neutral: "нейтральной",
                positive: "позитивной",
            }
            const response = await this.sendRequest(
                text,
                "Определи вероятность " + types[type]+ " тональности текста одним числом",
            );

            return response.data.result.alternatives[0].message.text
        } catch (error) {
            // обработка ошибки
            console.error('Error while category:', error);
            return null;
        }
    }

    private async auth(token: string): Promise<string> {
        const requestBody = {
            yandexPassportOauthToken: token
        };

        try {
            const response = await axios.post('https://iam.api.cloud.yandex.net/iam/v1/tokens', requestBody);
            return response.data.iamToken;
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
            return await axios.post(this.apiUrlCompletion, body, config);
        } catch (error) {
            // обработка ошибки
            console.error('Error while tokenizing:', error);
            return null;
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
}