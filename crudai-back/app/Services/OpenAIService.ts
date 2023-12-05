import OpenAI from 'openai';

export class OpenAIService {
  private openai: OpenAI;
  private assistant: OpenAI.Beta.Assistants.Assistant;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    // initialize assitant
    this.openai.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID!).then(assistant => {
      this.assistant = assistant;
    })
  }

  async createThread() {
    const thread = await this.openai.beta.threads.create()
    return thread.id
  }

  async getMessages(threadId: string) {
    const messages = await this.openai.beta.threads.messages.list(
      threadId
    );

    if (!messages) {
      return "Sorry, an error occurred.";
    }

    return messages.data.reverse().map(message => {
      //@ts-ignore
      const content = message.content.at(-1).text.value;

      const regex = /【\d+†source】/g;
      const contentWithoutSources = content.replace(regex, '');

      return {id: message.id, speaker: message.role,  message: contentWithoutSources}
    });
  }

  async chat(threadId: string, content: string) {

    await this.openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content
    })

    let run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistant.id,
    })

    do {
      run = await this.openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      );
    } while (run.status === "in_progress")

    const messages = await this.openai.beta.threads.messages.list(
      threadId
    );

    if (!messages) {
      return "Sorry, an error occurred.";
    }

    //@ts-ignore
    return messages.data[0].content.at(-1).text.value;
  }
}