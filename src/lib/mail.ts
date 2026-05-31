import nodemailer from "nodemailer";

type MailCharacter = {
  hash: string;
  name: string;
  concept: string;
  ancestry: string;
  path: string;
  bond: string;
};

type PortraitAttachment = {
  filename: string;
  path: string;
  contentType: string;
};

function envBool(value: string | undefined) {
  return value?.toLowerCase() === "true";
}

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required mail environment variable: ${name}`);
  }

  return value;
}

function mailTransport() {
  const port = Number(process.env.EMAIL_PORT ?? 587);
  const useTls = envBool(process.env.EMAIL_USE_TLS);

  return nodemailer.createTransport({
    host: requiredEnv("EMAIL_HOST"),
    port,
    secure: port === 465,
    requireTLS: useTls,
    auth: {
      user: requiredEnv("EMAIL_USER"),
      pass: requiredEnv("EMAIL_PASSWORD"),
    },
  });
}

function characterUrl(origin: string, hash: string) {
  return new URL(`/characters/${hash}`, origin).toString();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function characterSummary(character: MailCharacter, url: string) {
  return [
    `Name: ${character.name}`,
    `Hash: ${character.hash}`,
    `URL: ${url}`,
    `Konzept: ${character.concept}`,
    `Abstammung: ${character.ancestry}`,
    `Weg: ${character.path}`,
    `Bindung: ${character.bond}`,
  ].join("\n");
}

function characterSummaryHtml(character: MailCharacter, url: string) {
  const escapedUrl = escapeHtml(url);

  return `
    <p><strong>Name:</strong> ${escapeHtml(character.name)}</p>
    <p><strong>Hash:</strong> ${escapeHtml(character.hash)}</p>
    <p><strong>URL:</strong> <a href="${escapedUrl}">${escapedUrl}</a></p>
    <p><strong>Konzept:</strong> ${escapeHtml(character.concept)}</p>
    <p><strong>Abstammung:</strong> ${escapeHtml(character.ancestry)}</p>
    <p><strong>Weg:</strong> ${escapeHtml(character.path)}</p>
    <p><strong>Bindung:</strong> ${escapeHtml(character.bond)}</p>
  `;
}

async function sendAdminMail({
  subject,
  text,
  html,
  attachments,
}: {
  subject: string;
  text: string;
  html: string;
  attachments?: PortraitAttachment[];
}) {
  const from = requiredEnv("DEFAULT_FROM_EMAIL");
  const to = requiredEnv("EMAIL_ADMIN_ADDR");

  await mailTransport().sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments,
  });
}

export async function sendCharacterCreatedMail(character: MailCharacter, origin: string) {
  const url = characterUrl(origin, character.hash);

  await sendAdminMail({
    subject: `Neuer Tirakan-Charakter: ${character.name}`,
    text: `Ein neuer Charakter wurde erstellt.\n\n${characterSummary(character, url)}`,
    html: `<p>Ein neuer Charakter wurde erstellt.</p>${characterSummaryHtml(character, url)}`,
  });
}

export async function sendPortraitUploadedMail(
  character: MailCharacter,
  origin: string,
  attachment: PortraitAttachment,
) {
  const url = characterUrl(origin, character.hash);

  await sendAdminMail({
    subject: `Portrait hochgeladen: ${character.name}`,
    text: `Ein Portrait wurde hochgeladen.\n\n${characterSummary(character, url)}`,
    html: `<p>Ein Portrait wurde hochgeladen.</p>${characterSummaryHtml(character, url)}`,
    attachments: [attachment],
  });
}
