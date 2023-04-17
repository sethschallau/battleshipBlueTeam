const { Chat } = require('../models');

exports.getChats = async (req, res) => {
	try {
		const gameId = req.params.id;
		const chat = await Chat.findOne({ gameId });

		if (!chat) {
			return res.status(404).json({ message: 'No Chats' });
		}

		res.status(200).json({ chats: chat.chats });
	} catch (error) {
		res.status(500).json({ message: 'Cant get chats', error });
	}
};


exports.sendChat = async (req, res) => {
	try {
		const { gameId, playerUserName, imageFile, note } = req.body;
		const chat = await Chat.findOne({ gameId });

		//if empty we need a new one
		if (!chat) {
			const newChat = new Chat({
				gameId,
				chats: [
					{
						playerUserName,
						imageFile,
						note,
					},
				],
			});
			await newChat.save();
			return res.status(201).json({ message: 'New Chat', newChat });
		}

		// Else, push to existing array
		chat.chats.push({ playerUserName, imageFile, note });
		await chat.save();
		res.status(200).json({ message: 'Message added successfully', chat });
	} catch (error) {
		res.status(500).json({ message: 'Error adding message to chat', error });
	}
};
