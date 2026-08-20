
const  express =  require("express");
const  cors =  require("cors");
const app =  express();
require("dotenv").config();
const PORT =  process.env.PORT || 3000;
const connectDB =  require("./config/db");
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: ['https://project-management-system-frontend-nine.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

const {useAPIKEY,useAuthToken} =  require("./middleware/middleware");

//Route
const userRoutes =  require("./api/v1/routes/userRoutes");
const projectRoutes =  require("./api/v1/routes/projectRoutes");
const projectmemberRoutes =  require("./api/v1/routes/projectmemberRoutes");
const taskRoutes =  require("./api/v1/routes/taskRoutes");


//Middleware
app.use(useAPIKEY);
app.use(useAuthToken);

//DB Connection
connectDB();

app.use("/user",userRoutes);
app.use("/project",projectRoutes);
app.use("/projectmember",projectmemberRoutes);
app.use("/task",taskRoutes);

app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`);
});
