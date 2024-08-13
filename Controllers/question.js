// controllers/questionController.js
import { dbPromise } from '../connect.js';

export const getQuestions = async (req, res) => {
    const { month, category } = req.params;
    const query = `SELECT * FROM questions WHERE category_id = ? AND Month = ?`;
  
    console.log('Fetching questions for:', { month, category });
  
    try {
        const [results] = await dbPromise.query(query, [category, month]);
        console.log('Questions fetched:', results);
        res.json(results);
    } catch (err) {
        console.error('Error fetching questions:', err);
        res.status(500).send('Error fetching questions');
    }
};
