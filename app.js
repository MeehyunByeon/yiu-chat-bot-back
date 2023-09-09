const express = require('express');
const cors = require('cors'); //프론트 서버와 연결하기 위해서 사용
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const {Card, Code, Ask, History, sequelize} = require('./models'); //sequelize.sync(); 와 함께 사용하여 Sequelize SQL 쿼리를 이용해서 테이블을 만들어준다.


const app = express(); // 기본적으로 express를 사용할 수 있는 변수를 생성
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());  // JSON 형식의 요청 본문 파싱
app.use(express.urlencoded({extended: true})); // URL-encoded 형식의 요청 본문 파싱
sequelize.sync({force: false})//force가 true인 경우 데이터 업에이트 시 테이블이 지웠다가 다시 생성한다.
    .then(() => {
        console.log('데이터베이스 연결 성공!');
    })
    .catch((err) => {
        console.error(err);
    });


app.set('port', process.env.PORT || 3000);
/*서버 통신할 때 사용
app.use(cors({
    origin: 'http://127.0.0.1:8080',
    credentials:true,
}));*/
app.use(cors({
    origin: true, // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
}));

app.post('/question', async (req, res) => {
    try{
        const input_string = req.body.question;

        const pythonProcess = spawn('python', ['./main_logic.py', input_string]);

        let output = '';
        let lastElement;
        let kCode;

        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        await new Promise((resolve) => {
            pythonProcess.on('close', (code) => {
                const result = JSON.parse(output);
                lastElement = result.last_element;
                kCode = lastElement;
                console.log('output : ', output);
                console.log(`Python process exited with code ${code}`);
                console.log('#js Last Element:', lastElement);
                resolve(); // 프로세스 종료 후 Promise 완료
            });
        });

        try{
            const fCode = kCode;

            const result1 = await Code.findOne({
                where : {
                    code : lastElement
                }
            })
            console.log("데이터: ", result1.dataValues)
            const top = result1.dataValues.top.split(",");
            console.log("top: ", top)
            const tempT = await Card.findAll({
                raw : true,
                where : {
                    cid : top
                }
            })
            console.log("resultT2: ", tempT)
            let tempM = [];
            let tempB = [];
            if(result1.dataValues.mid){
                const mid = result1.dataValues.mid.split(",");
                console.log("mid: ", mid)
                tempM = await Card.findAll({
                    raw : true,
                    where : {
                        cid : mid
                    }
                })
                console.log("resultM2: ", tempM)
                if(result1.dataValues.bot){
                    const bot = result1.dataValues.bot.split(",");
                    console.log("bot: ", bot)
                    tempB = await Card.findAll({
                        raw : true,
                        where : {
                            cid : bot
                        }
                    })
                    console.log("resultB2: ", tempB)
                }
            }
            const Json = {who: "bot", code: fCode, top : tempT , mid : tempM , bot : tempB};
            const result = await History.create({
                question: input_string,
                code: fCode
            });
            return res.status(200).json(Json);
        }catch (err){
            console.error("에러");
            return res.status(404).send("데이터 베이스 연결 에러");
        }
    }catch (err){
        console.error("에러");
        return res.status(500).send("파이썬 코드 연결 에러");
    }
});
app.post('/ask', async (req, res) => {
    try{
        const ask = req.body.ask;
        const askInsert = await Ask.create({
            ask: ask,
            check: 0
        });
        console.log("ask성공");
        return res.status(200).send("성공했습니다.");
    }catch (err){
        console.error("에러");
        return res.status(500).send("에러");
    }
});
app.post('/code', async (req, res) => {
    try{
        const question = req.body.question;
        const fCode = req.body.code;

        const result1 = await Code.findOne({
            where : {
                code : fCode
            }
        })
        console.log("데이터: ", result1.dataValues)
        const top = result1.dataValues.top.split(",");
        console.log("top: ", top)
        const tempT = await Card.findAll({
            raw : true,
            where : {
                cid : top
            }
        })
        console.log("resultT2: ", tempT)
        let tempM = [];
        let tempB = [];
        if(result1.dataValues.mid){
            const mid = result1.dataValues.mid.split(",");
            console.log("mid: ", mid)
            tempM = await Card.findAll({
                raw : true,
                where : {
                    cid : mid
                }
            })
            console.log("resultM2: ", tempM)
            if(result1.dataValues.bot){
                const bot = result1.dataValues.bot.split(",");
                console.log("bot: ", bot)
                tempB = await Card.findAll({
                    raw : true,
                    where : {
                        cid : bot
                    }
                })
                console.log("resultB2: ", tempB)
            }
        }
        const Json = {who: "bot", code: fCode,top : tempT , mid : tempM , bot : tempB};
        const result = await History.create({
            question: question,
            code: fCode
        });
        return res.status(200).json(Json);
    }catch (err){
        console.error("에러");
        return res.status(404).send("데이터 베이스 연결 에러");
    }
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중')
});