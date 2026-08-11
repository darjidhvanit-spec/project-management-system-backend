
const  express =  require("express");
const  cors =  require("cors");
const app =  express();
require("dotenv").config();
const PORT =  process.env.PORT || 3000;
const connectDB =  require("./config/db");
app.use(cors());

const {useAPIKEY} =  require("./middleware/middleware");

//Route
const userRoutes =  require("./api/v1/routes/userRoutes");


//Middleware
app.use(useAPIKEY);

//DB Connection
connectDB();

app.use("/user",userRoutes);

app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`);
});
