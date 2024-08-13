import PDFDocument from 'pdfkit';
import { dbPromise } from '../connect.js';
import { PassThrough } from 'stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to convert stream to buffer
const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    const buffers = [];
    stream.on('data', chunk => buffers.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
    stream.on('error', reject);
  });
};

// Helper function to format dates
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-GB').format(date); // Change 'en-GB' to your preferred locale
};

// Helper function to get month name from number
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString('default', { month: 'long' });
};

export const generateAndSaveReport = async (req, res) => {
  const { childId, month } = req.body;

  try {
    // Fetch child's basic information
    const childQuery = 'SELECT * FROM child_form WHERE child_id = ?';
    const [childData] = await dbPromise.query(childQuery, [childId]);

    if (!childData.length) {
      console.error('Child data not found');
      return res.status(404).json({ error: 'Child data not found' });
    }

    // Fetch category-wise total marks, joining with questions to filter by month
    const responseQuery = `
      SELECT q.category_id, SUM(r.option_marks) as total_marks
      FROM responses r
      JOIN questions q ON r.question_id = q.question_id
      WHERE r.child_id = ? AND q.Month = ?
      GROUP BY q.category_id
    `;
    const [responseData] = await dbPromise.query(responseQuery, [childId, month]);

    if (!responseData.length) {
      console.error('No response data found for the given child and month');
      return res.status(404).json({ error: 'No response data found for the given child and month' });
    }

    // Create a new PDF document
    const doc = new PDFDocument({ size: 'A4' });
    const passThroughStream = new PassThrough();
    doc.pipe(passThroughStream);

    
    // Add report heading
    doc.fontSize(24).fillColor('orange').text('Child Report', { align: 'center', underline: true });
    doc.moveDown(2);

    // Format the date of birth
    const dob = formatDate(new Date(childData[0].dob));
    const formattedMonth = getMonthName(month);

    // Add child's basic information
    doc.fontSize(14).fillColor('black').text(`Name: ${childData[0].babyName} ${childData[0].middleName} ${childData[0].babyLastName}`);
    doc.text(`Date of Birth: ${dob}`);
    doc.text(`Month: ${formattedMonth}`);
    doc.text(`Gender: ${childData[0].gender}`);
    doc.text(`Parent: ${childData[0].parentName}`);
    doc.moveDown(2);

    // Add results heading
    doc.fontSize(16).fillColor('black').text('Assessment Report', { underline: true });
    doc.moveDown();

    // Add table headers
    const tableTop = doc.y;
    doc.fontSize(14).text('Area', 50, tableTop, { continued: true, underline: true })
      .text('Total Score', 200, tableTop, { continued: true, underline: true })
      .text('Score Interpretation', 350, tableTop, { underline: true });
    doc.moveDown();

    // Add category-wise total scores and interpretations
    const categories = [
      'Communication',
    'Gross Motor',
    'Fine Motor',
    'Problem Solving',
    'Personal Social Interaction'
    ];
    responseData.forEach(response => {
      const category = categories[response.category_id - 1];
      const totalMarks = response.total_marks;

      doc.fontSize(12).text(category, 50, doc.y, { continued: true });
      doc.fontSize(12).text(totalMarks.toString(), 200, doc.y, { continued: true });

      // Define interpretation and color
      let interpretation = 'Normal';
      let color = 'black';
      if (totalMarks < 50) {
        interpretation = 'Need Improvement';
        color = 'red';
      } else if (totalMarks > 50) {
        interpretation = 'Good';
        color = 'green';
      }

      doc.fontSize(12).fillColor(color).text(interpretation, 350, doc.y);
      doc.moveDown();

      // Draw score bar
      const barWidth = totalMarks; // Adjust scale if needed
      const barHeight = 10;
      doc.fillColor('orange').rect(50, doc.y, barWidth, barHeight).fill();
      doc.moveDown(barHeight + 5);
    });

    // Finalize the PDF
    doc.end();

    // Convert the PDF stream to buffer
    const pdfBuffer = await streamToBuffer(passThroughStream);

    // Save report to the database as BLOB
    const reportQuery = `
      INSERT INTO reports (child_id, month, pdf_content, status)
      VALUES (?, ?, ?, 'Pending')
    `;
    await dbPromise.query(reportQuery, [childId, month, pdfBuffer]);

    // Save the PDF file to the backend folder
    const pdfFolderPath = path.join(__dirname, '../pdf');
    if (!fs.existsSync(pdfFolderPath)) {
      fs.mkdirSync(pdfFolderPath);
    }
    const pdfFilePath = path.join(pdfFolderPath, `report_${childId}_${month}.pdf`);
    fs.writeFileSync(pdfFilePath, pdfBuffer);

    // Send a success response
    res.status(200).json({ message: 'Report generated and saved successfully' });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
