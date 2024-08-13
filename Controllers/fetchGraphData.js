import { dbPromise } from '../connect.js';

export const fetchGraphData = async (req, res) => {
  const { childId } = req.params;

  try {
    // Fetch child's basic information
    const childQuery = 'SELECT * FROM child_form WHERE child_id = ?';
    const [childData] = await dbPromise.query(childQuery, [childId]);

    if (!childData.length) {
      return res.status(404).json({ error: 'Child data not found' });
    }

    // Fetch category-wise total marks from the reports table
    const responseQuery = `
      SELECT q.category_id, SUM(r.option_marks) as total_marks
      FROM responses r
      JOIN questions q ON r.question_id = q.question_id
      WHERE r.child_id = ?
      GROUP BY q.category_id
    `;
    const [responseData] = await dbPromise.query(responseQuery, [childId]);

    if (!responseData.length) {
      return res.status(404).json({ error: 'No response data found for the given child' });
    }

    const categories = [
      'Communication',
      'Social Interaction',
      'Gross Motor Skill',
      'Fine Motor Skills',
      'Problem Solving'
    ];

    // Create a result object with category names and total marks
    const graphData = categories.map((category, index) => ({
      category,
      totalMarks: responseData.find(response => response.category_id - 1 === index)?.total_marks || 0
    }));

    // Send the result as a response
    res.status(200).json({ graphData });
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};