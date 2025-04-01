const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

// DB connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: "3306",
  user: 'root',
  password: 'cometrue',
  database: 'db_luckyseven'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Middleware
app.use(cors());
app.use(express.json());


//아이디 중복체크
app.post('/idcheck', async (req, res) => {
  const { id } = req.body; // 요청 본문에서 email과 password를 추출
  try {
      const [results] = await connection.promise().query('SELECT * FROM member WHERE id = ?', [id]);
      if (results.length > 0) {
          res.status(200).json({message: '이미 존재하는 아이디입니다. 다른 아이디를 사용해주세요.'}); //이미 아이디가 있는 상태       
      } else {
        res.status(404).json({ message: '사용할 수 있는 아이디입니다.' });  //아이디가 없는 상태
      }
  } catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
});

//회원가입
app.post('/register', async (req, res) => {
  const { name, id, password } = req.body; // 요청 본문에서 가입 정보를 추출
  connection.query(
    'INSERT INTO member (name, id, pw) VALUES (?, ?, ?)',
    [name, id, password],
    (err, results) => {
      if (err) {
        console.error('Error inserting Member:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      const newMember = {
        id:results.insertId,
        name,
        id,
        password
      };
      res.status(201).json(newMember);
    });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body; // 요청 본문에서 email과 password를 추출
  try {
      const [results] = await connection.promise().query('SELECT * FROM member WHERE id = ? AND pw = ?', [email, password]);
      if (results.length > 0) {
          res.status(200).json(results[0]); // 로그인 성공 시 결과 반환
       
      } else {
        res.status(404).json({ message: '이메일 또는 비밀번호가 틀렸습니다.' });  // 로그인 실패 시 json으로 반환해야함
      }
  } catch (error) {
      console.error('Database query error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API endpoint to get schedules
// API endpoint to get schedules for a specific user
app.get('/api/schedules', (req, res) => {
  const memberId = req.query.memberId; // 쿼리 파라미터에서 memberId 가져오기
  connection.query('SELECT * FROM schedule WHERE member_id = ?', [memberId], (err, results) => {
    if (err) {
      console.error('Error fetching schedules:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    const transformedResults = results.map((eventData) => ({
      id: eventData.schedule_id,
      calendarId: eventData.calendar_id,          // 캘린더 ID
      title: eventData.title,                     // 제목
      isAllDay: eventData.all_day,                // 종일 여부
      start: eventData.start_time,                // 시작 시간
      end: eventData.end_time,                    // 종료 시간
      category: eventData.category,               // 카테고리
      location: eventData.location,               // 위치 정보
      state: eventData.state,                     // 상태 정보
    }));
    
    res.json(transformedResults); // 변환된 데이터 반환
  });
});

app.post('/api/schedules', (req, res) => {
  console.log('Received POST request with data:', req.body); // JSON 데이터 확인
  const { memberId, calendarId, title, isAllday, start, end, category, location, state } = req.body;

  // 데이터베이스에 새 일정을 삽입하는 쿼리
  connection.query(
    'INSERT INTO schedule (member_id, calendar_id, title, start_time, end_time, all_day, category, location, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [memberId, calendarId, title, start, end, isAllday, category, location, state],
    (err, results) => {
      if (err) {
        console.error('Error inserting schedule:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      const newSchedule = {
        id: results.insertId, // Auto-generated ID from the database
        memberId,
        calendarId,
        title,
        start,
        end,
        isAllday,
        category,
        location,
        state,
      };
      console.log(newSchedule);
      res.status(201).json(newSchedule);
    }
  );
});


// PUT - Update an existing schedule by ID
app.put('/api/schedules/:id', (req, res) => {
  console.log('Received Put request with data:', req.params); // JSON 데이터 확인
  console.log('Received Put request with data:', req.body); // JSON 데이터 확인
  const { id } = req.params;
  const { memberId, calendarId, title, start, end, category, location, state, isAllday  } = req.body

  const chstart = new Date(start);
  const chend = new Date(end);

  // 기존 일정을 업데이트하는 쿼리
  connection.query(
    'UPDATE schedule SET calendar_id = ?, title = ?, start_time = ?, end_time = ?, all_day = ?, category = ?, location = ?, state = ? WHERE schedule_id = ? AND member_id = ?',
    [calendarId, title, chstart, chend, isAllday, category, location, state, id, memberId], // memberId 추가
    (err, results) => {
      if (err) {
        console.error('Error updating schedule:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Schedule not found or you do not have permission to update it.' });
      }
      console.log(results);
      res.status(200).json({ message: 'Schedule updated successfully' });
    }
  );
});

app.delete('/api/schedules/:id', (req, res) => {
  const { id } = req.params;

  // 일정 삭제 쿼리
  connection.query(
    'DELETE FROM schedule WHERE schedule_id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error('Error deleting schedule:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      res.status(200).json({ message: 'Schedule deleted successfully' });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
