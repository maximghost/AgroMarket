import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI 
    await mongoose.connect(uri)
    
    console.log('✅ Connecté à MongoDB')
    return mongoose.connection
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message)
    process.exit(1)
  }
}

export default connectDB
