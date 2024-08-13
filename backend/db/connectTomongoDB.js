import mongoose from "mongoose"

export const connectTomongoDB = () => {
    try {
        const connect = mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
