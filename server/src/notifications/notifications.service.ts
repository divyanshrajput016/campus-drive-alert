import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';


@Injectable()
export class NotificationsService {
    private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND);
  }

    async sendEmail(email : string , companyData : string) {
    const { data, error } = await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: `${email}`,
      subject: 'New Placement Drive 🚀',
      html: `
        <h2>New Placement Drive</h2>

        <p>A new company has been added to your college placement portal.</p>

        <h3>Company: ${companyData}</h3>
        <p><strong>Package:</strong> ${companyData}</p>

        <br>

        <p>Check the placement portal for more details.</p>

        
      `,
    });

    if (error) {
      console.error(error);
      return;
    }

    console.log('Email sent:', data);
  }

}
