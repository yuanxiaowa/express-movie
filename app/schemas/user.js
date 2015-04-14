var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: String,
	Role: {
		type: Number,
		default: 0
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		}
	}
});

UserSchema.pre('save', function (next) {
	var user = this;
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) {
			return next();
		}

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) {
				return next();
			}
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods = {
	comparePassword: function(_password, cb) {
		bcrypt.compare(_password, this.password, function (err, isMatch) {
			if (err) {
				return cb(err);
			}
			cb(null, isMatch);
		});
	}
};

UserSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.exec(cb);
	},
	findById: function(id, cb) {
		return this
			.findOne({_id: id})
			.exec(cb);
	}
};
module.exports = UserSchema;