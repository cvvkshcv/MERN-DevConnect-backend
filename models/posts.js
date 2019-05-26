const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Posts = new Schema({
	user : {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	title : {
		type: String,
		require : true
	},
	content : {
		type: String,
		require : true
	},
	tags : {
		type: [String]
	},
	likes : [
		{
			user : {
				type: Schema.Types.ObjectId,
				ref: 'users'
			}
		}
	],
	comments: [
		{
			user: {
				type:  Schema.Types.ObjectId,
				ref: 'users'
			},
			text : String,
			date: {
				type :Date,
				default: Date.now
			}
		}
	],
	date : {
		type: Date,
		default : Date.now
	}
});

module.exports = mongoose.model('posts', Posts);