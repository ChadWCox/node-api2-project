const express = require('express');
const server = express();
const PostRouter = require('./api/PostRouter');
server.use(express.json());




server.use('/api/posts', PostRouter )

server.use('/', (req, res) => res.send('Api up and running!'));

server.listen(5000, () => console.log(`Server running on port ${5000}`));

