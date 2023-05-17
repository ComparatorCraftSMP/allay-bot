import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
import { OpenAI } from "langchain/llms/openai";



@ApplyOptions<Listener.Options>({ event: Events.MessageCreate})
export class UserEvent extends Listener<typeof Events.MessageCreate> {
	
	public override async run(msg: Message) {
		const model = new OpenAI({ openAIApiKey: process.env.OPENAI_KEY, temperature: 0.9, }, {basePath: process.env.OPENAI_BASEPATH});


	}
}
