const express = require('express')              //Datentypen: const, let, var
const app = express()                           //callbacks, async/await, promise
const port = 3000                               //3rd Party, Core, local
const mongoose = require('mongoose');
const Player = require('./fussball')
const bodyparser = require('body-parser');

app.use(bodyparser.json({limit: "30mb", extend: true})) //body oder bilder dürfen nicht mehr als 30mb haben.
// Bodyparse.json ist für z.b. Zeile 32 (request.body)
//mit req.body kriegen wir body als json zurück -> deswegen bodyparser.json ; "extend: true" muss man noch dazu schreiben


app.get('/', (req, res) => {
    Player.find().then((result)=>{
        res.json(result)
    });
})

//app=server
//get=bekommt was
//post= etwas erstellen oder hochladen
//patch=update
//delete=löschen
// in das callback kommt man rein wenn man nur get und slash schreibt
// find()= liefert alle von Typ player zurück
// then = promise
// wenn es dann fertig ist kommt alles in "result" rein
// bei post man auf "GET" gehen und das was in der URL steht muss auch bei app.get('/') stehen
// res.json(result) => respond sendet ein json und als json senden wir ein result


app.get('/:id', (req, res) => {
    const id = req.params.id; // app.get('/:id') muss gleich geschrieben werden wie bei "=req.params.id" ; von req.params holen wir uns die parameter und eben die id
    if(!mongoose.Types.ObjectId.isValid(id)){ //wir benutzen das 3rd party Modul mongoose um mit mongoDB zu kommunizieren. Wir prüfen ob die variable "id" eine ObjectId ist.
        return res.send('ID nicht korrekt') //wenn es nicht passt, dann wird das ausgegeben
    }
    Player.findById(id).then((result)=>{ //Wir suchen den Datensatz mit der ID und geben das in das result rein. ".then" = Ein promise
        res.json(result) //res.json(result) => respond sendet ein json und als json senden wir ein result
    });
})





app.post('/newplayer', async (req, res) => {
    if(req.body === undefined){ //also wenn das body undefined ist//das body leer ist
        res.json({message:"Body is empty!"})//kommt dann diese nachricht => "body ist empty"
        return;//wenn es passt dann wird es einfach zurückgesendet
    }
    try {
        const player = new Player(req.query)//bei postman unter "post => body => form-data" werden die jeweiligen Daten bei key und value hingeschrieben.
        var result={};
        await Player.find((req, res)=>{
            result=res;
        })
        player.playerid=result.length+1;
        await player.save() //Man speichert den player in der Datenbank ab.
        res.json(req.query) //gibt bei erfolg den gespeicherten Spieler aus
    } catch (e) {
        res.json({message:e.message})
    }
})






app.post('/update',async (req, res) => {
    const playerid = req.query.playerid; //app.get('/:id') muss gleich geschrieben werden wie bei "=req.params.id" ; von req.params holen wir uns die parameter und eben die id

    try {
        console.log(req.query)
        const newPlayer = new Player(req.query)////bei postman unter "patch => params => form-data" werden die jeweiligen Daten bei key und value hingeschrieben
        await Player.findOneAndUpdate({playerid:playerid}, {profilbild:req.query.profilbild, vorname:req.query.vorname, nachname:req.query.nachname, alter:req.query.alter}) //er sucht diese _id und tut es mit dem newPlayer updaten
        res.json({message:"succses"})//wenn es passt dann kommt diese nachricht
    } catch (e) {
        console.log(e)
        res.json({message:e.message})
    }

})





app.delete('/delete',async (req, res) => {//async ist für das await
    const playerid = req.query.playerid;//app.get('/:id') muss gleich geschrieben werden wie bei "=req.params.id" ; von req.params holen wir uns die parameter und eben die id
    await Player.deleteOne({playerid:playerid})
    res.json({ message: "Recipe deleted successfully." , playerid:playerid});//wenn es passt dann kommt diese nachricht
});

const connectionstring="mongodb+srv://admin:IhMMuiwiW!@cluster0.xge6b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
//die connection zu mongoDB

mongoose.connect(connectionstring, {//vordefiniert aus dem internet. Paar einstellung die getätigt werden
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(()=>{app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})});








