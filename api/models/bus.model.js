import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    company: {
        type: String,
        required: true,
      },
    startStation: {
        type: String,
        required: true,
        unique: true,
      },
    toStation: {
      type: String,
      required: true,
    },
    
    image: {
      type: String,
      default:
        'https://media.istockphoto.com/id/951105418/photo/very-nice-young-woman-holding-a-colourful-fresh-blossoming-flower-bouquet-of-different-sorts.jpg?s=612x612&w=0&k=20&c=emRNuMDnrdFVf1G4xLcZVAd_nwOlpJ43xaUyMtqB8z0=',
    },
    type: {
      type: String,
      default: 'uncategorized',
    },
    
    price:{
        type: Number,
        required: true
    },
    seat:{
      type: Number,
      required: true,
      
    },
    depatureTime:{
        type: String,
        required: true,
    },
   
    
    rating:{
        type:Number
    },
   

   
  },
  { timestamps: true }
);

const Buse = mongoose.model('Buse', productSchema);

export default Buse;