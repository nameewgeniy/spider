interface AiInterface {
    tokenize(text: string): Promise<string>
    category(text: string): Promise<string>
    keywords(text: string): Promise<string>
    tonal(text: string): Promise<string>
}