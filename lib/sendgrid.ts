import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// ----------------------------------------
// 認証メール
// ----------------------------------------
export async function sendVerificationEmail(to: string, token: string) {
  const url = `${process.env.BASE_URL}/verify?token=${token}`;

  await sgMail.send({
    to: to || process.env.SUPPORTHUB_TO!,
    from: {
      email: process.env.SUPPORTHUB_FROM!,
      name: process.env.SUPPORTHUB_FROM_NAME!,
    },
    subject: "メール認証のお願い",
    html: `
      <p>以下のリンクをクリックしてメール認証を完了してください：</p>
      <a href="${url}">${url}</a>
    `,
  });
}

// ----------------------------------------
// タスク新規メール
// ----------------------------------------
export async function sendTaskNewEmail(
  to: string,
  id: string,
  inquiry_title: string,
  inquiry_detail: string
) {
  const url = `${process.env.BASE_URL}/tasksdetail/${id}`;

  await sgMail.send({
    to: to || process.env.SUPPORTHUB_TO!,
    from: {
      email: process.env.SUPPORTHUB_FROM!,
      name: process.env.SUPPORTHUB_FROM_NAME!,
    },
    subject: `SupportHub[問合せ(新規)]：${inquiry_title}`,
    html: `
      <p>新しいお問い合わせが届きました。</p>
      <p><strong>リンク先：</strong> <a href="${url}">${url}</a></p>
      <p><strong>【問合せ概要】</strong></p>
      <p>${inquiry_title}</p>
      <p><strong>【問合せ詳細】</strong></p>
      <p>${inquiry_detail.replace(/\r?\n/g, "<br>")}</p>
    `,
  });
}

// ----------------------------------------
// タスク更新メール
// ----------------------------------------
export async function sendTaskEditEmail(
  to: string,
  id: string,
  inquiry_title: string,
  inquiry_detail: string
) {
  const url = `${process.env.BASE_URL}/tasksdetail/${id}`;

  await sgMail.send({
    to: to || process.env.SUPPORTHUB_TO!,
    from: {
      email: process.env.SUPPORTHUB_FROM!,
      name: process.env.SUPPORTHUB_FROM_NAME!,
    },
    subject: `SupportHub[問合せ(更新)]：${inquiry_title}`,
    html: `
      <p>お問い合わせが更新されました。</p>
      <p><strong>リンク先：</strong> <a href="${url}">${url}</a></p>
      <p><strong>【問合せ概要】</strong></p>
      <p>${inquiry_title}</p>
      <p><strong>【問合せ詳細】</strong></p>
      <p>${inquiry_detail.replace(/\r?\n/g, "<br>")}</p>
    `,
  });
}