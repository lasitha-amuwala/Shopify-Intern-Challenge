const express = require("express");
const path = require("path")
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req,res)=>{
	res.render('index.html')
})

app.listen(PORT, () => {
	console.log(`Server started and listening at http://localhost:${PORT}`);
});
