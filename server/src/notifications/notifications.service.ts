import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

export type PlacementDriveEmailData = {
  companyName?: string;
  driveName?: string;
  jobLocation?: string | null;
  jobDescriptionUrl?: string | null;
  companyApplyUrl?: string | null;
  minCgpa?: number | null;
  maxBacklog?: number | null;
  startDate?: string | Date | null;
  registrationDeadline?: string | Date | null;
  regDeadline?: string | Date | null;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND);
  }

  async sendEmail(email: string, companyData: PlacementDriveEmailData) {
    const companyName = companyData.companyName ?? companyData.driveName ?? 'New Company Opportunity';
    const location = companyData.jobLocation ?? 'Indore / Campus';
    const minCgpa = companyData.minCgpa !== null && companyData.minCgpa !== undefined
      ? `${companyData.minCgpa} CGPA`
      : 'No Minimum Cutoff';
    const maxBacklog = companyData.maxBacklog !== null && companyData.maxBacklog !== undefined
      ? `${companyData.maxBacklog} Allowed`
      : 'No Restrictions';

    const escapeHtml = (val: string) =>
      val
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const formatDate = (value: string | Date | null | undefined) => {
      if (!value) return 'Not Specified';
      try {
        return new Date(value).toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
      } catch {
        return 'Not Specified';
      }
    };

    const driveDateFormatted = formatDate(companyData.startDate);
    const deadlineFormatted = formatDate(
      companyData.registrationDeadline ?? companyData.regDeadline,
    );

    const senderEmail = `${process.env.SENDER_EMAIL}`;
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Placement Drive: ${escapeHtml(companyName)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 36px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0C1E69 0%, #1D41E3 100%); padding: 36px 32px; text-align: left;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <!-- Tag Badge -->
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.16); color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.3); margin-bottom: 14px;">
                      ✦ Verified Campus Drive Alert
                    </span>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; line-height: 1.3; letter-spacing: -0.4px;">
                      ${escapeHtml(companyName)}
                    </h1>
                    <p style="margin: 8px 0 0; color: #BBCBFF; font-size: 14px; font-weight: 500;">
                      📍 ${escapeHtml(location)} &nbsp;•&nbsp; Campus Placement
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px; color: #334155; font-size: 15px; line-height: 1.6;">
                Hello Student,<br><br>
                A new campus placement opportunity has been posted. Review the eligibility parameters and schedule below to register before the deadline.
              </p>

              <!-- Eligibility Grid Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="padding: 16px 20px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                    <span style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">
                      Minimum CGPA
                    </span>
                    <span style="display: block; font-size: 16px; font-weight: 700; color: #0F172A; margin-top: 4px;">
                      🎓 ${escapeHtml(minCgpa)}
                    </span>
                  </td>
                  <td width="50%" style="padding: 16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">
                      Max Backlogs
                    </span>
                    <span style="display: block; font-size: 16px; font-weight: 700; color: #0F172A; margin-top: 4px;">
                      📋 ${escapeHtml(maxBacklog)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding: 16px 20px; border-right: 1px solid #e2e8f0;">
                    <span style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748B; letter-spacing: 0.5px;">
                      Drive Date
                    </span>
                    <span style="display: block; font-size: 15px; font-weight: 600; color: #1D41E3; margin-top: 4px;">
                      📅 ${escapeHtml(driveDateFormatted)}
                    </span>
                  </td>
                  <td width="50%" style="padding: 16px 20px;">
                    <span style="display: block; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #B45309; letter-spacing: 0.5px;">
                      Deadline
                    </span>
                    <span style="display: block; font-size: 15px; font-weight: 700; color: #D97706; margin-top: 4px;">
                      ⏰ ${escapeHtml(deadlineFormatted)}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 8px; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        ${companyData.companyApplyUrl
        ? `
                        <td align="center" style="border-radius: 8px; background-color: #1D41E3;">
                          <a href="${escapeHtml(companyData.companyApplyUrl)}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 8px; letter-spacing: 0.3px;">
                            Apply for Placement Drive &rarr;
                          </a>
                        </td>
                        `
        : ''
      }
                        ${companyData.jobDescriptionUrl
        ? `
                        <td align="center" style="padding-left: 12px;">
                          <a href="${escapeHtml(companyData.jobDescriptionUrl)}" target="_blank" style="display: inline-block; padding: 13px 24px; font-size: 14px; font-weight: 600; color: #1D41E3; text-decoration: none; border-radius: 8px; border: 1.5px solid #1D41E3; background-color: #EEF2FF;">
                            View Job Description
                          </a>
                        </td>
                        `
        : ''
      }
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <div style="background-color: #f8fafc; border-left: 4px solid #1D41E3; border-radius: 4px; padding: 14px 16px; margin-top: 8px;">
                <p style="margin: 0; color: #475569; font-size: 12px; line-height: 1.5;">
                  <strong>Important Notice:</strong> Ensure your student profile, resume, and academic marks align with the eligibility criteria before applying.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 6px; color: #64748B; font-size: 12px; font-weight: 500;">
                Campus Placement Drive Notification System &nbsp;|&nbsp; Automated Alert
              </p>
              <p style="margin: 0; color: #94A3B8; font-size: 11px; line-height: 1.4;">
                This notification is sent to verified students who enabled drive alerts on their CampusDrive Tracker profile.
                <br>
                For questions or support, contact <a href="mailto:rajputkrishuuu@gmail.com" style="color: #1D41E3; text-decoration: none;">rajputkrishuuu@gmail.com</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    try {
      const response = await this.resend.emails.send({
        from: senderEmail,
        to: email,
        subject: `🎯 New Campus Placement Drive: ${companyName}`,
        html: htmlContent,
      });

      if (response.error) {
        this.logger.error(`Resend API Error: ${JSON.stringify(response.error)}`);
        return { success: false, error: response.error };
      }

      this.logger.log(`Email successfully sent to ${email} (ID: ${response.data?.id})`);
      return { success: true, id: response.data?.id };
    } catch (err: any) {
      this.logger.error(`Exception while sending email: ${err.message}`);
      return { success: false, error: err.message };
    }
  }
}
