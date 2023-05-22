import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
import { OpenAI } from 'langchain/llms/openai';
import { GithubRepoLoader } from 'langchain/document_loaders/web/github';
import { config } from '../../config';
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import {
  VectorStoreToolkit,
  createVectorStoreAgent,
  type VectorStoreInfo,
} from "langchain/agents";


@ApplyOptions<Listener.Options>({ event: Events.MessageCreate })
export class UserEvent extends Listener<typeof Events.MessageCreate> {
	public override async run(msg: Message) {
		const model = new OpenAI(
			{ openAIApiKey: process.env.OPENAI_KEY, temperature: 0.9, modelName: 'gpt-3.5-turbo' },
			{ basePath: process.env.OPENAI_BASEPATH }
		);
		const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_KEY }, { basePath: process.env.OPENAI_BASEPATH });
		const loader = new GithubRepoLoader('https://github.com/PaperMC/docs', { branch: 'main', recursive: false, unknown: 'warn' });
		
		const docs = await loader.load();

		const vectorStore = await HNSWLib.fromDocuments(docs, embeddings)
		const vectorStoreInfo: VectorStoreInfo = {
			name: "PaperMC Docs",
			description: "Documentation for PaperMC also known as Paper, a Minecraft server software",
			vectorStore
		}

		const toolkit = new VectorStoreToolkit(vectorStoreInfo, model)
		const agent = createVectorStoreAgent(model, toolkit)

		if (msg.channelId == config.channelId && msg.guildId == config.guildId && msg.author.id != this.container.client.user?.id) {
			/* const response = await model.call(msg.content);
			this.container.client.logger.info(response); */
			const prompt = msg.content
			const response = await agent.call({ prompt })

			await msg.reply(response);
		}
	}
}
