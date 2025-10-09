import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // 465ならtrue
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.BASE_URL}/verify?token=${token}`;
  
  await transporter.sendMail({
    from: `"SupportHub" <${process.env.SMTP_USER}>`,
    to,
    subject: "メール認証のお願い",
    html: `
      <p>以下のリンクをクリックしてメール認証を完了してください：</p>
      <a href="${url}">${url}</a>
    `,
  });
}

export async function sendTaskNewEmail(to:string, id:string, inquiry_title:string, inquiry_detail:string) {
  const url = `${process.env.BASE_URL}/tasksdetail/${id}`;

  await transporter.sendMail({
    from: `"SupportHub" <${process.env.SMTP_USER}>`,
    to,
    subject: `SupportHub[問合せ(新規)]${inquiry_title}`,
    html: `
      <p>新規のお問い合わせが ${to} 宛てにありました。</p>
      <p>リンク先：<a href="${url}">${url}</a></p>
      <p>【問合せ概要】</p>
      <p>${inquiry_title}</p>
      <p>【問合せ詳細】</p>
      <p>${inquiry_detail}</p>
    `,
  });
}
