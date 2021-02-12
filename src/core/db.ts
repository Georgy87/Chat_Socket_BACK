import mongoose from "mongoose";

mongoose.connect("mongodb+srv://dbUser:1987toyuiui@cluster0.o2azr.mongodb.net/Chat?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});