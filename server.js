const express = require('express');
const model=require('./db/db')
 require('dotenv').config()
 var sanitize = require('mongo-sanitize');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));
app.get('/services', (req, res) => res.render('services'));
app.get('/work', (req, res) => res.render('work'));
app.get('/contact', (req, res) => res.render('contact'));
app.post('/form', async (req, res) => {
    try {
        const cleanInput = sanitize(req.body);
        const { message, budget, service, company, name, email } = cleanInput
    
        await model.model.create({ message, budget, service, company, name, email });

        res.redirect('/');
    } catch (e) {
        console.error("Error saving to database:", e);
        res.status(500).send("An error occurred");
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));     
