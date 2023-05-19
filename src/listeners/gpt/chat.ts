import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import { Message } from 'discord.js';
import { OpenAI } from "langchain/llms/openai";
import { config } from '../../config';



@ApplyOptions<Listener.Options>({ event: Events.MessageCreate})
export class UserEvent extends Listener<typeof Events.MessageCreate> {
	
	public override async run(msg: Message) {
		const model = new OpenAI({ openAIApiKey: process.env.OPENAI_KEY, temperature: 0.9, modelName: 'gpt-3.5-turbo' }, {basePath: process.env.OPENAI_BASEPATH});
		if (msg.channelId == config.channelId && msg.guildId == config.guildId && msg.author.id != this.container.client.user?.id) {
		
		const response = await model.call('Hello, how are you doing?').then((res) => console.log(res));
		this.container.client.logger.info(response);
		 await msg.reply('hi')
		}

	}
}
