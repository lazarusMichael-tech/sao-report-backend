import express from 'express';
import 'dotenv/config';

const app = express();
app.use(express.json());

// 1. Health Endpoint (สำหรับ UptimeRobot ปลุกเซิร์ฟเวอร์)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Job Endpoint (สำหรับ Cron-job.org รันงาน Archive)
app.post('/api/jobs/archive', (req, res) => {
  // ตรวจสอบ Secret
  if (req.headers['x-job-secret'] !== process.env.JOB_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Fire-and-Forget: ตอบรับก่อน แล้วค่อยไปทำ logic ย้ายไฟล์
  res.status(202).json({ message: 'Archive job triggered' });
  
  console.log('Archive job triggered at:', new Date().toISOString());
  // ตรงนี้คุณจะเรียกฟังก์ชันย้ายไฟล์จาก Google Drive ในอนาคต
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));