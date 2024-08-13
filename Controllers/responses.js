// controllers/responseController.js
import { dbPromise } from '../connect.js';

export const saveResponse = async (req, res) => {
  const { child_id, question_id, option_marks } = req.body;

  const query = 'INSERT INTO responses (child_id, question_id, option_marks) VALUES (?, ?, ?)';

  try {
    await dbPromise.query(query, [child_id, question_id, option_marks]);
    res.status(201).send('Response saved successfully');
  } catch (err) {
    console.error('Error saving response:', err);
    res.status(500).send('Error saving response');
  }
};


export const getResponses = async (req, res) => {
  const { childId } = req.params;

  const query = `
    SELECT r.question_id, q.category_id, r.option_marks
    FROM responses r
    JOIN questions q ON r.question_id = q.question_id
    WHERE r.child_id = ?
  `;

  try {
      const [results] = await dbPromise.query(query, [childId]);

      const categoryTotals = results.reduce((acc, response) => {
          const { category_id, option_marks } = response;
          acc[category_id] = (acc[category_id] || 0) + option_marks;
          return acc;
      }, {});

      res.status(200).json(categoryTotals);
  } catch (err) {
      console.error('Error fetching responses:', err);
      res.status(500).send('Error fetching responses');
  }
};