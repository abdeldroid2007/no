const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const database_file = 'data.db';
const db = new sqlite3.Database(database_file);

app.use(express.json());

const createTable = CREATE TABLE IF NOT EXISTS chat_data (
    id TEXT,
    uuid TEXT,
    web_mode INTEGER,
    result TEXT,
    question TEXT
);
db.run(createTable);

app.post('/api/chat', async (req, res) => {
    const { txt, mode, uuid_1, id_1, json_1 } = req.body;

    const id = id_1 ? id_1 : genId();
    const uuid = uuid_1 ? uuid_1 : await getUuid();
    const webk = mode === '1' ? true : false;
    const json = json_1 ? JSON.parse(json_1) : fals();

    const url = 'https://www.blackbox.ai/api/chat';

    const data = json ? { messages: [json], id, previewToken: null, userId: uuid, codeModelMode: true, agentMode: [], trendingAgentMode: [], isMicMode: false, isChromeExt: false, githubToken: null, webSearchMode: webk, maxTokens: '10240' } : { messages: [{ id, content: txt, role: 'user' }], id, previewToken: null, userId: uuid, codeModelMode: true, agentMode: [], trendingAgentMode: [], isMicMode: false, isChromeExt: false, githubToken: null, webSearchMode: webk, maxTokens: '10240' };

    const headers = { 'Content-Type': 'application/json; charset=utf-8' };

    try {
        const response = await axios.post(url, data, { headers });

        if (response.status === 200) {
            const result = response.data;
            db.run("INSERT INTO chat_data (id, uuid, web_mode, result, question) VALUES (?, ?, ?, ?, ?)", [id, uuid, webk ? 1 : 0, result, txt]);
            
            res.json({ id, uuid, web: webk, Creator: '@ExploitNeT - @ImSoheilOfficial', data: result });
        } else {
            res.status(500).json({ status: false, error: response.data });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(Server running at http://localhost:${port});
})
