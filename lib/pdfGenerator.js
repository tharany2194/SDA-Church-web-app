import jsPDF from 'jspdf';

const CHURCH_NAME = 'Grace Community Church';
const ACCENT_COLOR = [109, 40, 217]; // primary purple

function addHeader(doc, title) {
  doc.setFillColor(...ACCENT_COLOR);
  doc.rect(0, 0, 210, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(CHURCH_NAME, 15, 12);
  doc.setTextColor(40, 40, 40);
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(CHURCH_NAME, 15, 290);
    doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: 'right' });
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 285, 195, 285);
  }
}

export function downloadSermonPDF(sermon) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  addHeader(doc, CHURCH_NAME);

  let y = 28;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ACCENT_COLOR);
  const titleLines = doc.splitTextToSize(sermon.title, 180);
  doc.text(titleLines, 15, y);
  y += titleLines.length * 8;

  if (sermon.titleTa) {
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    const taLines = doc.splitTextToSize(sermon.titleTa, 180);
    doc.text(taLines, 15, y);
    y += taLines.length * 6 + 2;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const meta = [
    sermon.speaker && `Speaker: ${sermon.speaker}`,
    sermon.category && `Category: ${sermon.category}`,
    sermon.date && `Date: ${new Date(sermon.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
    sermon.duration && `Duration: ${sermon.duration} minutes`,
  ].filter(Boolean).join('   |   ');
  doc.text(meta, 15, y);
  y += 8;

  doc.setDrawColor(...ACCENT_COLOR);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);
  y += 8;

  if (sermon.content) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const contentLines = doc.splitTextToSize(sermon.content, 180);
    contentLines.forEach((line) => {
      if (y > 275) { doc.addPage(); y = 25; }
      doc.text(line, 15, y);
      y += 6;
    });
  }

  addFooter(doc);
  doc.save(`${sermon.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
}

export function downloadArticlePDF(article) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  addHeader(doc, CHURCH_NAME);

  let y = 28;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...ACCENT_COLOR);
  const titleLines = doc.splitTextToSize(article.title, 180);
  doc.text(titleLines, 15, y);
  y += titleLines.length * 8;

  if (article.titleTa) {
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    const taLines = doc.splitTextToSize(article.titleTa, 180);
    doc.text(taLines, 15, y);
    y += taLines.length * 6 + 2;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const meta = [
    article.author?.name && `By: ${article.author.name}`,
    article.category && `Category: ${article.category}`,
    article.publishedAt && `Published: ${new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
  ].filter(Boolean).join('   |   ');
  doc.text(meta, 15, y);
  y += 8;

  doc.setDrawColor(...ACCENT_COLOR);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);
  y += 8;

  if (article.excerpt) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    const excerptLines = doc.splitTextToSize(article.excerpt, 180);
    doc.text(excerptLines, 15, y);
    y += excerptLines.length * 6 + 5;
  }

  if (article.content) {
    const plainContent = article.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const contentLines = doc.splitTextToSize(plainContent, 180);
    contentLines.forEach((line) => {
      if (y > 275) { doc.addPage(); y = 25; }
      doc.text(line, 15, y);
      y += 6;
    });
  }

  addFooter(doc);
  doc.save(`${article.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
}
