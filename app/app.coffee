path = require "path"
express = require "express"

app = express()

app.get '/', (req, res) ->
  res.sendFile(path.resolve(__dirname, 'public/index.html'))

app.get '/schedule', (req, res) ->
  res.sendFile(path.resolve(__dirname, 'public/schedule.html'))

app.get '/api/items', (req, res) ->
  res.json([{id: 1, sku: 'item-1', name: "Item 1"}, {id: 2, sku: 'item-2', name: "Item 2"}])

app.use(express.static(path.resolve(__dirname, "public")))

port = process.env.PORT || 3000
app.listen(port)
console.log "start server on port #{port}"
