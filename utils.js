const tls = require('tls');
const { execSync } = require('child_process');
const fs = require('fs');

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getSubjectAlternativeNames(certificate) {
  if (certificate.extensions && certificate.extensions.subjectAltName) {
    const subjectAltNames = certificate.extensions.subjectAltName.split(",");
    console.log("subjectAltNames:", subjectAltNames);
    return subjectAltNames.map((name) => name.trim());
  } else {
    return null;
  }
}



function getCertificateKeySize(certificate) {
  const publicKeyPem = `-----BEGIN CERTIFICATE-----\n${certificate.raw.toString('base64')}\n-----END CERTIFICATE-----`;
  const tempCertFilename = 'temp_cert.pem';
  fs.writeFileSync(tempCertFilename, publicKeyPem);

  try {
    const output = execSync(`openssl x509 -in ${tempCertFilename} -text -noout`).toString();
    const keySizeMatch = output.match(/RSA Public-Key: \((\d+) bit\)/);
    return keySizeMatch ? parseInt(keySizeMatch[1], 10) : undefined;
  } catch (error) {
    console.error('Error fetching key size:', error);
    return undefined;
  } finally {
    fs.unlinkSync(tempCertFilename);
  }
}

function compareCertificatesByExpiration(a, b) {
  if (a.valid_to < b.valid_to) {
    return -1;
  }
  if (a.valid_to > b.valid_to) {
    return 1;
  }
  return 0;
}

function isExpiringSoon(validTo) {
  const expiresInMs = new Date(validTo) - new Date();
  const expiresInDays = expiresInMs / (1000 * 60 * 60 * 24);
  return expiresInDays <= 28;
}

function isKeySizeTooSmall(keySize) {
  return keySize < 2048;
}

function isSelfSigned(certificate) {
  return certificate.subject.CN === certificate.issuer.CN;
}

module.exports = {
  formatDate,
  getSubjectAlternativeNames,
  getCertificateKeySize,
  compareCertificatesByExpiration,
  isExpiringSoon,
  isKeySizeTooSmall,
  isSelfSigned,
};
