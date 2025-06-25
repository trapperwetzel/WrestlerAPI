import mongoose from 'mongoose';

const wrestlerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  rank: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  championship:{
    type: String,
    required: true,
    default: "WWE Championship"
  },
    
  totalReigns: {
    type: Number,
    required: true
  },
  totalDaysHeld: {
    type: Number,
    required: true
  }
});

const Wrestler = mongoose.model('Wrestler', wrestlerSchema);
export default Wrestler;