import nodemailer from 'nodemailer'

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, phone, email, project, details } = req.body

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: `"AMY Electric Lead" <${process.env.EMAIL_FROM || 'noreply@amyelectric.com'}>`,
    to: process.env.EMAIL_TO || 'info@amyelectric.com',
    subject: `New Lead: ${project || 'Electrical Service'} — ${name}`,
    html: `
      <h2>New Lead Submission</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:600px">
        <tr><td style="border-bottom:1px solid #eee"><strong>Name</strong></td><td style="border-bottom:1px solid #eee">${name}</td></tr>
        <tr><td style="border-bottom:1px solid #eee"><strong>Phone</strong></td><td style="border-bottom:1px solid #eee">${phone}</td></tr>
        <tr><td style="border-bottom:1px solid #eee"><strong>Email</strong></td><td style="border-bottom:1px solid #eee">${email || 'N/A'}</td></tr>
        <tr><td style="border-bottom:1px solid #eee"><strong>Project Type</strong></td><td style="border-bottom:1px solid #eee">${project || 'N/A'}</td></tr>
        <tr><td><strong>Details</strong></td><td>${details || 'N/A'}</td></tr>
      </table>
      <p style="margin-top:16px;color:#666;font-size:13px">Lead from AMY Electric website.</p>
    `,
    text: `New Lead: ${name} (${phone})\nProject: ${project || 'N/A'}\nEmail: ${email || 'N/A'}\nDetails: ${details || 'N/A'}`,
  }

  try {
    await transporter.sendMail(mailOptions)
    res.status(200).json({ success: true, message: 'Lead received' })
  } catch (error) {
    console.error('Email error:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
}
