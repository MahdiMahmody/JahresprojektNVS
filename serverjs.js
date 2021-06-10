const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const Player = require('./fussball')
const bodyparser = require('body-parser');

app.use(bodyparser.json({limit: "50mb", extend: true}))


app.get('/', (req, res) => {
    Player.find().then((result)=>{
        res.json(result)
    });
})


app.get('/:id', (req, res) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.send('ID nicht korrekt')
    }
    Player.findById(id).then((result)=>{
        res.json(result)
    });
})





app.post('/newplayer', async (req, res) => {// "=>" ist eine arrow function
    if(req.body === undefined){
        res.json({message:"Body is empty!"})
        return;
    }
    try {
        const player = new Player(req.query)
        var result={};
        await Player.find((req, res)=>{
            result=res;
        })
        player.playerid=result.length+1;
        await player.save()
        res.json(req.query)
    } catch (e) {
        res.json({message:e.message})
    }
})






app.post('/update',async (req, res) => {
    const playerid = req.query.playerid;

    try {
        console.log(req.query)
        const newPlayer = new Player(req.query)
        await Player.findOneAndUpdate({playerid:playerid}, {profilbild:req.query.profilbild, vorname:req.query.vorname, nachname:req.query.nachname, alter:req.query.alter})
        res.json({message:"succses"})
    } catch (e) {
        console.log(e)
        res.json({message:e.message})
    }

})





app.delete('/delete',async (req, res) => {
    const playerid = req.query.playerid;
    await Player.deleteOne({playerid:playerid})
    res.json({ message: "Deleted successfully." , playerid:playerid});
});

const connectionstring="mongodb+srv://admin:IhMMuiwiW!@cluster0.xge6b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


mongoose.connect(connectionstring, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(()=>{app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})});








