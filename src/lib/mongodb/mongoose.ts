import mongoose from "mongoose";

let initialized: boolean = false; // Explicitly typed as boolean

export const connect = async (): Promise<void> => {
    mongoose.set("strictQuery", true);

    if (initialized) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || "", {
            dbName: "cronicasdelvejerete",
            serverSelectionTimeoutMS: 30000, // 30 seconds
            useNewUrlParser: true, // Deprecated in newer versions of mongoose
            useUnifiedTopology: true, // Deprecated in newer versions of mongoose
        });
        console.log("Connected to MongoDB");
        initialized = true;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};
