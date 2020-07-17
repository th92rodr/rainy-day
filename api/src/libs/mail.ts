import nodemailer from 'nodemailer';

import MailConfig from '../config/mail';
import { capitalizeFirstLetter } from '../utils/strings';

const transporter = nodemailer.createTransport(MailConfig);

export default function sendEmails(
  receiversMails: string[],
  mailBody: string,
  frequency: string,
) {
  const mailOptions = {
    from: `Rainy Day <${MailConfig.auth.user}>`,
    to: receiversMails,
    subject: `Rainy Day - ${capitalizeFirstLetter(frequency)} Letter`,
    html: mailBody,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending emails: ', error);
    } else {
      console.log('Emails sent: ', info);
    }
  });
}
