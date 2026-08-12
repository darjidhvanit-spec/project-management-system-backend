const  express =  require("express");
const  cors =  require("cors");
const app =  express();
require("dotenv").config();
const PORT =  process.env.PORT || 3000;
const connectDB =  require("./config/db");
app.use(cors());
app.use(express.json());


const {useAPIKEY} =  require("./middleware/middleware");

//Route
const userRoutes =  require("./api/v1/routes/userRoutes");
const projectRoutes =  require("./api/v1/routes/projectRoutes");


//Middleware
app.use(useAPIKEY);

//DB Connection
connectDB();

app.use("/user",userRoutes);
app.use("/project",projectRoutes);

app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`);
});