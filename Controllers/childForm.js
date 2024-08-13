// controllers/childController.js
import { dbPromise } from '../connect.js';

export const submitChildForm = async (req, res) => {
    const {
        babyName, middleName, babyLastName, dob, gender, parentName, relationship, otherRelationship, city, state, zip, country, homeTelephone, otherTelephone, email, assistingPeople
    } = req.body;

    const sql = `
        INSERT INTO child_form (babyName, middleName, babyLastName, dob, gender, parentName, relationship, otherRelationship, city, state, zip, country, homeTelephone, otherTelephone, email, assistingPeople)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [babyName, middleName, babyLastName, dob, gender, parentName, relationship, otherRelationship, city, state, zip, country, homeTelephone, otherTelephone, email, assistingPeople];

    try {
        const [result] = await dbPromise.query(sql, values);
        const child_id = result.insertId;
        res.status(201).json({ message: 'Child form submitted successfully', child_id });
    } catch (err) {
        console.error('Error submitting child form:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getChildData = async (req, res) => {
    const { childId } = req.params;

    const sql = 'SELECT * FROM child_form WHERE child_id = ?';

    try {
        const [results] = await dbPromise.query(sql, [childId]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Child data not found' });
        }

        res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error fetching child data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
