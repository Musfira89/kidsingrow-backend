import { db } from "../connect.js";

// Add question endpoint
export const addQuestion = (req, res) => {
    const { month, category, questions } = req.body;

    // Fetch the category id from the Category table
    const categoryQuery = 'SELECT category_id FROM categories WHERE category_name = ?';
    db.query(categoryQuery, [category], (categoryError, categoryResults) => {
        if (categoryError) {
            console.error('Error fetching category:', categoryError);
            return res.status(500).json({ success: false, error: 'Server error' });
        }

        if (categoryResults.length === 0) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }

        const categoryId = categoryResults[0].category_id;

        // Insert questions into the Questions table
        const questionsQuery = 'INSERT INTO questions (Month, category_id, Question_text) VALUES ?';
        const questionValues = questions.map(question => [month, categoryId, question]);

        db.query(questionsQuery, [questionValues], (questionError, questionResults) => {
            if (questionError) {
                console.error('Error adding questions:', questionError);
                return res.status(500).json({ success: false, error: 'Server error' });
            }

            console.log('Questions added successfully');
            return res.status(200).json({ success: true, message: 'Questions added successfully' });
        });
    });
};
