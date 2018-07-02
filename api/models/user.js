const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: {type: String, required: true}
});

// will be executed before User.save()
// userSchema.pre('save', async function (next) {
//   try {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(this.password, salt);
//     this.password = hash;
//   } catch (error) {
//     next(error);
//   }
// });

// sign in - check password
userSchema.methods.isValidPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.local.password);
  } catch(error) {
    throw new Error(error);
  }
};

module.exports = mongoose.model('User', userSchema);

// let User = mongoose.model('User', UserSchema);
// export default User;