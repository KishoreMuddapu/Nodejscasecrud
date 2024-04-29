const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

app.use(express.json());


app.get('/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/students/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [studentId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/students', async (req, res) => {
  const { name, group_name, grade } = req.body;

  try {
    const result = await pool.query('INSERT INTO students (name, group_name, grade) VALUES ($1, $2, $3) RETURNING *', [name, group_name, grade]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const { name, group_name, grade } = req.body;

  try {
    const result = await pool.query(
      'UPDATE students SET name = $1, group_name = $2, grade = $3 WHERE id = $4 RETURNING *',
      [name, group_name, grade, studentId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/students/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [studentId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Student not found' });
    } else {
      res.json({ message: 'Student deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
