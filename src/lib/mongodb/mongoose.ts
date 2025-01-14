import mongoose from "mongoose";

let initialized: boolean = false; // Explicitly typed as boolean

export const connect = async (): Promise<void> => {
    mongoose.set("strictQuery", true);

    if (initialized) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        // Check if the MONGODB_URI environment variable is set
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI is not set");
            return;
        }

        // Connect to MongoDB using the URI and options
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "cronicasdelvejerete", // Specify your database name here
            serverSelectionTimeoutMS: 30000, // 30 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
        });

        console.log("Connected to MongoDB");

        // Mark as initialized to prevent reconnecting
        initialized = true;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);

        // Log more details if needed
        if (error instanceof mongoose.Error) {
            console.error("Mongoose error:", error.message);
        }
    }
};
