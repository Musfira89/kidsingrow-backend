// controllers/optionsController.js
import { dbPromise } from '../connect.js';

export const getOptions = async (req, res) => {
  const { questionId } = req.params;
  const query = 'SELECT * FROM options WHERE question_id = ?';

  try {
    const [results] = await dbPromise.query(query, [questionId]);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching options:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
