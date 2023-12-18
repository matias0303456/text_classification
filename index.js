import express from 'express'
import { pipeline, env } from '@xenova/transformers';
import bodyParser from 'body-parser'

const app = express()

const task = 'sentiment-analysis'
const model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
env.cacheDir = './.cache'

app.set('view engine', 'ejs')
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    return res.render('index.ejs', { result: null })
})

app.post('/process', async (req, res) => {
    try {
        let result
        const { text } = req.body
        if (!text || text.length === 0) {
            result = { label: 'You must enter a text.' }
        } else {
            const progress_callback = (value) => console.log(value)
            const classifier = await pipeline(task, model, { progress_callback })
            const response = await classifier(text)
            result = response[0]
        }
        return res.render('index.ejs', { input: text, result })
    } catch (err) {
        return res.status(500).send(err)
    }
})

app.listen(8000, () => console.log('Server is running on port 8000'))