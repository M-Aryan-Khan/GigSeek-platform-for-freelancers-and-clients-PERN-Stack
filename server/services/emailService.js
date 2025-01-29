import pkg from 'pg';
const { Client } = pkg;
import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.client = new Client({
      user: 'postgres',
      password: 'Aryankhan@2004',
      host: 'localhost',
      port: 5432,
      database: 'freelance_ms',
    });

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "goku.mui.kaioken@gmail.com",
        pass: "htkk nexd twsl mdgz",
      },
    });
  }

  async connect() {
    try {
      await this.client.connect();
      
      await this.client.query('LISTEN email_channel');
      console.log('Listening for email notifications on email_channel');

      this.client.on('notification', this.handleNotification.bind(this));
      this.client.on('error', this.handleError.bind(this));

    } catch (error) {
      console.error('Error in connecting to database:', error);
      this.reconnect();
    }
  }

  async handleNotification(msg) {
    console.log('Received notification:', msg.payload);
    const payload = JSON.parse(msg.payload);
    
    try {
      const info = await this.transporter.sendMail({
        from: 'goku.mui.kaioken@gmail.com',
        to: payload.to,
        subject: payload.subject,
        text: payload.body
      });
      console.log('Email sent successfully:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  handleError(err) {
    console.error('Error on database connection:', err);
    this.reconnect();
  }

  async reconnect() {
    console.log('Attempting to reconnect...');
    setTimeout(() => this.connect(), 5000);
  }

  async disconnect() {
    try {
      await this.client.end();
      console.log('Disconnected from database');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }
}

const emailService = new EmailService();

export default emailService;

